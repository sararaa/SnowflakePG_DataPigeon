import os
from vapi import Vapi

# Initialize Vapi client
client = Vapi(token="186d7cd5-3e4e-469f-b5da-8a04bb91e556")

# Get the existing assistant
assistant = client.assistants.get("039e9a6e-8d42-4f6e-b107-55f6d56cbdd0")
print(f"Retrieved assistant: {assistant.id}")

# Update the assistant with the new configuration
#updated_assistant = client.assistants.update(
#    id=assistant.id,
#    **assistant_config
#)
#print(f"Updated assistant: {updated_assistant.id}")

# Start a call with the assistant
call = client.calls.create(
    assistant_id=assistant.id,
    phone_number_id="1d305616-76a1-40c7-8adc-763a3465f591",
    customer={"number": "+1"},
)

print(f"Started call: {call.id}")
