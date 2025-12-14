import os
import server
from aiohttp import web

class PromptWeaver:
    """Main entry point for Prompt Weaver plugin"""
    
    @classmethod
    def add_routes(cls):
        """Initialize and register all routes"""
        try:
            app = server.PromptServer.instance.app
            
            # Debug: Print location of this file
            print(f"[PromptWeaver] DEBUG: prompt_weaver.py located at: {__file__}")
            
            # Go up two levels: py/ -> root/
            CURRENT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            WEB_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "dist"))
            
            print(f"[PromptWeaver] DEBUG: Computed Root Path: {CURRENT_DIR}")
            print(f"[PromptWeaver] DEBUG: Computed Web Root: {WEB_ROOT}")
            
            # 1. Test Route to verify server reachability
            async def test_route(request):
                print(f"[PromptWeaver] TEST ROUTE HIT")
                return web.json_response({"status": "ok", "message": "Prompt Weaver is reachable"})
            
            app.router.add_get("/prompt_weaver_test", test_route)
            
            # 2. Main App Redirect (accessing without slash -> redirect to slash for relative paths)
            async def redirect_to_slash(request):
                target = request.rel_url.with_path(request.path + "/")
                return web.HTTPMovedPermanently(target)
                
            app.router.add_get("/prompt_weaver", redirect_to_slash)

            # 3. Explicit Handler for index.html at root (e.g. /prompt_weaver/)
            if os.path.exists(WEB_ROOT) and os.path.isdir(WEB_ROOT):
                index_path = os.path.join(WEB_ROOT, "index.html")
                if os.path.exists(index_path):
                    async def serve_index(request):
                        print(f"[PromptWeaver] HIT: Serving index.html")
                        return web.FileResponse(index_path)
                    
                    # Serve index at the directory root (trailing slash)
                    app.router.add_get("/prompt_weaver/", serve_index)
                    # Also serve at explicit index.html
                    app.router.add_get("/prompt_weaver/index.html", serve_index)

                    # 4. Static Route for assets (mapped to /prompt_weaver to match relative paths)
                    app.router.add_static("/prompt_weaver", WEB_ROOT, follow_symlinks=True)
                    
                    print(f"[PromptWeaver] 🟢 SUCCESS: routes registered at '/prompt_weaver/' and '/prompt_weaver/index.html'")
                    print(f"[PromptWeaver] 🟢 SUCCESS: Static assets served at '/prompt_weaver'")
                else:
                    print(f"[PromptWeaver] 🔴 ERROR: 'dist' exists but no 'index.html' found inside!")
                    print(f"[PromptWeaver] 🔴 Directory contents: {os.listdir(WEB_ROOT)}")
            else:
                 print(f"[PromptWeaver] 🔴 ERROR: 'dist' folder NOT found. Did you run 'npm run build'?")
                 print(f"[PromptWeaver] 🔴 Expected at: {WEB_ROOT}")
                 
        except Exception as e:
            print(f"[PromptWeaver] 🔴 CRITICAL EXCEPTION in add_routes: {e}")
            import traceback
            traceback.print_exc()
