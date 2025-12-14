import os
import shutil
import folder_paths
import server
from aiohttp import web

# ----------------------------------------------------------------------------
# 1. Setup Paths
# ----------------------------------------------------------------------------
CURRENT_DIR = os.path.dirname(__file__)
WEB_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "dist"))
Js_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "web", "comfyui"))

print(f"\n[PromptWeaver] ---------------------------------------------")
print(f"[PromptWeaver] Initializing...")
print(f"[PromptWeaver] Root Path: {CURRENT_DIR}")
print(f"[PromptWeaver] Web Root (Dist): {WEB_ROOT}")
print(f"[PromptWeaver] JS Root: {Js_DIR}")

# ----------------------------------------------------------------------------
# 2. Setup Static Routes (The 404 Fix)
# ----------------------------------------------------------------------------
def setup_routes():
    try:
        if os.path.exists(WEB_ROOT) and os.path.isdir(WEB_ROOT):
             # Ensure we have an index.html
            index_path = os.path.join(WEB_ROOT, "index.html")
            if os.path.exists(index_path):
                # Register the ALL-CATCHING static route for the app
                server.PromptServer.instance.app.router.add_static("/prompt_weaver_app", WEB_ROOT, follow_symlinks=True)
                print(f"[PromptWeaver] 🟢 SUCCESS: Static route '/prompt_weaver_app' registered -> {WEB_ROOT}")
            else:
                print(f"[PromptWeaver] 🔴 ERROR: 'dist' exists but no 'index.html' found inside!")
        else:
             print(f"[PromptWeaver] 🔴 ERROR: 'dist' folder NOT found. Did you run 'npm run build'?")
    except Exception as e:
        print(f"[PromptWeaver] 🔴 EXCEPTION during route setup: {e}")

setup_routes()

# ----------------------------------------------------------------------------
# 3. Load Nodes
# ----------------------------------------------------------------------------
try:
    from .PromptWeaverNode import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    print(f"[PromptWeaver] 🟢 Nodes loaded successfully.")
except ImportError as e:
    print(f"[PromptWeaver] 🔴 Failed to import nodes: {e}")
    NODE_CLASS_MAPPINGS = {}
    NODE_DISPLAY_NAME_MAPPINGS = {}

# ----------------------------------------------------------------------------
# 4. Export WEB_DIRECTORY for JS loading
# ----------------------------------------------------------------------------
WEB_DIRECTORY = "./web/comfyui"
__all__ = ['NODE_CLASS_MAPPINGS', 'NODE_DISPLAY_NAME_MAPPINGS', 'WEB_DIRECTORY']

print(f"[PromptWeaver] ---------------------------------------------\n")
