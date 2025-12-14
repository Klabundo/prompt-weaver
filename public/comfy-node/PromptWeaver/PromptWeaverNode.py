import server
from aiohttp import web

class PromptWeaverReceiver:
    def __init__(self):
        pass
    
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "prompt_text": ("STRING", {"multiline": True, "default": ""}),
            },
            "hidden": {"unique_id": "UNIQUE_ID"},
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("prompt",)
    FUNCTION = "process"
    CATEGORY = "PromptWeaver"
    
    def process(self, prompt_text, unique_id=None):
        return (prompt_text,)

# Node mapping
NODE_CLASS_MAPPINGS = {
    "PromptWeaverReceiver": PromptWeaverReceiver
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "PromptWeaverReceiver": "Prompt Weaver Receiver"
}
