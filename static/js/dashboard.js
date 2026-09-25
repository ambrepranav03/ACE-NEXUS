/* =========================================================
   ACE NEXUS — STUDENT DASHBOARD ENGINE
   Backend Connected Version
========================================================= */

"use strict";


/* =========================================================
   STATE
========================================================= */

let opportunities = [];

let currentFilter = "All";

let currentSearch = "";


/* =========================================================
   PROFILE
========================================================= */

function getStudentProfile() {

    return {

        name:
            localStorage.getItem(
                "aceStudentName"
            ) || "Explorer",

        city:
            localStorage.getItem(
                "aceStudentCity"
            ) || "India",

        skills:
            JSON.parse(
                localStorage.getItem(
                    "aceSkills"
                ) || "[]"
            ),

        goals:
            JSON.parse(
                localStorage.getItem(
                    "aceGoals"
                ) || "[]"
            )

    };

}


/* =========================================================
   ELEMENTS
========================================================= */

const opportunitySection =
    document.querySelector(
        ".opportunity-section"
    );


const savedPanel =
    document.getElementById(
        "savedPanel"
    );


const savedContainer =
    document.getElementById(
        "savedOpportunities"
    );


const applicationsPanel =
    document.getElementById(
        "applicationsPanel"
    );


const applicationsList =
    document.getElementById(
        "applicationsList"
    );


const profilePanel =
    document.getElementById(
        "profilePanel"
    );


const profileNav =
    document.getElementById(
        "profileNav"
    );


const savedNav =
    document.getElementById(
        "savedNav"
    );


const applicationsNav =
    document.getElementById(
        "applicationsNav"
    );


const closeSaved =
    document.getElementById(
        "closeSaved"
    );


const closeApplications =
    document.getElementById(
        "closeApplications"
    );


const closeProfile =
    document.getElementById(
        "closeProfile"
    );


const profileButton =
    document.getElementById(
        "profileButton"
    );


const searchInput =
    document.getElementById(
        "opportunitySearch"
    );


const searchButton =
    document.getElementById(
        "searchButton"
    );


/* =========================================================
   TOAST
========================================================= */

function toast(message) {

    let box =
        document.getElementById(
            "aceToast"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );

        box.id =
            "aceToast";

        box.style.position =
            "fixed";

        box.style.right =
            "25px";

        box.style.bottom =
            "25px";

        box.style.zIndex =
            "9999";

        box.style.padding =
            "13px 18px";

        box.style.borderRadius =
            "12px";

        box.style.background =
            "#15121c";

        box.style.color =
            "#fff";

        box.style.border =
            "1px solid rgba(242,27,143,.3)";

        box.style.fontSize =
            "12px";

        box.style.boxShadow =
            "0 15px 50px rgba(0,0,0,.5)";

        document.body.appendChild(
            box
        );

    }


    box.textContent =
        message;

    box.style.opacity =
        "1";


    clearTimeout(
        box._timer
    );


    box._timer =
        setTimeout(
            () => {

                box.style.opacity =
                    "0";

            },
            2500
        );

}


/* =========================================================
   LOAD OPPORTUNITIES
========================================================= */

async function loadOpportunities() {

    try {

        const response =
            await fetch(
                "/api/opportunities",
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
            data ||
            [];


        renderOpportunities();


    } catch (error) {

        console.error(
            "OPPORTUNITIES:",
            error
        );


        /*
           Fallback demo data.
           Dashboard still works if API
           is temporarily unavailable.
        */

        opportunities = [

            {
                id: 1,
                title:
                    "AI Innovation Challenge",
                type:
                    "Hackathon",
                description:
                    "Build real-world AI solutions with students, mentors and industry experts.",
                location:
                    "Bengaluru",
                mode:
                    "offline",
                deadline:
                    "12 days left",
                prize:
                    "₹75,000 Prize",
                match:
                    94,
                tags:
                    ["AI","Python","Hackathon"]
            },

            {
                id: 2,
                title:
                    "Applied Machine Learning Lab",
                type:
                    "Workshop",
                description:
                    "A practical workshop focused on real-world machine learning projects.",
                location:
                    "Online",
                mode:
                    "online",
                deadline:
                    "5 days left",
                prize:
                    "Certificate",
                match:
                    89,
                tags:
                    ["Machine Learning","AI","Workshop"]
            },

            {
                id: 3,
                title:
                    "Smart India Hackathon",
                type:
                    "Competition",
                description:
                    "Solve real-world problems and build innovative solutions.",
                location:
                    "Pan India",
                mode:
                    "offline",
                deadline:
                    "18 days left",
                prize:
                    "National Level",
                match:
                    86,
                tags:
                    ["Innovation","Problem Solving","Hackathon"]
            }

        ];


        renderOpportunities();

    }

}


/* =========================================================
   PERSONALIZED MATCH
========================================================= */

function calculateMatch(opportunity) {

    const profile =
        getStudentProfile();


    let score =
        Number(
            opportunity.match ||
            70
        );


    const text = [

        opportunity.title,

        opportunity.description,

        opportunity.type,

        opportunity.location,

        ...(opportunity.tags || [])

    ]
        .join(" ")
        .toLowerCase();


    profile.skills.forEach(
        skill => {

            if (
                text.includes(
                    String(
                        skill
                    ).toLowerCase()
                )
            ) {

                score += 4;

            }

        }
    );


    profile.goals.forEach(
        goal => {

            if (
                text.includes(
                    String(
                        goal
                    ).toLowerCase()
                )
            ) {

                score += 5;

            }

        }
    );


    if (
        profile.city !== "India" &&
        opportunity.location &&
        opportunity.location
            .toLowerCase()
            .includes(
                profile.city.toLowerCase()
            )
    ) {

        score += 3;

    }


    return Math.min(
        99,
        score
    );

}


/* =========================================================
   FILTER
========================================================= */

function getFilteredOpportunities() {

    const query =
        currentSearch
            .toLowerCase()
            .trim();


    return opportunities

        .map(
            opportunity => ({

                ...opportunity,

                personalizedMatch:
                    calculateMatch(
                        opportunity
                    )

            })
        )

        .filter(
            opportunity => {

                let locationOK =
                    true;


                if (
                    currentFilter ===
                    "Online"
                ) {

                    locationOK =
                        opportunity.mode ===
                        "online" ||
                        String(
                            opportunity.location
                        )
                            .toLowerCase()
                            .includes(
                                "online"
                            );

                }


                else if (
                    currentFilter ===
                    "Anywhere India"
                ) {

                    locationOK =
                        true;

                }


                else if (
                    currentFilter ===
                    "My City"
                ) {

                    const city =
                        getStudentProfile()
                            .city
                            .toLowerCase();


                    locationOK =
                        city === "india" ||
                        String(
                            opportunity.location
                        )
                            .toLowerCase()
                            .includes(
                                city
                            );

                }


                if (!locationOK)
                    return false;


                if (!query)
                    return true;


                const searchable = [

                    opportunity.title,

                    opportunity.type,

                    opportunity.description,

                    opportunity.location,

                    ...(opportunity.tags || [])

                ]
                    .join(" ")
                    .toLowerCase();


                return searchable.includes(
                    query
                );

            }
        )

        .sort(
            (a,b) =>
                b.personalizedMatch -
                a.personalizedMatch
        );

}


/* =========================================================
   CREATE CARD
========================================================= */

function createCard(opportunity) {

    const score =
        opportunity.personalizedMatch ||
        opportunity.match ||
        0;


    return `

        <article
            class="opportunity-card"
            data-id="${opportunity.id}">

            <div class="match-score">

                <strong>
                    ${score}%
                </strong>

                <span>
                    MATCH
                </span>

            </div>


            <div class="opportunity-content">

                <div class="opportunity-type">

                    ${escapeHtml(
                        opportunity.type ||
                        "OPPORTUNITY"
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
                        ""
                    )}

                </p>


                <div class="opportunity-meta">

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
                            opportunity.prize ||
                            opportunity.reward ||
                            "Opportunity"
                        )}
                    </span>

                </div>


                <div class="opportunity-tags">

                    ${(opportunity.tags || [])
                        .map(
                            tag =>
                                `<span>${escapeHtml(tag)}</span>`
                        )
                        .join("")}

                </div>


                <button
                    class="apply-button"
                    data-id="${opportunity.id}">

                    Apply Now →

                </button>

            </div>


            <button
                class="save-opportunity"
                data-id="${opportunity.id}">

                ♡

            </button>

        </article>

    `;

}


/* =========================================================
   RENDER
========================================================= */

function renderOpportunities() {

    if (!opportunitySection)
        return;


    const header =
        opportunitySection.querySelector(
            ".section-header"
        );


    if (!header)
        return;


    opportunitySection
        .querySelectorAll(
            ".opportunity-card, .no-results"
        )
        .forEach(
            element =>
                element.remove()
        );


    const list =
        getFilteredOpportunities();


    if (!list.length) {

        header.insertAdjacentHTML(
            "afterend",

            `

            <div class="no-results">

                <h3>
                    No opportunities found
                </h3>

                <p>
                    Try another search or location.
                </p>

            </div>

            `

        );

        return;

    }


    list
        .forEach(
            opportunity => {

                header.insertAdjacentHTML(
                    "afterend",
                    createCard(
                        opportunity
                    )
                );

            }
        );


    attachCardEvents();

}


/* =========================================================
   CARD EVENTS
========================================================= */

function attachCardEvents() {

    document
        .querySelectorAll(
            ".save-opportunity"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async event => {

                        event.stopPropagation();


                        const id =
                            Number(
                                button.dataset.id
                            );


                        await toggleSaved(
                            id
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".apply-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async event => {

                        event.stopPropagation();


                        const id =
                            Number(
                                button.dataset.id
                            );


                        await applyOpportunity(
                            id
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".opportunity-card"
        )
        .forEach(
            card => {

                card.addEventListener(
                    "click",
                    event => {

                        if (
                            event.target.closest(
                                "button"
                            )
                        )
                            return;


                        window.location.href =
                            "/opportunity/" +
                            card.dataset.id;

                    }
                );

            }
        );

}


/* =========================================================
   SAVE
========================================================= */

async function toggleSaved(id) {

    try {

        const response =
            await fetch(
                "/api/saved/" + id,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    credentials:
                        "same-origin"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Unable to save."
            );

        }


        toast(
            "Opportunity saved to your collection ♥"
        );


        await loadSaved();


    } catch (error) {

        console.error(
            error
        );

        toast(
            error.message
        );

    }

}


/* =========================================================
   APPLY
========================================================= */

async function applyOpportunity(id) {

    try {

        const response =
            await fetch(
                "/api/applications/" + id,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    credentials:
                        "same-origin"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Unable to apply."
            );

        }


        toast(
            "Application submitted successfully ✓"
        );


        await loadApplications();


    } catch (error) {

        console.error(
            error
        );

        toast(
            error.message
        );

    }

}


/* =========================================================
   SAVED PANEL
========================================================= */

async function loadSaved() {

    if (!savedContainer)
        return;


    try {

        const response =
            await fetch(
                "/api/saved",
                {
                    credentials:
                        "same-origin"
                }
            );


        const data =
            await response.json();


        const saved =
            data.saved ||
            data.opportunities ||
            [];


        if (!saved.length) {

            savedContainer.innerHTML = `

                <div class="saved-empty">

                    <div class="saved-empty-icon">
                        ♡
                    </div>

                    <h3>
                        Your collection is empty
                    </h3>

                    <p>
                        Save opportunities you're
                        interested in.
                    </p>

                </div>

            `;

            return;

        }


        savedContainer.innerHTML =
            saved
                .map(
                    item => `

                    <article class="saved-card">

                        <div class="saved-match">
                            ${item.match || 0}%
                        </div>

                        <div class="saved-card-content">

                            <div class="opportunity-type">
                                ${escapeHtml(item.type || "")}
                            </div>

                            <h3>
                                ${escapeHtml(item.title || "")}
                            </h3>

                            <div class="saved-meta">

                                <span>
                                    📍
                                    ${escapeHtml(item.location || "")}
                                </span>

                            </div>

                        </div>

                        <button
                            class="remove-saved"
                            data-id="${item.id}">

                            ♥

                        </button>

                    </article>

                `
                )
                .join("");


        document
            .querySelectorAll(
                ".remove-saved"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            toggleSaved(
                                Number(
                                    button.dataset.id
                                )
                            );

                            setTimeout(
                                loadSaved,
                                300
                            );

                        }
                    );

                }
            );


    } catch (error) {

        console.error(
            error
        );

    }

}


/* =========================================================
   APPLICATIONS
========================================================= */

async function loadApplications() {

    if (!applicationsList)
        return;


    try {

        const response =
            await fetch(
                "/api/applications",
                {
                    credentials:
                        "same-origin"
                }
            );


        const data =
            await response.json();


        const applications =
            data.applications ||
            [];


        const total =
            document.getElementById(
                "totalApplications"
            );


        if (total)
            total.textContent =
                applications.length;


        if (!applications.length) {

            applicationsList.innerHTML = `

                <div class="applications-empty">

                    <h3>
                        No applications yet
                    </h3>

                    <p>
                        Apply to an opportunity
                        to start your journey.
                    </p>

                </div>

            `;

            return;

        }


        applicationsList.innerHTML =
            applications
                .map(
                    item => `

                    <article
                        class="application-card">

                        <div
                            class="application-icon">

                            ✦

                        </div>


                        <div
                            class="application-info">

                            <div
                                class="opportunity-type">

                                ${escapeHtml(
                                    item.type || ""
                                )}

                            </div>


                            <h3>

                                ${escapeHtml(
                                    item.title || ""
                                )}

                            </h3>


                            <div
                                class="application-meta">

                                <span>
                                    📍
                                    ${escapeHtml(
                                        item.location || ""
                                    )}
                                </span>

                            </div>

                        </div>


                        <div
                            class="application-status">

                            ${escapeHtml(
                                item.status ||
                                "Applied"
                            )}

                        </div>

                    </article>

                `
                )
                .join("");


    } catch (error) {

        console.error(
            error
        );

    }

}


/* =========================================================
   PANELS
========================================================= */

function closeAllPanels() {

    [
        savedPanel,
        applicationsPanel,
        profilePanel,
        document.getElementById(
            "aceAiPanel"
        ),
        document.getElementById(
            "opportunityDetailsPanel"
        )
    ]
        .forEach(
            panel => {

                if (panel)
                    panel.classList.remove(
                        "visible"
                    );

            }
        );

}


if (savedNav) {

    savedNav.addEventListener(
        "click",
        event => {

            event.preventDefault();

            closeAllPanels();

            savedPanel.classList.add(
                "visible"
            );

            loadSaved();

        }
    );

}


if (closeSaved) {

    closeSaved.addEventListener(
        "click",
        closeAllPanels
    );

}


if (applicationsNav) {

    applicationsNav.addEventListener(
        "click",
        event => {

            event.preventDefault();

            closeAllPanels();

            applicationsPanel.classList.add(
                "visible"
            );

            loadApplications();

        }
    );

}


if (closeApplications) {

    closeApplications.addEventListener(
        "click",
        closeAllPanels
    );

}


function openProfile() {

    closeAllPanels();


    if (profilePanel) {

        profilePanel.classList.add(
            "visible"
        );

    }


    const profile =
        getStudentProfile();


    const location =
        document.getElementById(
            "profileLocation"
        );


    const skills =
        document.getElementById(
            "profileSkills"
        );


    const goals =
        document.getElementById(
            "profileGoals"
        );


    if (location)
        location.textContent =
            profile.city;


    if (skills)
        skills.innerHTML =
            profile.skills
                .map(
                    skill =>
                        `<span>${escapeHtml(skill)}</span>`
                )
                .join("");


    if (goals)
        goals.innerHTML =
            profile.goals
                .map(
                    goal =>
                        `<span>${escapeHtml(goal)}</span>`
                )
                .join("");

}


if (profileNav) {

    profileNav.addEventListener(
        "click",
        event => {

            event.preventDefault();

            openProfile();

        }
    );

}


if (profileButton) {

    profileButton.addEventListener(
        "click",
        openProfile
    );

}


if (closeProfile) {

    closeProfile.addEventListener(
        "click",
        closeAllPanels
    );

}


/* =========================================================
   LOCATION FILTERS
========================================================= */

document
    .querySelectorAll(
        ".location-filter"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".location-filter"
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


                    currentFilter =
                        button.dataset.location ||
                        "All";


                    renderOpportunities();

                }
            );

        }
    );


/* =========================================================
   SEARCH
========================================================= */

function performSearch() {

    currentSearch =
        searchInput
            ? searchInput.value
            : "";


    renderOpportunities();

}


if (searchButton) {

    searchButton.addEventListener(
        "click",
        performSearch
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                performSearch();

            }

        }
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

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


/* =========================================================
   USER DISPLAY
========================================================= */

function updateUserDisplay() {

    const profile =
        getStudentProfile();


    document
        .querySelectorAll(
            ".student-info strong"
        )
        .forEach(
            element =>
                element.textContent =
                    profile.name
        );


    document
        .querySelectorAll(
            ".profile-name"
        )
        .forEach(
            element =>
                element.textContent =
                    profile.name
        );


    document
        .querySelectorAll(
            ".profile-button"
        )
        .forEach(
            element =>
                element.textContent =
                    profile.name
                        .charAt(0)
                        .toUpperCase()
        );

}


/* =========================================================
   START
========================================================= */

updateUserDisplay();

loadOpportunities();

loadApplications();