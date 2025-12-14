import { app } from "../../scripts/app.js";
import { ComfyButton } from "../../scripts/ui/components/button.js";
import { ComfyButtonGroup } from "../../scripts/ui/components/buttonGroup.js";

// ID for our custom overlay
const MODAL_ID = "prompt-weaver-modal";
const BUTTON_TOOLTIP = "Launch Prompt Weaver (Shift+Click opens in new window)";
const NEW_WINDOW_FEATURES = "width=1200,height=800,resizable=yes,scrollbars=yes,status=yes";

const getIcon = () => {
    // This is the icon from Lora Manager, slightly modified (color) to satisfy the request
    return `
        <svg enable-background="new 0 0 512 512" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
            <path d="m246 513h-244.97v-511.91h511.82v511.91h-266.85m49.085-213.94c-4.361 0.0607-8.722 0.1214-14.003 0.011933-5.0363 0.055023-10.073 0.11005-15.58 0.032653 0 0-0.46661 0.14719-1.32 0.005707-1.7251 0.050324-3.4501 0.10065-6.0804-0.02182-3.3896 0.055725-6.7792 0.11145-11.079-0.006653h-14.108c0-10.968 0-21.029 0.16602-32.015-0.053467-12.694-0.10693-25.387 0.010132-39.003-0.061066-8.6906-0.12212-17.381-0.022263-26.997-0.056701-9.6923-0.1134-19.385-0.005004-30.001v-40.96c-13.187 0-25.623 0-38.981-0.18008-9.6981 0.050782-19.396 0.10156-29.956 0.039337-0.31555 4.0221-0.6311 8.0442-1.1103 12.9 0.055817 1.6951 0.11165 3.3903 0.017471 5.9173 0.051193 1.4047 0.1024 2.8093-0.011429 5.1036 0.049881 2.7127 0.099747 5.4254-0.006973 8.7772 0.052658 0.43225 0.1053 0.86449 0.00795 2.2206 0.049942 4.3812 0.099899 8.7625-0.015915 14.041 0.055603 3.3429 0.11122 6.6859 0.022659 10.715 0.050782 0.46198 0.10156 0.92394-0.013916 2.3056 0.054154 16.334 0.10831 32.669 7.7e-5 49.934 0.051117 8.3853 0.10223 16.771-0.010285 26.074 0.054642 14.003 0.10928 28.006 0.010132 42.934 0.042496 4.7077 0.084976 9.4154-0.039978 15.044v42.686c11.969 0 23.056 0 35 0.10275 5.3469-0.057068 10.694-0.11414 16.94 0.009217 3.3708-0.088257 6.7415-0.17648 11.019-0.068421 4.3607-0.053772 8.7214-0.10754 13.951 0.02652 2.3679-0.049103 4.7359-0.098206 7.8977 0.039673 1.0772-0.079254 2.1544-0.15851 4.1191-0.03656 3.0312-0.065155 6.0624-0.13031 10.013-0.002472 8.3593-0.077851 16.719-0.1557 25.976-0.019043 3.3658-0.090363 6.7315-0.18076 10.973-0.02536 2.7193-0.061676 5.4385-0.12332 9.0656 0.04187 7.3558-0.081452 14.712-0.1629 22.981-0.02002h35.448c-7.6203-9.7498-14.395-18.417-21.336-27.726-9.6361-12.402-19.272-24.804-29.066-37.903-1.4952-3.2602-3.9758-4.3957-7.559-4.0944-4.1114 0.3457-8.2635 0.20969-13.314 0.11584z" fill="#9d4edd"/>
        </svg>
    `;
};

const openPromptWeaver = (event) => {
    // Open clean URL (server handles index.html and assets)
    const url = "/prompt_weaver/";

    if (event.shiftKey) {
        window.open(url, "PromptWeaverWindow", NEW_WINDOW_FEATURES);
        return;
    }

    window.open(url, "_blank");
};

// Register the extension
app.registerExtension({
    name: "PromptWeaver.TopMenu",
    async setup() {
        // Wait for settings group to be available
        const waitForSettings = () => {
            const settingsGroup = app.menu?.settingsGroup;
            if (settingsGroup) {
                addClassAndAddButton(settingsGroup);
            } else {
                setTimeout(waitForSettings, 100);
            }
        };

        const addClassAndAddButton = (settingsGroup) => {
            const button = new ComfyButton({
                icon: "prompt-weaver-icon", // Placeholder, we inject SVG below
                tooltip: BUTTON_TOOLTIP,
                app,
                enabled: true,
                classList: "comfyui-button comfyui-menu-mobile-collapse primary"
            });

            // Inject Custom Icon
            if (button.iconElement) {
                button.iconElement.innerHTML = getIcon();
                button.iconElement.style.width = "1.2rem";
                button.iconElement.style.height = "1.2rem";
            }

            button.element.onclick = openPromptWeaver;

            const buttonGroup = new ComfyButtonGroup(button);
            // Insert before the settings group (like Lora Manager)
            settingsGroup.element.before(buttonGroup.element);
        };

        waitForSettings();
    }
});
