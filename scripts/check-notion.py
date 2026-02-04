from notion_client import Client
import json

c = Client(auth='ntn_E76109446161Jhjeach8UarGy0g8t1rsCUiK7pDHBB2f5l')

# Check available methods
print("Available database methods:", [m for m in dir(c.databases) if not m.startswith('_')])

# Try list
try:
    result = c.databases.list()
    print("Databases:", json.dumps(result, indent=2, default=str)[:2000])
except Exception as e:
    print(f"List error: {e}")
