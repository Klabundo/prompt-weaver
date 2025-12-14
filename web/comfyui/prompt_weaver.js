import { app } from "../../scripts/app.js";

app.registerExtension({
    name: "PromptWeaver.Menu",
    async setup() {
        console.log("🟢 PromptWeaver Extension Loading...");
        const menu = document.querySelector(".comfy-menu");
        if (menu) {
            const separator = document.createElement("hr");

            const openBtn = document.createElement("button");
            openBtn.textContent = "Open Prompt Weaver";
            openBtn.style.background = "linear-gradient(90deg, #6366f1, #a855f7)";
            openBtn.style.color = "white";
            openBtn.style.marginTop = "10px";
            openBtn.style.cursor = "pointer";
            openBtn.onclick = () => {
                // Check if already open
                if (document.getElementById("prompt-weaver-modal")) return;

                // 1. Create Overlay
                const overlay = document.createElement("div");
                overlay.id = "prompt-weaver-modal";
                Object.assign(overlay.style, {
                    position: "fixed",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    zIndex: "9999",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backdropFilter: "blur(5px)"
                });

                // 2. Create Modal Container
                const modal = document.createElement("div");
                Object.assign(modal.style, {
                    width: "90%",
                    height: "90%",
                    backgroundColor: "#1e1e1e",
                    borderRadius: "12px",
                    boxShadow: "0 0 50px rgba(0,0,0,0.5)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    border: "1px solid #333"
                });

                // 3. Header
                const header = document.createElement("div");
                Object.assign(header.style, {
                    padding: "10px 20px",
                    backgroundColor: "#2a2a2a",
                    borderBottom: "1px solid #333",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "white",
                    fontFamily: "sans-serif"
                });

                const title = document.createElement("h3");
                title.textContent = "Prompt Weaver";
                title.style.margin = "0";

                const closeBtn = document.createElement("button");
                closeBtn.textContent = "✕";
                Object.assign(closeBtn.style, {
                    background: "transparent",
                    border: "none",
                    color: "#ff6b6b",
                    fontSize: "20px",
                    cursor: "pointer",
                    fontWeight: "bold"
                });
                closeBtn.onclick = () => overlay.remove();

                header.append(title, closeBtn);

                // 4. Iframe
                const iframe = document.createElement("iframe");
                // Point to the static route served by __init__.py
                iframe.src = "/prompt_weaver_app/index.html";
                Object.assign(iframe.style, {
                    width: "100%",
                    height: "100%",
                    border: "none",
                    background: "#000"
                });

                // Assemble
                modal.append(header, iframe);
                overlay.append(modal);
                document.body.append(overlay);

                // Close on click outside
                overlay.onclick = (e) => {
                    if (e.target === overlay) overlay.remove();
                };
            };

            menu.append(separator);
            menu.append(openBtn);
            console.log("🟢 PromptWeaver Button added to menu.");
        } else {
            console.log("🔴 PromptWeaver: .comfy-menu not found (New UI?).");
        }
    },
},
});
