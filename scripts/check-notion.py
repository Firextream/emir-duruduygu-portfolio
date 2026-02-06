import os
import json
from notion_client import Client


def load_env_local(path=".env.local"):
    env = {}
    if not os.path.exists(path):
        return env
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                env[key.strip()] = value.strip()
    except Exception:
        pass
    return env


env_file = load_env_local()

def get_env(key):
    return os.getenv(key) or env_file.get(key)


token = get_env("NOTION_TOKEN") or get_env("NOTION_API_KEY")
if not token:
    raise SystemExit("Missing NOTION_TOKEN/NOTION_API_KEY in env or .env.local")

c = Client(auth=token)

# Check available methods
print("Available database methods:", [m for m in dir(c.databases) if not m.startswith('_')])

# Try list
try:
    result = c.databases.list()
    print("Databases:", json.dumps(result, indent=2, default=str)[:2000])
except Exception as e:
    print(f"List error: {e}")
