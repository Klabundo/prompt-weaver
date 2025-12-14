import { app } from "../../scripts/app.js";

app.registerExtension({
    name: "PromptWeaver.Menu",
    async setup() {
        const menu = document.querySelector(".comfy-menu");
        if (menu) {
            const separator = document.createElement("hr");

            const openBtn = document.createElement("button");
            openBtn.textContent = "Open Prompt Weaver";
            openBtn.style.background = "linear-gradient(90deg, #6366f1, #a855f7)";
            openBtn.style.color = "white";
            openBtn.style.marginTop = "10px";
            openBtn.onclick = () => {
                // Try to open the app. Default to localhost:5173 (Vite default) or 8080.
                // In a perfect world we would detect it, but let's assume standard dev port or production port.
                // We'll open a dialog asking for URL if it fails? No, just open default.
                window.open("http://localhost:5173", "PromptWeaver");
            };

            menu.append(separator);
            menu.append(openBtn);
        }
    },
});
