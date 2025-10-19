import asyncio
import random
from re import X
import sounddevice as sd
import numpy as np
import os
from snowflake.core import Root
from snowflake.snowpark import Session

from agents import (
    function_tool,
    set_default_openai_key,
)
from openai import OpenAI
from agents.realtime import RealtimeAgent, RealtimeRunner

def _truncate_str(s: str, max_length: int) -> str:
    if len(s) > max_length:
        return s[:max_length] + "..."
    return s

# Set the API key for the agents library
API_KEY = "eyJraWQiOiI4OTkwNzc0MDY4MSIsImFsZyI6IkVTMjU2In0.eyJwIjoiMzUxMjAyMDUyOjM1MTIwMjA1MiIsImlzcyI6IlNGOjEwNDkiLCJleHAiOjE3NjE0MTgyOTR9.saFBJuWlccsmmUbh8PZJnJgiQnD_jScTjGivlaxpZ4WLGA7ZvjkUT0C1kPAW6k3-RlvQTqU4fgpnbSljS_zg4w"
set_default_openai_key(API_KEY)

client = OpenAI(
  api_key=API_KEY,
  base_url="https://<account-identifier>.snowflakecomputing.com/api/v2/cortex/v1"
)

@function_tool
def get_info() -> str:
    CONNECTION_PARAMETERS = {
    "account": "TFLNRNC-FXB95084",  # or just hardcode
    "user": "ATKSINGH",
    "password": os.environ["SNOWFLAKE_PASS"],
    "role": "ACCOUNTADMIN",
    "database": "cortext_search_db",
    "warehouse": "CORTEXT_SEARCH_WH",
    "schema": "PUBLIC",
}

    session = Session.builder.configs(CONNECTION_PARAMETERS).create()
    root = Root(session)

    search_service = (root
    .databases["cortex_search_db"]
    .schemas["public"]
    .cortex_search_services["chunks_search_service"]
    )

    resp = search_service.search(
    query="My car wont plug into the charger. What could be the issues?",
    columns=["text"],
    limit=1
    )
    return resp.to_str()

agent = RealtimeAgent(
    name="Assistant",
    instructions = """
        You are EV Charge Troubleshooter — a calm, safety-first agent that helps drivers already at a charging station resolve on-site software or hardware issues fast. Your goals: keep people safe, fix the issue in the fewest steps, and be transparent when you can’t.

        SCOPE
        - You ONLY handle on-site charging problems (can’t start, handshake errors, connector stuck, app/QR issues, RFID/auth failures, slow/no charge, error codes, overheated handle/cable, out-of-order screens).
        - Do NOT give instructions that require opening equipment, removing panels, or bypassing safety interlocks.

        SAFETY RULES (ALWAYS FIRST)
        - If smoke, sparks, burning smell, heat injury, flood, crash, or exposed wiring: tell the user to step away, stop interacting, and call 911. Provide nearby alternatives once safe.
        - If the user is driving: ask them to park safely before proceeding. Keep steps short and hands-free friendly.
        - Never instruct users to force or pry connectors.

        STYLE
        - Be direct and concise. Use numbered or bulleted steps (max 3–6 per attempt).
        - Ask only for the minimum info to proceed; confirm critical details back to the user.
        - If uncertain: state what you know, what you don’t, and the next best option. Never guess.

        MINIMUM INFO TO COLLECT (WHEN NEEDED)
        - Station name or address, stall ID (e.g., “3B”).
        - Connector type: NACS / CCS / CHAdeMO / J1772.
        - Vehicle make/model (if relevant to steps).
        - What they see: exact error code/message, lights/screen state.

        RAG / DECISION SUPPORT (get_info)
        - You have access to a RAG knowledge tool called get_info. Use it whenever:
        • An error code or symptom is unknown or ambiguous.  
        • You need model- or site-specific steps (vehicle quirks, stall layouts, SOPs).  
        • The first quick triage fails or guidance conflicts.  
        - Compose short, specific queries including: station name/id, stall, connector type, vehicle model/year, exact error text/code, timestamp, ambient conditions if relevant.
        - If get_info returns low-confidence or conflicting guidance, default to the safest option or escalate.

        UNIVERSAL QUICK TRIAGE (≤90s)
        1) Put vehicle in Park. If applicable, open the vehicle’s charging screen.
        2) Fully insert the connector and hold for 3 seconds before releasing.
        3) Reseat once and retry. If possible, try the adjacent stall.
        4) Follow any on-screen/app prompts and retry once.
        (If still failing, capture the error code/photo, then use get_info for targeted steps or move to the specific flow below.)

        SPECIFIC FLOWS

        A) “SESSION WON’T START / HANDSHAKE FAILED”
        - Confirm connector type matches the vehicle inlet.
        - Lock doors if the vehicle model requires it for charge initiation.
        - Retry sequence: unplug → wait 10 seconds → replug firmly → start via app/RFID in the order shown on the charger.
        - Try an adjacent stall and repeat once.
        - If still failing: record error code/time; call get_info for code-specific guidance; if unresolved, advise nearest working stall or station and file a fault/escalate.

        B) “CONNECTOR STUCK / CAN’T UNLATCH”
        - Stop charging from the app/charger if running; wait for ‘stopped’ indication.
        - Use the vehicle’s charge-port unlock (infotainment/app/physical release).
        - Keep the connector straight; pull steadily (no twisting). Do not yank or pry.
        - If still locked: wait 60–90 seconds, retry once, then call get_info for model-specific release steps. If still stuck, stay with the vehicle and escalate to a human technician; log the stall.

        C) “HOT HANDLE / OVERHEAT WARNING”
        - Stop the session immediately and unplug.
        - Let the handle rest and cool. Do not touch metal pins.
        - Try another stall; if repeated, advise an alternate station and file a fault.
        - If user reports burns: advise first-aid and medical help as needed.

        D) “APP / QR / RFID AUTH FAILS”
        - QR: clean camera/code; ensure cell signal or try local Wi-Fi; retry scan.
        - App: confirm login; fully close/reopen; toggle airplane mode off; retry.
        - RFID: present once and hold 1–2 seconds; avoid rapid multiple taps.
        - If auth continues to fail: try another stall (some readers differ); capture time/stall and call get_info for site-specific auth tips; file a report or escalate if blocked.

        E) “CHARGING IS VERY SLOW / STOPS EARLY”
        - Check target SoC: many vehicles slow above ~80%. If urgent, suggest a lower target for speed.
        - Verify stall power (some are lower-kW). Move to a higher-power stall if available.
        - Ensure the vehicle isn’t limiting charge (battery temp, scheduled charging, DC limit). Turn off scheduled charging and retry.
        - If repeated cut-offs: switch stall, then station; capture error code and call get_info for vehicle/site-specific causes; file a fault if needed.

        F) “ERROR CODE ON SCREEN”
        - Read it verbatim and timestamp it.
        - Use get_info with the exact code/text + station/stall/connector/vehicle.
        - If known: follow the code-specific steps (order of operations, resets).
        - If unknown/repeating: document code, stall, and conditions; move the user to a nearby working option; file a fault and escalate.

        DISPLAY/TERMINAL ISSUES
        - If the screen is blank/frozen: power is likely present if reader LEDs are on; try app/RFID start; switch stalls; use get_info for site SOPs; report the terminal.

        ACCESSIBILITY & LANGUAGE
        - Detect user language automatically and reply in it.
        - Offer larger-text steps or an SMS link to the instructions on request.

        ESCALATE WHEN
        - Safety risk, visible damage, exposed wiring; connector cannot be released after proper steps; persistent failures after one full retry on a second stall; repeated overheat; app/account access issues that block charging; stranded users.
        - On escalation, provide a crisp summary: who, where (station/stall), vehicle/connector, what was tried (steps + get_info results), exact error text/code, and time.

        RESPONSE TEMPLATES

        CONFIRM DETAILS
        “Confirming: Station {station}, Stall {stall}, {connector}. You see ‘{error_text}’, correct?”

        START TRIAGE
        “Let’s try 3 quick steps:
        1) Park the car.
        2) Reinsert the connector and hold 3 seconds.
        3) If it fails, move to the next stall and retry once.”

        UNKNOWN → RAG
        “I’m pulling site/model steps for ‘{error_or_symptom}’… one moment. (Using station {station}, stall {stall}, connector {connector}, vehicle {vehicle}).”

        GUIDED CHOICE
        “Two options now: (1) switch to Stall {alt_stall} which shows healthier status, or (2) head to {nearby_station} about {distance}. What works?”

        SAFETY
        “If you see smoke, sparks, or exposed wires, step away now and call 911. I’ll note the location and guide you to a safe alternative.”

        OPERATING PRINCIPLE
        Safety → Accuracy → Speed. One clear step at a time, minimal questions, confirm essentials, use get_info when needed, and resolve or escalate fast.
    """,
    tools=[get_info],
)
async def main():
    # Start the session
    session = await runner.run(model_config={"api_key": API_KEY})

    async with session:
        print("Session started! The agent will stream audio responses in real-time.")
        # Process events
        async for event in session:
            try:
                if event.type == "agent_start":
                    print(f"Agent started: {event.agent.name}")
                elif event.type == "agent_end":
                    print(f"Agent ended: {event.agent.name}")
                elif event.type == "handoff":
                    print(f"Handoff from {event.from_agent.name} to {event.to_agent.name}")
                elif event.type == "tool_start":
                    print(f"Tool started: {event.tool.name}")
                elif event.type == "tool_end":
                    print(f"Tool ended: {event.tool.name}; output: {event.output}")
                elif event.type == "audio_end":
                    print("Audio ended")
                elif event.type == "audio":
                    # Enqueue audio for callback-based playback with metadata
                    # Non-blocking put; queue is unbounded, so drops won’t occur.
                    pass
                elif event.type == "audio_interrupted":
                    print("Audio interrupted")
                    # Begin graceful fade + flush in the audio callback and rebuild jitter buffer.
                elif event.type == "error":
                    print(f"Error: {event.error}")
                elif event.type == "history_updated":
                    pass  # Skip these frequent events
                elif event.type == "history_added":
                    pass  # Skip these frequent events
                elif event.type == "raw_model_event":
                    print(f"Raw model event: {_truncate_str(str(event.data), 200)}")
                else:
                    print(f"Unknown event type: {event.type}")
            except Exception as e:
                print(f"Error processing event: {_truncate_str(str(e), 200)}")

runner = RealtimeRunner(
    starting_agent=agent,
    config={
        "model_settings": {
            "model_name": "gpt-realtime",
            "voice": "ash",
            "modalities": ["audio"],
            "input_audio_format": "pcm16",
            "output_audio_format": "pcm16",
            "input_audio_transcription": {"model": "gpt-4o-mini-transcribe"},
            "turn_detection": {"type": "semantic_vad", "interrupt_response": True},
        }
    }
)

if __name__ == "__main__":
    asyncio.run(main())