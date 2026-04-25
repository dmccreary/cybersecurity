// ── MicroSim auto-resize ────────────────────────────────────────────────
// Listens for `{ type: 'microsim-resize', height: <px> }` messages posted
// by embedded MicroSim iframes. When a message arrives, find the iframe
// whose contentWindow sent it and resize its height attribute to fit.
// Eliminates the need to hand-tune per-page iframe heights for diagram
// overlay MicroSims.
window.addEventListener("message", function (event) {
    const data = event.data;
    if (!data || data.type !== "microsim-resize") return;
    if (typeof data.height !== "number" || data.height <= 0) return;

    const iframes = document.querySelectorAll("iframe");
    for (const iframe of iframes) {
        if (iframe.contentWindow === event.source) {
            iframe.style.height = data.height + "px";
            iframe.setAttribute("height", data.height);
            break;
        }
    }
});

// ── Prompt admonition copy button ──────────────────────────────────────
// Adds a "Copy" button to any admonition with the `prompt` class. Clicking
// the button copies all body paragraph text (excluding the title) to the
// clipboard. Used for AI prompt boxes throughout the textbook.
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".admonition.prompt").forEach((admonition) => {
        const copyButton = document.createElement("button");
        copyButton.textContent = "Copy";
        copyButton.className = "copy-button";
        admonition.appendChild(copyButton);

        copyButton.addEventListener("click", () => {
            const promptText = Array.from(
                admonition.querySelectorAll("p:not(.admonition-title)")
            )
                .map((p) => p.textContent.trim())
                .join("\n");

            if (promptText) {
                navigator.clipboard.writeText(promptText).then(
                    () => {
                        copyButton.textContent = "Copied!";
                        setTimeout(() => (copyButton.textContent = "Copy"), 2000);
                    },
                    (err) => {
                        console.error("Failed to copy text: ", err);
                    }
                );
            } else {
                console.error("No prompt text found to copy.");
            }
        });
    });
});
