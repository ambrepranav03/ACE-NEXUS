/* =========================================================
   ACE NEXUS — PERSONALIZED DASHBOARD ENGINE
========================================================= */


/* =========================================================
   OPPORTUNITY DATABASE
========================================================= */

const opportunities = [

    {
        id: 1,
        title: "AI Innovation Challenge",
        type: "HACKATHON · OFFLINE",
        description:
            "Build real-world AI solutions with students, mentors and industry experts.",
        location: "Bengaluru",
        mode: "offline",
        deadline: "12 days left",
        prize: "₹75,000 Prize",
        match: 94,
        tags: ["AI", "Python", "Hackathon"]
    },

    {
        id: 2,
        title: "Applied Machine Learning Lab",
        type: "WORKSHOP · ONLINE",
        description:
            "A practical workshop focused on real-world machine learning projects.",
        location: "Online",
        mode: "online",
        deadline: "5 days left",
        prize: "Certificate",
        match: 89,
        tags: ["Machine Learning", "AI", "Workshop"]
    },

    {
        id: 3,
        title: "Smart India Hackathon",
        type: "COMPETITION · INDIA",
        description:
            "Solve real-world problems and build innovative solutions with your team.",
        location: "Pan India",
        mode: "offline",
        deadline: "18 days left",
        prize: "National Level",
        match: 86,
        tags: ["Innovation", "Problem Solving", "Hackathon"]
    },

    {
        id: 4,
        title: "Mumbai TechSprint",
        type: "HACKATHON · OFFLINE",
        description:
            "Build practical technology solutions with developers and innovators.",
        location: "Mumbai",
        mode: "offline",
        deadline: "9 days left",
        prize: "₹50,000 Prize",
        match: 91,
        tags: ["Web", "AI", "Innovation"]
    },

    {
        id: 5,
        title: "Delhi AI Builders",
        type: "HACKATHON · OFFLINE",
        description:
            "Create AI-powered solutions for real-world social and technical challenges.",
        location: "Delhi",
        mode: "offline",
        deadline: "15 days left",
        prize: "₹60,000 Prize",
        match: 88,
        tags: ["AI", "Python", "Innovation"]
    },

    {
        id: 6,
        title: "Hyderabad Developer Week",
        type: "TECH EVENT · OFFLINE",
        description:
            "Connect with developers, mentors and companies through talks and challenges.",
        location: "Hyderabad",
        mode: "offline",
        deadline: "7 days left",
        prize: "Certificate",
        match: 84,
        tags: ["Development", "Networking", "Career"]
    },

    {
        id: 7,
        title: "Chennai Robotics Challenge",
        type: "COMPETITION · OFFLINE",
        description:
            "Design and prototype innovative robotics solutions with your team.",
        location: "Chennai",
        mode: "offline",
        deadline: "21 days left",
        prize: "₹80,000 Prize",
        match: 82,
        tags: ["Robotics", "Hardware", "Engineering"]
    },

    {
        id: 8,
        title: "Kolkata Innovation Sprint",
        type: "HACKATHON · OFFLINE",
        description:
            "Turn creative ideas into working technology prototypes.",
        location: "Kolkata",
        mode: "offline",
        deadline: "11 days left",
        prize: "₹40,000 Prize",
        match: 80,
        tags: ["Innovation", "Startup", "Technology"]
    }

];


/* =========================================================
   STUDENT PROFILE
========================================================= */

function getStudentProfile() {

    return {

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
            ),

        city:
            localStorage.getItem(
                "aceStudentCity"
            ) || "India"

    };

}


/* =========================================================
   NORMALIZE PROFILE DATA
========================================================= */

function normalize(value) {

    return String(value)
        .toLowerCase()
        .trim();

}


/* =========================================================
   PERSONALIZED MATCH SCORE
========================================================= */

function calculatePersonalizedScore(
    opportunity
) {

    const profile =
        getStudentProfile();


    let score =
        opportunity.match;


    const skills =
        profile.skills.map(
            normalize
        );


    const goals =
        profile.goals.map(
            normalize
        );


    const opportunityText =
        [

            opportunity.title,

            opportunity.description,

            opportunity.type,

            ...opportunity.tags

        ]
            .map(normalize)
            .join(" ");


    /* -----------------------------------------
       SKILL MATCH
    ----------------------------------------- */

    skills.forEach(
        skill => {

            if (
                skill &&
                opportunityText.includes(
                    skill
                )
            ) {

                score += 4;

            }

        }
    );


    /* -----------------------------------------
       GOAL MATCH
    ----------------------------------------- */

    goals.forEach(
        goal => {

            if (
                goal &&
                opportunityText.includes(
                    goal
                )
            ) {

                score += 5;

            }

        }
    );


    /* -----------------------------------------
       CITY MATCH
    ----------------------------------------- */

    if (
        profile.city !== "India" &&
        normalize(
            opportunity.location
        ) === normalize(
            profile.city
        )
    ) {

        score += 3;

    }


    return Math.min(
        Math.round(score),
        99
    );

}


/* =========================================================
   PERSONALIZED OPPORTUNITIES
========================================================= */

function getPersonalizedOpportunities() {

    return opportunities
        .map(
            opportunity => ({

                ...opportunity,

                personalizedMatch:
                    calculatePersonalizedScore(
                        opportunity
                    )

            })
        )
        .sort(
            (
                a,
                b
            ) =>
                b.personalizedMatch -
                a.personalizedMatch
        );

}


/* =========================================================
   ELEMENTS
========================================================= */

const opportunitySection =
    document.querySelector(
        ".opportunity-section"
    );

const locationFilters =
    document.querySelectorAll(
        ".location-filter"
    );

const searchInput =
    document.getElementById(
        "opportunitySearch"
    );

const searchButton =
    document.getElementById(
        "searchButton"
    );

const savedPanel =
    document.getElementById(
        "savedPanel"
    );

const savedContainer =
    document.getElementById(
        "savedOpportunities"
    );

const savedNav =
    document.getElementById(
        "savedNav"
    );

const closeSaved =
    document.getElementById(
        "closeSaved"
    );

const applicationsPanel =
    document.getElementById(
        "applicationsPanel"
    );

const applicationsNav =
    document.getElementById(
        "applicationsNav"
    );

const closeApplications =
    document.getElementById(
        "closeApplications"
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

const profileButton =
    document.getElementById(
        "profileButton"
    );

const closeProfile =
    document.getElementById(
        "closeProfile"
    );


/* =========================================================
   SAVED SYSTEM
========================================================= */

function getSaved() {

    return JSON.parse(
        localStorage.getItem(
            "aceSavedOpportunities"
        ) || "[]"
    );

}


function setSaved(
    saved
) {

    localStorage.setItem(
        "aceSavedOpportunities",
        JSON.stringify(
            saved
        )
    );

}


function isSaved(
    id
) {

    return getSaved().some(
        item =>
            item.id === id
    );

}


function toggleSaved(
    id
) {

    let saved =
        getSaved();


    if (
        saved.some(
            item =>
                item.id === id
        )
    ) {

        saved =
            saved.filter(
                item =>
                    item.id !== id
            );

    } else {

        const opportunity =
            opportunities.find(
                item =>
                    item.id === id
            );


        if (opportunity) {

            saved.push(
                opportunity
            );

        }

    }


    setSaved(
        saved
    );

}


/* =========================================================
   APPLICATION SYSTEM
========================================================= */

function getApplications() {

    return JSON.parse(
        localStorage.getItem(
            "aceApplications"
        ) || "[]"
    );

}


function setApplications(
    applications
) {

    localStorage.setItem(
        "aceApplications",
        JSON.stringify(
            applications
        )
    );

}


function hasApplied(
    id
) {

    return getApplications()
        .some(
            item =>
                item.id === id
        );

}


function applyToOpportunity(
    id
) {

    const opportunity =
        opportunities.find(
            item =>
                item.id === id
        );


    if (!opportunity)
        return;


    const applications =
        getApplications();


    if (
        applications.some(
            item =>
                item.id === id
        )
    )
        return;


    applications.push({

        ...opportunity,

        status:
            "Applied",

        appliedOn:
            new Date()
                .toLocaleDateString(
                    "en-IN"
                )

    });


    setApplications(
        applications
    );


    displayCurrentOpportunities();

    renderApplications();

}


/* =========================================================
   OPPORTUNITY CARD
========================================================= */

function createCard(
    opportunity,
    index
) {

    const saved =
        isSaved(
            opportunity.id
        );


    const applied =
        hasApplied(
            opportunity.id
        );


    const score =
        opportunity.personalizedMatch ||
        opportunity.match;


    return `

        <article
            class="opportunity-card">


            <div
                class="match-score">

                <strong>
                    ${score}%
                </strong>

                <span>
                    MATCH
                </span>

            </div>


            <div
                class="opportunity-content">


                <div
                    class="opportunity-type">

                    ${opportunity.type}

                </div>


                <h3>
                    ${opportunity.title}
                </h3>


                <p>
                    ${opportunity.description}
                </p>


                <div
                    class="opportunity-meta">

                    <span>
                        📍
                        ${opportunity.location}
                    </span>

                    <span>
                        ◷
                        ${opportunity.deadline}
                    </span>

                    <span>
                        ${opportunity.prize}
                    </span>

                </div>


                <div
                    class="opportunity-tags">

                    ${opportunity.tags
                        .map(
                            tag =>
                                `<span>${tag}</span>`
                        )
                        .join("")}

                </div>


                <button
                    class="apply-button"
                    data-id="${opportunity.id}"
                    ${applied ? "disabled" : ""}>

                    ${
                        applied
                            ? "✓ Applied"
                            : "Apply Now →"
                    }

                </button>


            </div>


            <button
                class="save-opportunity
                ${saved ? "saved" : ""}"
                data-id="${opportunity.id}">

                ${saved ? "♥" : "♡"}

            </button>


        </article>

    `;

}


/* =========================================================
   DISPLAY
========================================================= */

function displayOpportunities(
    list
) {

    if (!opportunitySection)
        return;


    const header =
        opportunitySection.querySelector(
            ".section-header"
        );


    opportunitySection
        .querySelectorAll(
            ".opportunity-card, .no-results"
        )
        .forEach(
            element =>
                element.remove()
        );


    if (!list.length) {

        header.insertAdjacentHTML(
            "afterend",

            `

            <div class="no-results">

                <div>
                    ◌
                </div>

                <h3>
                    No opportunities found
                </h3>

                <p>
                    Try another location
                    or search.
                </p>

            </div>

            `

        );

        return;

    }


    list.forEach(
        (
            opportunity,
            index
        ) => {

            header.insertAdjacentHTML(
                "afterend",

                createCard(
                    opportunity,
                    index
                )

            );

        }
    );


    attachSaveButtons();

    attachApplyButtons();

}


/* =========================================================
   SAVE EVENTS
========================================================= */

function attachSaveButtons() {

    document
        .querySelectorAll(
            ".save-opportunity"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(
                                button.dataset.id
                            );


                        toggleSaved(
                            id
                        );


                        const saved =
                            isSaved(
                                id
                            );


                        button.classList.toggle(
                            "saved",
                            saved
                        );


                        button.textContent =
                            saved
                                ? "♥"
                                : "♡";


                        renderSaved();

                    }
                );

            }
        );

}


/* =========================================================
   APPLY EVENTS
========================================================= */

function attachApplyButtons() {

    document
        .querySelectorAll(
            ".apply-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        applyToOpportunity(
                            Number(
                                button.dataset.id
                            )
                        );

                    }
                );

            }
        );

}


/* =========================================================
   LOCATION FILTERING
========================================================= */

function filterByLocation(
    location
) {

    let filtered;


    if (
        location === "Online"
    ) {

        filtered =
            getPersonalizedOpportunities()
                .filter(
                    item =>
                        item.mode ===
                        "online"
                );

    }


    else if (
        location ===
        "Anywhere in India"
    ) {

        filtered =
            getPersonalizedOpportunities();

    }


    else if (
        location ===
        "My City"
    ) {

        const city =
            getStudentProfile()
                .city;


        filtered =
            getPersonalizedOpportunities()
                .filter(
                    item =>
                        normalize(
                            item.location
                        ) ===
                        normalize(
                            city
                        )
                        ||
                        item.location ===
                            "Pan India"
                );

    }


    else {

        filtered =
            getPersonalizedOpportunities()
                .slice(
                    0,
                    3
                );

    }


    displayOpportunities(
        filtered
    );

}


/* =========================================================
   LOCATION EVENTS
========================================================= */

locationFilters.forEach(
    filter => {

        filter.addEventListener(
            "click",
            () => {

                locationFilters
                    .forEach(
                        item =>
                            item.classList
                                .remove(
                                    "active"
                                )
                    );


                filter.classList.add(
                    "active"
                );


                filterByLocation(
                    filter.dataset
                        .location
                );

            }
        );

    }
);


/* =========================================================
   SEARCH
========================================================= */

function performSearch() {

    const query =
        searchInput
            ? normalize(
                searchInput.value
            )
            : "";


    if (!query) {

        displayCurrentOpportunities();

        return;

    }


    const results =
        getPersonalizedOpportunities()
            .filter(
                opportunity => {

                    const searchable = [

                        opportunity.title,

                        opportunity.type,

                        opportunity.description,

                        opportunity.location,

                        ...opportunity.tags

                    ]
                        .map(
                            normalize
                        )
                        .join(" ");


                    return searchable
                        .includes(
                            query
                        );

                }
            );


    displayOpportunities(
        results
    );

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
   SAVED PANEL
========================================================= */

function renderSaved() {

    if (!savedContainer)
        return;


    const saved =
        getSaved();


    if (!saved.length) {

        savedContainer.innerHTML = `

            <div
                class="saved-empty">

                <div
                    class="saved-empty-icon">

                    ♡

                </div>

                <h3>
                    Your collection is empty
                </h3>

                <p>
                    Save opportunities you're
                    interested in and they'll
                    appear here.
                </p>

            </div>

        `;

        return;

    }


    savedContainer.innerHTML =
        saved.map(
            opportunity => `

            <article
                class="saved-card">

                <div
                    class="saved-match">

                    ${opportunity.match}%

                </div>


                <div
                    class="saved-card-content">

                    <div
                        class="opportunity-type">

                        ${opportunity.type}

                    </div>


                    <h3>
                        ${opportunity.title}
                    </h3>


                    <div
                        class="saved-meta">

                        <span>
                            📍
                            ${opportunity.location}
                        </span>

                        <span>
                            ◷
                            ${opportunity.deadline}
                        </span>

                    </div>

                </div>


                <button
                    class="remove-saved"
                    data-id="${opportunity.id}">

                    ♥

                </button>

            </article>

        `
        ).join("");


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


                        renderSaved();

                        displayCurrentOpportunities();

                    }
                );

            }
        );

}


/* =========================================================
   APPLICATION PANEL
========================================================= */

function renderApplications() {

    if (!applicationsList)
        return;


    const applications =
        getApplications();


    document.getElementById(
        "totalApplications"
    ).textContent =
        applications.length;


    document.getElementById(
        "reviewApplications"
    ).textContent =
        applications.filter(
            item =>
                item.status ===
                "Under Review"
        ).length;


    document.getElementById(
        "shortlistedApplications"
    ).textContent =
        applications.filter(
            item =>
                item.status ===
                "Shortlisted"
        ).length;


    if (!applications.length) {

        applicationsList.innerHTML = `

            <div
                class="applications-empty">

                <div>
                    ▣
                </div>

                <h3>
                    No applications yet
                </h3>

                <p>
                    Explore opportunities
                    and start your journey.
                </p>

            </div>

        `;

        return;

    }


    applicationsList.innerHTML =
        applications.map(
            application => `

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

                        ${application.type}

                    </div>


                    <h3>
                        ${application.title}
                    </h3>


                    <div
                        class="application-meta">

                        <span>
                            📍
                            ${application.location}
                        </span>

                        <span>
                            Applied
                            ${application.appliedOn}
                        </span>

                    </div>

                </div>


                <div
                    class="application-status">

                    ${application.status}

                </div>

            </article>

        `
        ).join("");

}


/* =========================================================
   PROFILE PANEL
========================================================= */

function renderProfile() {

    const profile =
        getStudentProfile();


    const skillsContainer =
        document.getElementById(
            "profileSkills"
        );

    const goalsContainer =
        document.getElementById(
            "profileGoals"
        );

    const location =
        document.getElementById(
            "profileLocation"
        );


    if (location) {

        location.textContent =
            profile.city;

    }


    if (skillsContainer) {

        skillsContainer.innerHTML =
            profile.skills.length

                ? profile.skills
                    .map(
                        skill =>
                            `<span>${skill}</span>`
                    )
                    .join("")

                : `<span>Skills not added yet</span>`;

    }


    if (goalsContainer) {

        goalsContainer.innerHTML =
            profile.goals.length

                ? profile.goals
                    .map(
                        goal =>
                            `<span>${goal}</span>`
                    )
                    .join("")

                : `<span>Goals not added yet</span>`;

    }

}


/* =========================================================
   CLOSE PANELS
========================================================= */

function closeAllPanels() {

    [
        savedPanel,
        applicationsPanel,
        profilePanel
    ]
        .forEach(
            panel => {

                if (panel) {

                    panel.classList
                        .remove(
                            "visible"
                        );

                }

            }
        );

}


/* =========================================================
   SAVED NAVIGATION
========================================================= */

if (savedNav) {

    savedNav.addEventListener(
        "click",
        event => {

            event.preventDefault();

            closeAllPanels();

            savedPanel.classList
                .add("visible");

            renderSaved();

        }
    );

}


if (closeSaved) {

    closeSaved.addEventListener(
        "click",
        closeAllPanels
    );

}


/* =========================================================
   APPLICATION NAVIGATION
========================================================= */

if (applicationsNav) {

    applicationsNav.addEventListener(
        "click",
        event => {

            event.preventDefault();

            closeAllPanels();

            applicationsPanel
                .classList
                .add("visible");

            renderApplications();

        }
    );

}


if (closeApplications) {

    closeApplications.addEventListener(
        "click",
        closeAllPanels
    );

}


/* =========================================================
   PROFILE NAVIGATION
========================================================= */

function openProfile() {

    closeAllPanels();

    profilePanel
        .classList
        .add("visible");

    renderProfile();

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
   INITIAL LOAD
========================================================= */

renderProfile();

displayCurrentOpportunities();

/* =========================================================
   ACE AI — ASSISTANT INTERACTION
========================================================= */

const aceAiPanel =
    document.getElementById("aceAiPanel");

const closeAceAI =
    document.getElementById("closeAceAI");

const aceAiInput =
    document.getElementById("aceAiInput");

const aceAiSend =
    document.getElementById("aceAiSend");

const aceAiMessages =
    document.getElementById("aceAiMessages");

const aceAiSuggestions =
    document.querySelectorAll(
        ".ace-ai-suggestions button"
    );


/* =========================================================
   OPEN ACE AI
========================================================= */

function openAceAI() {

    closeAllPanels();

    if (!aceAiPanel) return;

    aceAiPanel.classList.add("visible");

}


/* =========================================================
   CLOSE ACE AI
========================================================= */

if (closeAceAI) {

    closeAceAI.addEventListener(
        "click",
        () => {

            aceAiPanel.classList.remove(
                "visible"
            );

        }
    );

}


/* =========================================================
   CONNECT ACE AI SIDEBAR BUTTON
========================================================= */

const aceAiNav =
    [...document.querySelectorAll(
        ".sidebar-item"
    )]
        .find(
            item =>
                item.textContent
                    .includes("ACE AI")
        );


if (aceAiNav) {

    aceAiNav.addEventListener(
        "click",
        event => {

            event.preventDefault();

            openAceAI();

        }
    );

}


/* =========================================================
   ADD MESSAGE
========================================================= */

function addAceMessage(
    text,
    sender = "user"
) {

    if (!aceAiMessages) return;


    const message =
        document.createElement(
            "div"
        );


    message.className =
        sender === "ai"
            ? "ace-message ace-message-ai"
            : "ace-message ace-message-user";


    if (sender === "ai") {

        message.innerHTML = `

            <div class="ace-message-avatar">
                ✦
            </div>

            <div class="ace-message-bubble">
                ${text}
            </div>

        `;

    } else {

        message.innerHTML = `

            <div class="ace-message-bubble">
                ${text}
            </div>

        `;

    }


    aceAiMessages.appendChild(
        message
    );


    aceAiMessages.scrollTop =
        aceAiMessages.scrollHeight;

}


/* =========================================================
   GENERATE PROTOTYPE RESPONSE
========================================================= */

function getAceResponse(
    question
) {

    const q =
        question.toLowerCase();


    const profile =
        getStudentProfile();


    /* HACKATHONS */

    if (
        q.includes("hackathon") ||
        q.includes("competition")
    ) {

        const matches =
            getPersonalizedOpportunities()
                .filter(
                    item =>
                        item.type
                            .toLowerCase()
                            .includes(
                                "hackathon"
                            )
                        ||
                        item.type
                            .toLowerCase()
                            .includes(
                                "competition"
                            )
                )
                .slice(0, 3);


        if (matches.length) {

            return `
                I found ${matches.length}
                strong matches for you:

                <br><br>

                ${matches
                    .map(
                        item =>
                            `🔥 <strong>
                                ${item.title}
                            </strong>
                            — ${item.personalizedMatch}%
                            match`
                    )
                    .join("<br>")}
            `;

        }

    }


    /* PROFILE */

    if (
        q.includes("profile") ||
        q.includes("skills")
    ) {

        if (profile.skills.length) {

            return `
                Your current skills are:

                <br><br>

                <strong>
                    ${profile.skills.join(
                        " · "
                    )}
                </strong>

                <br><br>

                I'd recommend choosing opportunities
                that strengthen these skills through
                real projects and competitions.
            `;

        }


        return `
            Your profile doesn't have skills
            connected yet.

            <br><br>

            Add your skills first and I'll use them
            to improve your opportunity matches.
        `;

    }


    /* NEXT STEP */

    if (
        q.includes("next") ||
        q.includes("what should") ||
        q.includes("recommend")
    ) {

        const best =
            getPersonalizedOpportunities()[0];


        if (best) {

            return `
                Based on your current profile,
                I'd explore:

                <br><br>

                🚀 <strong>
                    ${best.title}
                </strong>

                <br>

                ${best.personalizedMatch}%
                profile match.

                <br><br>

                Your next move should be to
                review the opportunity and apply
                if the requirements fit you.
            `;

        }

    }


    /* APPLICATIONS */

    if (
        q.includes("application") ||
        q.includes("applied")
    ) {

        const applications =
            getApplications();


        if (!applications.length) {

            return `
                You haven't applied to anything
                yet.

                <br><br>

                I'd start with one high-match
                opportunity from your dashboard.
            `;

        }


        return `
            You currently have

            <strong>
                ${applications.length}
                application(s)
            </strong>.

            <br><br>

            Open <strong>My Applications</strong>
            to track your journey.
        `;

    }


    /* DEFAULT */

    return `
        I'm currently focused on helping you
        discover and navigate opportunities.

        <br><br>

        Try asking me:

        <br><br>

        • Find hackathons for me
        <br>
        • What should I do next?
        <br>
        • Help me improve my profile
        <br>
        • Show opportunities matching my skills
    `;

}


/* =========================================================
   SEND MESSAGE
========================================================= */

function sendAceMessage() {

    if (!aceAiInput) return;


    const question =
        aceAiInput.value.trim();


    if (!question) return;


    addAceMessage(
        question,
        "user"
    );


    aceAiInput.value = "";


    /* Small thinking delay */

    setTimeout(
        () => {

            const response =
                getAceResponse(
                    question
                );


            addAceMessage(
                response,
                "ai"
            );

        },
        450
    );

}


/* =========================================================
   SEND BUTTON
========================================================= */

if (aceAiSend) {

    aceAiSend.addEventListener(
        "click",
        sendAceMessage
    );

}


/* =========================================================
   ENTER KEY
========================================================= */

if (aceAiInput) {

    aceAiInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                sendAceMessage();

            }

        }
    );

}


/* =========================================================
   QUICK SUGGESTIONS
========================================================= */

aceAiSuggestions.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const prompt =
                    button.dataset.prompt;


                if (!prompt) return;


                if (aceAiInput) {

                    aceAiInput.value =
                        prompt;

                }


                sendAceMessage();

            }
        );

    }
);

/* =========================================================
   ACE AI BUTTON — DIRECT CONNECTION
========================================================= */

const aceAIButton = document.querySelector(
    '.sidebar-item:nth-of-type(6)'
);

const aceAIPanel = document.getElementById(
    'aceAiPanel'
);

const closeAceAIButton = document.getElementById(
    'closeAceAI'
);


if (aceAIButton && aceAIPanel) {

    aceAIButton.addEventListener(
        'click',
        function(event) {

            event.preventDefault();

            aceAIPanel.classList.add(
                'visible'
            );

        }
    );

}


if (closeAceAIButton && aceAIPanel) {

    closeAceAIButton.addEventListener(
        'click',
        function() {

            aceAIPanel.classList.remove(
                'visible'
            );

        }
    );

}
console.log("ACE AI JS LOADED");

/* =========================================================
   ACE AI DIRECT BUTTON
========================================================= */

const aceAiNavButton =
    document.getElementById("aceAiNav");

const aceAiPanelElement =
    document.getElementById("aceAiPanel");


if (
    aceAiNavButton &&
    aceAiPanelElement
) {

    aceAiNavButton.onclick =
        function(event) {

            event.preventDefault();

            aceAiPanelElement.classList.add(
                "visible"
            );

        };

}