/* =========================================================
   ACE NEXUS — UNIVERSAL AUTH SYSTEM
   Student + Organizer Login / Registration
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       HELPERS
    ===================================================== */

    function getValue(selectors) {

        for (const selector of selectors) {

            const element =
                document.querySelector(selector);

            if (element && element.value !== undefined) {

                return element.value.trim();

            }

        }

        return "";

    }


    function showMessage(message, type = "error") {

        let box =
            document.getElementById(
                "authMessage"
            );

        if (!box) {

            box = document.createElement("div");

            box.id = "authMessage";

            box.style.marginTop = "15px";
            box.style.padding = "12px 15px";
            box.style.borderRadius = "10px";
            box.style.fontSize = "13px";
            box.style.lineHeight = "1.5";
            box.style.textAlign = "center";

            const form =
                document.querySelector(
                    "form"
                );

            if (form) {

                form.appendChild(box);

            } else {

                document.body.appendChild(box);

            }

        }


        box.textContent = message;

        box.style.background =
            type === "success"
                ? "rgba(40, 220, 130, .12)"
                : "rgba(255, 60, 120, .12)";

        box.style.border =
            type === "success"
                ? "1px solid rgba(40,220,130,.3)"
                : "1px solid rgba(255,60,120,.3)";

        box.style.color =
            type === "success"
                ? "#72ffb2"
                : "#ff8bb8";

    }


    function setLoading(button, loading) {

        if (!button) return;

        if (!button.dataset.originalText) {

            button.dataset.originalText =
                button.textContent;

        }

        button.disabled = loading;

        button.textContent =
            loading
                ? "Please wait..."
                : button.dataset.originalText;

    }


    /* =====================================================
       SAFE JSON RESPONSE
    ===================================================== */

    async function readResponse(response) {

        const contentType =
            response.headers.get(
                "content-type"
            ) || "";


        /*
           IMPORTANT:

           This prevents:

           Unexpected token '<',
           "<!doctype "... is not valid JSON

           If Flask returns HTML instead of JSON,
           we read it safely instead of crashing.
        */

        if (
            contentType.includes(
                "application/json"
            )
        ) {

            return await response.json();

        }


        const text =
            await response.text();


        console.error(
            "ACE NEXUS returned non-JSON:",
            text
        );


        throw new Error(
            "Server returned an unexpected page. " +
            "Please check the Flask server."
        );

    }


    /* =====================================================
       DETECT ROLE
    ===================================================== */

    function getRole() {

        const path =
            window.location.pathname
                .toLowerCase();


        if (
            path.includes(
                "organizer"
            )
        ) {

            return "organizer";

        }


        return "student";

    }


    /* =====================================================
       LOGIN
    ===================================================== */

    async function loginUser(event) {

        event.preventDefault();


        const form =
            event.currentTarget;


        const email =
            getValue([
                "#email",
                "#loginEmail",
                "#studentEmail",
                "#organizerEmail",
                "input[type='email']"
            ]);


        const password =
            getValue([
                "#password",
                "#loginPassword",
                "#studentPassword",
                "#organizerPassword",
                "input[type='password']"
            ]);


        if (!email) {

            showMessage(
                "Please enter your email."
            );

            return;

        }


        if (!password) {

            showMessage(
                "Please enter your password."
            );

            return;

        }


        const button =
            form.querySelector(
                "button[type='submit'], button"
            );


        setLoading(
            button,
            true
        );


        try {

            const response =
                await fetch(
                    "/api/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "same-origin",

                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    }
                );


            const data =
                await readResponse(
                    response
                );


            if (!response.ok || !data.success) {

                showMessage(
                    data.error ||
                    "Invalid email or password."
                );

                return;

            }


            /* =============================================
               STORE USER
            ============================================= */

            if (data.user) {

                localStorage.setItem(
                    "aceUser",
                    JSON.stringify(
                        data.user
                    )
                );

                localStorage.setItem(
                    "aceUserRole",
                    data.user.role || getRole()
                );

                localStorage.setItem(
                    "aceStudentName",
                    data.user.name || ""
                );

            }


            showMessage(
                "Login successful. Opening ACE NEXUS...",
                "success"
            );


            setTimeout(
                function () {

                    window.location.href =
                        data.redirect ||
                        (
                            data.user &&
                            data.user.role === "organizer"
                                ? "/organizer-dashboard"
                                : "/dashboard"
                        );

                },
                400
            );


        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );


            showMessage(
                error.message ||
                "Unable to connect to ACE NEXUS."
            );


        } finally {

            setLoading(
                button,
                false
            );

        }

    }


    /* =====================================================
       REGISTER
    ===================================================== */

    async function registerUser(event) {

        event.preventDefault();


        const form =
            event.currentTarget;


        const name =
            getValue([
                "#name",
                "#fullName",
                "#studentName",
                "#organizerName",
                "input[name='name']"
            ]);


        const email =
            getValue([
                "#email",
                "#registerEmail",
                "#studentEmail",
                "#organizerEmail",
                "input[type='email']"
            ]);


        const password =
            getValue([
                "#password",
                "#registerPassword",
                "#studentPassword",
                "#organizerPassword",
                "input[type='password']"
            ]);


        const confirmPassword =
            getValue([
                "#confirmPassword",
                "#confirm_password",
                "#passwordConfirm",
                "input[name='confirmPassword']"
            ]);


        if (!name) {

            showMessage(
                "Please enter your name."
            );

            return;

        }


        if (!email) {

            showMessage(
                "Please enter your email."
            );

            return;

        }


        if (!password) {

            showMessage(
                "Please create a password."
            );

            return;

        }


        if (
            confirmPassword &&
            password !== confirmPassword
        ) {

            showMessage(
                "Passwords do not match."
            );

            return;

        }


        const role =
            getRole();


        const button =
            form.querySelector(
                "button[type='submit'], button"
            );


        setLoading(
            button,
            true
        );


        try {

            const response =
                await fetch(
                    "/api/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "same-origin",

                        body: JSON.stringify({

                            name: name,

                            email: email,

                            password: password,

                            role: role

                        })
                    }
                );


            const data =
                await readResponse(
                    response
                );


            if (!response.ok || !data.success) {

                showMessage(
                    data.error ||
                    "Registration failed."
                );

                return;

            }


            if (data.user) {

                localStorage.setItem(
                    "aceUser",
                    JSON.stringify(
                        data.user
                    )
                );

                localStorage.setItem(
                    "aceUserRole",
                    data.user.role || role
                );

                localStorage.setItem(
                    "aceStudentName",
                    data.user.name || name
                );

            }


            showMessage(
                "Account created successfully.",
                "success"
            );


            setTimeout(
                function () {

                    if (
                        role ===
                        "organizer"
                    ) {

                        window.location.href =
                            "/organizer-dashboard";

                    } else {

                        window.location.href =
                            "/onboarding";

                    }

                },
                500
            );


        } catch (error) {

            console.error(
                "REGISTER ERROR:",
                error
            );


            showMessage(
                error.message ||
                "Unable to connect to ACE NEXUS."
            );


        } finally {

            setLoading(
                button,
                false
            );

        }

    }


    /* =====================================================
       FORM DETECTION
    ===================================================== */

    function initializeAuth() {

        const forms =
            document.querySelectorAll(
                "form"
            );


        if (!forms.length) {

            return;

        }


        forms.forEach(
            function (form) {

                const action =
                    (
                        form.getAttribute(
                            "action"
                        ) || ""
                    ).toLowerCase();


                const id =
                    (
                        form.id || ""
                    ).toLowerCase();


                const className =
                    (
                        form.className || ""
                    ).toString().toLowerCase();


                const page =
                    window.location.pathname
                        .toLowerCase();


                const isRegister =
                    page.includes(
                        "register"
                    ) ||
                    action.includes(
                        "register"
                    ) ||
                    id.includes(
                        "register"
                    ) ||
                    className.includes(
                        "register"
                    );


                const isLogin =
                    page.includes(
                        "login"
                    ) ||
                    action.includes(
                        "login"
                    ) ||
                    id.includes(
                        "login"
                    ) ||
                    className.includes(
                        "login"
                    );


                /*
                   Only attach to authentication forms.
                */

                if (
                    isRegister &&
                    !form.dataset.aceAuthAttached
                ) {

                    form.dataset.aceAuthAttached =
                        "true";

                    form.addEventListener(
                        "submit",
                        registerUser
                    );

                }

                else if (
                    isLogin &&
                    !form.dataset.aceAuthAttached
                ) {

                    form.dataset.aceAuthAttached =
                        "true";

                    form.addEventListener(
                        "submit",
                        loginUser
                    );

                }

            }
        );

    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    window.aceLogout =
        function () {

            localStorage.removeItem(
                "aceUser"
            );

            localStorage.removeItem(
                "aceUserRole"
            );

            window.location.href =
                "/logout";

        };


    /* =====================================================
       START
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeAuth
        );

    } else {

        initializeAuth();

    }


})();