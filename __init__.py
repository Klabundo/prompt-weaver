import os
import server
import aiohttp
from aiohttp import web
from .PromptWeaverNode import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS

# Define the path to the 'dist' folder (React App Build)
WEB_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "dist"))

print(f"🔍 PromptWeaver Debug: Calculated WEB_ROOT as: {WEB_ROOT}")

# Register the static route to serve the React App
# This makes http://comfyui-address/prompt_weaver_app/ serve the index.html
if os.path.exists(WEB_ROOT) and os.path.isdir(WEB_ROOT):
    server.PromptServer.instance.app.router.add_static("/prompt_weaver_app", WEB_ROOT, follow_symlinks=True)
    print(f"🟢 PromptWeaver: Serving Web App from {WEB_ROOT}")
    print(f"   -> URL should be: /prompt_weaver_app/index.html")
else:
    print(f"🔴 PromptWeaver ERROR: 'dist' folder NOT found at {WEB_ROOT}")
    print(f"   -> Current working directory: {os.getcwd()}")
    print(f"   -> Directory content of module root: {os.listdir(os.path.dirname(__file__))}")

# This tells ComfyUI where to find our JS extension (prompt_weaver.js)
WEB_DIRECTORY = "./web/comfyui"

print("🟢 PromptWeaver Node: Loaded successfully!")
__all__ = ['NODE_CLASS_MAPPINGS', 'NODE_DISPLAY_NAME_MAPPINGS', 'WEB_DIRECTORY']
