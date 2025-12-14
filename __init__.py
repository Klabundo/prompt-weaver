from .py.prompt_weaver import PromptWeaver
import importlib

# ----------------------------------------------------------------------------
# Initialize Backend
# ----------------------------------------------------------------------------
try:
    # Import nodes from the new py/ location
    from .py.nodes import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    print(f"[PromptWeaver] 🟢 Nodes loaded successfully.")
except ImportError as e:
    print(f"[PromptWeaver] 🔴 Failed to import nodes: {e}")
    NODE_CLASS_MAPPINGS = {}
    NODE_DISPLAY_NAME_MAPPINGS = {}

# ----------------------------------------------------------------------------
# Register Routes
# ----------------------------------------------------------------------------
PromptWeaver.add_routes()

# ----------------------------------------------------------------------------
# Export
# ----------------------------------------------------------------------------
WEB_DIRECTORY = "./web/comfyui"
__all__ = ['NODE_CLASS_MAPPINGS', 'NODE_DISPLAY_NAME_MAPPINGS', 'WEB_DIRECTORY']

print(f"[PromptWeaver] Initialization complete.")
