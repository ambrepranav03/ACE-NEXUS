/* =========================================================
   ACE NEXUS — ACE AI
   Click + Panel + Flask Connection
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const panel = document.getElementById("aceAiPanel");
    const nav = document.getElementById("aceAiNav");
    const closeBtn = document.getElementById("closeAceAI");
    const input = document.getElementById("aceAiInput");
    const sendBtn = document.getElementById("aceAiSend");
    const messages = document.getElementById("aceAiMessages");

    console.log("ACE AI JS loaded");


    /* =====================================================
       MAKE ACE AI SIDEBAR CLICKABLE
    ===================================================== */

    if (nav) {

        nav.style.position = "relative";
        nav.style.zIndex = "9999";
        nav.style.pointerEvents = "auto";
        nav.style.cursor = "pointer";

    }


    const sidebar =
        document.querySelector(".dashboard-sidebar");

    if (sidebar) {

        sidebar.style.position = "fixed";
        sidebar.style.zIndex = "9998";
        sidebar.style.pointerEvents = "auto";

    }


    /* =====================================================
       OPEN ACE AI
    ===================================================== */

    if (nav && panel) {

        nav.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            panel.classList.add("visible");

            console.log("ACE AI opened");

            if (input) {

                setTimeout(function () {
                    input.focus();
                }, 300);

            }

        });

    }


    /* =====================================================
       CLOSE ACE AI
    ===================================================== */

    if (closeBtn && panel) {

        closeBtn.addEventListener("click", function () {

            panel.classList.remove("visible");

        });

    }


    /* =====================================================
       SEND MESSAGE
    ===================================================== */

    async function askACE(question) {

        question = question.trim();

        if (!question) {
            return;
        }


        addMessage(question, "user");

        input.value = "";

        input.disabled = true;
        sendBtn.disabled = true;

        addLoading();


        try {

            const response = await fetch("/api/ai", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: question
                })

            });


            const data = await response.json();

            removeLoading();


            if (!response.ok) {

                throw new Error(
                    data.error || "ACE AI request failed"
                );

            }


            const reply =
                data.response ||
                data.answer ||
                data.message ||
                "ACE could not generate a response.";


            addMessage(reply, "ai");


        } catch (error) {

            console.error("ACE AI Error:", error);

            removeLoading();

            addMessage(
                "I couldn't connect to ACE right now. Please check that Flask is running.",
                "ai"
            );

        }


        input.disabled = false;
        sendBtn.disabled = false;

        input.focus();

    }


    /* =====================================================
       ADD MESSAGE
    ===================================================== */

    function addMessage(text, type) {

        if (!messages) {
            return;
        }


        const message =
            document.createElement("div");


        message.className =
            type === "user"
                ? "ace-message ace-message-user"
                : "ace-message ace-message-ai";


        if (type === "user") {

            message.innerHTML = `
                <div class="ace-message-bubble">
                    ${escapeHtml(text)}
                </div>
            `;

        } else {

            message.innerHTML = `
                <div class="ace-message-avatar">
                    ✦
                </div>

                <div class="ace-message-bubble">
                    ${escapeHtml(text)}
                </div>
            `;

        }


        messages.appendChild(message);

        messages.scrollTop =
            messages.scrollHeight;

    }


    /* =====================================================
       LOADING
    ===================================================== */

    function addLoading() {

        if (!messages) {
            return;
        }


        const loading =
            document.createElement("div");


        loading.id =
            "aceAiLoading";


        loading.className =
            "ace-message ace-message-ai";


        loading.innerHTML = `
            <div class="ace-message-avatar">
                ✦
            </div>

            <div class="ace-message-bubble">
                ACE is thinking...
            </div>
        `;


        messages.appendChild(loading);

        messages.scrollTop =
            messages.scrollHeight;

    }


    function removeLoading() {

        const loading =
            document.getElementById(
                "aceAiLoading"
            );


        if (loading) {
            loading.remove();
        }

    }


    /* =====================================================
       SEND BUTTON
    ===================================================== */

    if (sendBtn && input) {

        sendBtn.addEventListener(
            "click",
            function () {

                askACE(input.value);

            }
        );


        input.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    askACE(input.value);

                }

            }
        );

    }


    /* =====================================================
       SUGGESTIONS
    ===================================================== */

    const suggestions =
        document.querySelectorAll(
            ".ace-ai-suggestions button"
        );


    suggestions.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const prompt =
                    button.dataset.prompt ||
                    button.textContent.trim();


                if (input) {

                    input.value = prompt;

                    askACE(prompt);

                }

            }
        );

    });


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHtml(text) {

        const div =
            document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }

});