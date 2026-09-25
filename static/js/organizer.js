/* =========================================================
   ACE NEXUS — ORGANIZER SYSTEM
========================================================= */

(function () {

    "use strict";


    let opportunities = [];


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const grid =
        document.getElementById(
            "organizerOpportunities"
        );

    const form =
        document.getElementById(
            "createOpportunityForm"
        );

    const createPanel =
        document.getElementById(
            "createPanel"
        );

    const opportunitiesSection =
        document.getElementById(
            "opportunitiesSection"
        );

    const applicantsSection =
        document.getElementById(
            "applicantsSection"
        );

    const profileSection =
        document.getElementById(
            "profileSection"
        );


    /* =====================================================
       TOAST
    ===================================================== */

    function toast(message) {

        const element =
            document.getElementById(
                "orgToast"
            );

        if (!element) return;

        element.textContent =
            message;

        element.classList.add(
            "show"
        );

        setTimeout(
            () => {
                element.classList.remove(
                    "show"
                );
            },
            2500
        );

    }


    /* =====================================================
       USER
    ===================================================== */

    function getUser() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "aceUser"
                ) || "null"
            );

        } catch {

            return null;

        }

    }


    function renderUser() {

        const user =
            getUser();

        if (!user) return;


        const name =
            document.getElementById(
                "sidebarOrgName"
            );

        const email =
            document.getElementById(
                "sidebarOrgEmail"
            );

        const profileName =
            document.getElementById(
                "profileOrgName"
            );

        const profileEmail =
            document.getElementById(
                "profileOrgEmail"
            );


        if (name)
            name.textContent =
                user.name ||
                "Organizer";


        if (email)
            email.textContent =
                user.email ||
                "Organizer account";


        if (profileName)
            profileName.textContent =
                user.name ||
                "Organization";


        if (profileEmail)
            profileEmail.textContent =
                user.email ||
                "Email";

    }


    /* =====================================================
       LOAD OPPORTUNITIES
    ===================================================== */

    async function loadOpportunities() {

        try {

            const response =
                await fetch(
                    "/api/organizer/opportunities",
                    {
                        credentials:
                            "same-origin"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to load opportunities"
                );

            }


            const data =
                await response.json();


            opportunities =
                data.opportunities ||
                [];


            renderOpportunities();

            updateStats();


        } catch (error) {

            console.error(
                "ORGANIZER LOAD:",
                error
            );


            if (grid) {

                grid.innerHTML = `

                    <div class="org-empty">

                        Unable to load your opportunities.

                    </div>

                `;

            }

        }

    }


    /* =====================================================
       RENDER
    ===================================================== */

    function renderOpportunities() {

        if (!grid) return;


        if (!opportunities.length) {

            grid.innerHTML = `

                <div class="org-empty">

                    <div style="font-size:28px;margin-bottom:10px;">
                        ◈
                    </div>

                    <strong>
                        No opportunities yet
                    </strong>

                    <br><br>

                    Create your first opportunity
                    and publish it to students.

                </div>

            `;

            return;

        }


        grid.innerHTML =
            opportunities
                .map(
                    opportunity => `

                    <article
                        class="org-opportunity-card">

                        <div class="org-card-type">

                            ${escapeHtml(
                                opportunity.type ||
                                "Opportunity"
                            )}

                        </div>


                        <h3>

                            ${escapeHtml(
                                opportunity.title
                            )}

                        </h3>


                        <p>

                            ${escapeHtml(
                                opportunity.description ||
                                "No description provided."
                            )}

                        </p>


                        <div class="org-card-meta">

                            <span>
                                📍
                                ${escapeHtml(
                                    opportunity.location ||
                                    "India"
                                )}
                            </span>

                            <span>
                                ◷
                                ${escapeHtml(
                                    opportunity.deadline ||
                                    "Open"
                                )}
                            </span>

                            <span>
                                ${escapeHtml(
                                    opportunity.reward ||
                                    opportunity.prize ||
                                    "—"
                                )}
                            </span>

                            <span>
                                👁
                                ${opportunity.views || 0}
                            </span>

                        </div>


                        <div class="org-card-actions">

                            <button
                                data-id="${opportunity.id}"
                                class="view-opportunity">

                                View

                            </button>


                            <button
                                data-id="${opportunity.id}"
                                class="delete delete-opportunity">

                                Delete

                            </button>

                        </div>

                    </article>

                `
                )
                .join("");


        document
            .querySelectorAll(
                ".delete-opportunity"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            deleteOpportunity(
                                Number(
                                    button.dataset.id
                                )
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".view-opportunity"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            window.location.href =
                                "/opportunity/" +
                                button.dataset.id;

                        }
                    );

                }
            );

    }


    /* =====================================================
       STATS
    ===================================================== */

    function updateStats() {

        const total =
            opportunities.length;


        const views =
            opportunities.reduce(
                (
                    sum,
                    item
                ) =>
                    sum +
                    Number(
                        item.views || 0
                    ),
                0
            );


        const active =
            opportunities.filter(
                item =>
                    item.status !==
                    "Draft"
            ).length;


        const applications =
            opportunities.reduce(
                (
                    sum,
                    item
                ) =>
                    sum +
                    Number(
                        item.applications ||
                        0
                    ),
                0
            );


        const stat1 =
            document.getElementById(
                "statOpportunities"
            );

        const stat2 =
            document.getElementById(
                "statViews"
            );

        const stat3 =
            document.getElementById(
                "statApplications"
            );

        const stat4 =
            document.getElementById(
                "statActive"
            );


        if (stat1)
            stat1.textContent =
                total;


        if (stat2)
            stat2.textContent =
                views;


        if (stat3)
            stat3.textContent =
                applications;


        if (stat4)
            stat4.textContent =
                active;

    }


    /* =====================================================
       CREATE
    ===================================================== */

    if (form) {

        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const payload = {

                    title:
                        document
                            .getElementById(
                                "opTitle"
                            )
                            .value
                            .trim(),

                    type:
                        document
                            .getElementById(
                                "opType"
                            )
                            .value,

                    mode:
                        document
                            .getElementById(
                                "opMode"
                            )
                            .value,

                    location:
                        document
                            .getElementById(
                                "opLocation"
                            )
                            .value
                            .trim(),

                    deadline:
                        document
                            .getElementById(
                                "opDeadline"
                            )
                            .value
                            .trim(),

                    reward:
                        document
                            .getElementById(
                                "opReward"
                            )
                            .value
                            .trim(),

                    tags:
                        document
                            .getElementById(
                                "opTags"
                            )
                            .value
                            .trim(),

                    description:
                        document
                            .getElementById(
                                "opDescription"
                            )
                            .value
                            .trim()

                };


                if (!payload.title) {

                    toast(
                        "Enter an opportunity title."
                    );

                    return;

                }


                try {

                    const response =
                        await fetch(
                            "/api/organizer/opportunities",
                            {

                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                credentials:
                                    "same-origin",

                                body:
                                    JSON.stringify(
                                        payload
                                    )

                            }
                        );


                    const data =
                        await response.json();


                    if (
                        !response.ok ||
                        !data.success
                    ) {

                        throw new Error(
                            data.error ||
                            "Unable to create opportunity."
                        );

                    }


                    toast(
                        "Opportunity published successfully."
                    );


                    form.reset();


                    showSection(
                        "opportunities"
                    );


                    await loadOpportunities();


                } catch (error) {

                    console.error(
                        error
                    );

                    toast(
                        error.message
                    );

                }

            }
        );

    }


    /* =====================================================
       DELETE
    ===================================================== */

    async function deleteOpportunity(id) {

        const confirmed =
            window.confirm(
                "Delete this opportunity?"
            );


        if (!confirmed)
            return;


        try {

            const response =
                await fetch(
                    "/api/organizer/opportunities/" +
                    id,
                    {
                        method: "DELETE",
                        credentials:
                            "same-origin"
                    }
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.error ||
                    "Delete failed."
                );

            }


            toast(
                "Opportunity deleted."
            );


            await loadOpportunities();


        } catch (error) {

            console.error(
                error
            );

            toast(
                error.message
            );

        }

    }


    /* =====================================================
       NAVIGATION
    ===================================================== */

    function showSection(section) {

        if (
            opportunitiesSection
        ) {

            opportunitiesSection.style.display =
                section === "opportunities" ||
                section === "dashboard"
                    ? "block"
                    : "none";

        }


        if (createPanel) {

            createPanel.classList.toggle(
                "visible",
                section === "create"
            );

        }


        if (applicantsSection) {

            applicantsSection.style.display =
                section === "applicants"
                    ? "block"
                    : "none";

        }


        if (profileSection) {

            profileSection.style.display =
                section === "profile"
                    ? "block"
                    : "none";

        }


        if (section === "dashboard") {

            if (createPanel)
                createPanel.classList.remove(
                    "visible"
                );

            if (applicantsSection)
                applicantsSection.style.display =
                    "none";

            if (profileSection)
                profileSection.style.display =
                    "none";

        }

    }


    document
        .querySelectorAll(
            ".org-nav button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".org-nav button"
                            )
                            .forEach(
                                item =>
                                    item.classList.remove(
                                        "active"
                                    )
                            );


                        button.classList.add(
                            "active"
                        );


                        showSection(
                            button.dataset.section
                        );

                    }
                );

            }
        );


    /* =====================================================
       CREATE BUTTON
    ===================================================== */

    const openCreate =
        document.getElementById(
            "openCreateButton"
        );


    if (openCreate) {

        openCreate.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".org-nav button"
                    )
                    .forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                const createNav =
                    document.querySelector(
                        '[data-section="create"]'
                    );


                if (createNav)
                    createNav.classList.add(
                        "active"
                    );


                showSection(
                    "create"
                );


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const mobileButton =
        document.getElementById(
            "mobileMenuButton"
        );


    const sidebar =
        document.getElementById(
            "orgSidebar"
        );


    if (mobileButton) {

        mobileButton.addEventListener(
            "click",
            () => {

                if (sidebar)
                    sidebar.classList.toggle(
                        "open"
                    );

            }
        );

    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    const logout =
        document.getElementById(
            "logoutButton"
        );


    if (logout) {

        logout.addEventListener(
            "click",
            () => {

                localStorage.removeItem(
                    "aceUser"
                );

                localStorage.removeItem(
                    "aceUserRole"
                );

                window.location.href =
                    "/logout";

            }
        );

    }


    /* =====================================================
       HTML ESCAPE
    ===================================================== */

    function escapeHtml(value) {

        return String(
            value ?? ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* =====================================================
       START
    ===================================================== */

    renderUser();

    loadOpportunities();

})();