import os
from snowflake.core import Root
from snowflake.snowpark import Session

CONNECTION_PARAMETERS = {
    "account": os.environ["snowflake_account_demo"],  # or just hardcode
    "user": os.environ["snowflake_user_demo"],
    "password": os.environ["snowflake_password_demo"],
    "role": "test_role",
    "database": "test_database",
    "warehouse": "test_warehouse",
    "schema": "test_schema",
}

session = Session.builder.configs(CONNECTION_PARAMETERS).create()
root = Root(session)
# Replace these strings with your actual database/schema/service names
my_service = (
    root.databases["YOUR_DB"]
        .schemas["YOUR_SCHEMA"]
        .cortex_search_services["YOUR_SERVICE"]
)
resp = my_service.search(
    query="technology",              # what you want to search for
    columns=["DOCUMENT_CONTENTS", "LIKES"],  # list of fields you want back
    filter={"@eq": {"REGION": "US"}}, # (Optional) filters, see docs for logic
    limit=5                         # (Optional) num results, max 1000
)
print(resp.to_json())
