import server
from aiohttp import web

class PromptWeaverReceiver:
    def __init__(self):
        pass
    
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "positive_text": ("STRING", {"multiline": True, "default": ""}),
                "negative_text": ("STRING", {"multiline": True, "default": ""}),
            },
            "hidden": {"unique_id": "UNIQUE_ID"},
        }

    RETURN_TYPES = ("STRING", "STRING")
    RETURN_NAMES = ("positive", "negative")
    FUNCTION = "process"
    CATEGORY = "PromptWeaver"
    
    def process(self, positive_text, negative_text, unique_id=None):
        return (positive_text, negative_text)

# Node mapping
NODE_CLASS_MAPPINGS = {
    "PromptWeaverReceiver": PromptWeaverReceiver
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "PromptWeaverReceiver": "Prompt Weaver Receiver"
}
