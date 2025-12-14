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
                window.open("http://localhost:5173", "PromptWeaver");
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
