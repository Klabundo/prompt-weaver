import os
import server
import aiohttp
from aiohttp import web
from .PromptWeaverNode import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS

# Define the path to the 'dist' folder (React App Build)
WEB_ROOT = os.path.join(os.path.dirname(__file__), "dist")

# Register the static route to serve the React App
# This makes http://comfyui-address/prompt_weaver_app/ serve the index.html
if os.path.exists(WEB_ROOT):
    server.PromptServer.instance.app.add_routes([
        web.static("/prompt_weaver_app", WEB_ROOT, follow_symlinks=True)
    ])
    print(f"🟢 PromptWeaver: Serving Web App from {WEB_ROOT}")
else:
    print(f"🔴 PromptWeaver WARNING: 'dist' folder not found at {WEB_ROOT}. Web App will not load.")

# This tells ComfyUI where to find our JS extension (prompt_weaver.js)
WEB_DIRECTORY = "./web/comfyui"

print("🟢 PromptWeaver Node: Loaded successfully!")
__all__ = ['NODE_CLASS_MAPPINGS', 'NODE_DISPLAY_NAME_MAPPINGS', 'WEB_DIRECTORY']
