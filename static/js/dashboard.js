/* =========================================================
   ACE NEXUS — CLEAN DASHBOARD ENGINE
   Working foundation:
   Search
   Location Filters
   Saved
   Applications
   Profile
   Personalization
   Opportunity Navigator
========================================================= */


/* =========================================================
   OPPORTUNITY DATA
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
   PROFILE
========================================================= */

function getStudentProfile() {

    return {

        skills:
            JSON.parse(
                localStorage.getItem("aceSkills") || "[]"
            ),

        goals:
            JSON.parse(
                localStorage.getItem("aceGoals") || "[]"
            ),

        city:
            localStorage.getItem("aceStudentCity") || "India"

    };

}


function normalize(value) {

    return String(value)
        .toLowerCase()
        .trim();

}


/* =========================================================
   PERSONALIZED MATCHING
========================================================= */

function calculatePersonalizedScore(opportunity) {

    const profile =
        getStudentProfile();

    let score =
        opportunity.match;


    const skills =
        profile.skills.map(normalize);

    const goals =
        profile.goals.map(normalize);


    const opportunityText =
        [
            opportunity.title,
            opportunity.description,
            opportunity.type,
            ...opportunity.tags
        ]
            .map(normalize)
            .join(" ");


    skills.forEach(skill => {

        if (
            skill &&
            opportunityText.includes(skill)
        ) {

            score += 4;

        }

    });


    goals.forEach(goal => {

        if (
            goal &&
            opportunityText.includes(goal)
        ) {

            score += 5;

        }

    });


    if (
        profile.city !== "India" &&
        normalize(opportunity.location) ===
        normalize(profile.city)
    ) {

        score += 3;

    }


    return Math.min(
        Math.round(score),
        99
    );

}


function getPersonalizedOpportunities() {

    return opportunities
        .map(opportunity => ({

            ...opportunity,

            personalizedMatch:
                calculatePersonalizedScore(
                    opportunity
                )

        }))
        .sort(
            (a, b) =>
                b.personalizedMatch -
                a.personalizedMatch
        );

}


/* =========================================================
   ELEMENTS
========================================================= */

const opportunitySection =
    document.querySelector(".opportunity-section");

const locationFilters =
    document.querySelectorAll(".location-filter");

const searchInput =
    document.getElementById("opportunitySearch");

const searchButton =
    document.getElementById("searchButton");

const savedPanel =
    document.getElementById("savedPanel");

const savedContainer =
    document.getElementById("savedOpportunities");

const savedNav =
    document.getElementById("savedNav");

const closeSaved =
    document.getElementById("closeSaved");

const applicationsPanel =
    document.getElementById("applicationsPanel");

const applicationsNav =
    document.getElementById("applicationsNav");

const closeApplications =
    document.getElementById("closeApplications");

const applicationsList =
    document.getElementById("applicationsList");

const profilePanel =
    document.getElementById("profilePanel");

const profileNav =
    document.getElementById("profileNav");

const profileButton =
    document.getElementById("profileButton");

const closeProfile =
    document.getElementById("closeProfile");


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


function setSaved(saved) {

    localStorage.setItem(
        "aceSavedOpportunities",
        JSON.stringify(saved)
    );

}


function isSaved(id) {

    return getSaved().some(
        item => item.id === id
    );

}


function toggleSaved(id) {

    let saved =
        getSaved();


    if (
        saved.some(
            item => item.id === id
        )
    ) {

        saved =
            saved.filter(
                item => item.id !== id
            );

    } else {

        const opportunity =
            opportunities.find(
                item => item.id === id
            );

        if (opportunity) {

            saved.push(opportunity);

        }

    }


    setSaved(saved);

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


function setApplications(applications) {

    localStorage.setItem(
        "aceApplications",
        JSON.stringify(applications)
    );

}


function hasApplied(id) {

    return getApplications().some(
        item => item.id === id
    );

}


function applyToOpportunity(id) {

    const opportunity =
        opportunities.find(
            item => item.id === id
        );


    if (!opportunity) return;


    const applications =
        getApplications();


    if (
        applications.some(
            item => item.id === id
        )
    ) {

        return;

    }


    applications.push({

        ...opportunity,

        status: "Applied",

        appliedOn:
            new Date()
                .toLocaleDateString("en-IN")

    });


    setApplications(
        applications
    );

}


/* =========================================================
   OPPORTUNITY CARD
========================================================= */

function createCard(opportunity) {

    const saved =
        isSaved(opportunity.id);

    const applied =
        hasApplied(opportunity.id);

    const score =
        opportunity.personalizedMatch ||
        opportunity.match;


    return `

        <article class="opportunity-card">

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
                    ${opportunity.type}
                </div>


                <h3>
                    ${opportunity.title}
                </h3>


                <p>
                    ${opportunity.description}
                </p>


                <div class="opportunity-meta">

                    <span>
                        📍 ${opportunity.location}
                    </span>

                    <span>
                        ◷ ${opportunity.deadline}
                    </span>

                    <span>
                        ${opportunity.prize}
                    </span>

                </div>


                <div class="opportunity-tags">

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
   DISPLAY OPPORTUNITIES
========================================================= */

function displayOpportunities(list) {

    if (!opportunitySection) return;


    const header =
        opportunitySection.querySelector(
            ".section-header"
        );


    opportunitySection
        .querySelectorAll(
            ".opportunity-card, .no-results"
        )
        .forEach(
            element => element.remove()
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
                    Try another location or search.
                </p>

            </div>

            `

        );

        return;

    }


    list.forEach(opportunity => {

        header.insertAdjacentHTML(
            "afterend",
            createCard(opportunity)
        );

    });


    attachSaveButtons();

    attachApplyButtons();

}


/* =========================================================
   SAVE BUTTONS
========================================================= */

function attachSaveButtons() {

    document
        .querySelectorAll(".save-opportunity")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    const id =
                        Number(
                            button.dataset.id
                        );


                    toggleSaved(id);


                    const saved =
                        isSaved(id);


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

        });

}


/* =========================================================
   APPLY BUTTONS
========================================================= */

function attachApplyButtons() {

    document
        .querySelectorAll(".apply-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    const id =
                        Number(
                            button.dataset.id
                        );


                    applyToOpportunity(id);


                    displayCurrentOpportunities();

                    renderApplications();

                }
            );

        });

}


/* =========================================================
   LOCATION FILTER
========================================================= */

function filterByLocation(location) {

    let filtered;


    if (location === "Online") {

        filtered =
            getPersonalizedOpportunities()
                .filter(
                    item =>
                        item.mode === "online"
                );

    }

    else if (
        location === "Anywhere in India"
    ) {

        filtered =
            getPersonalizedOpportunities();

    }

    else if (
        location === "My City"
    ) {

        const city =
            getStudentProfile().city;


        filtered =
            getPersonalizedOpportunities()
                .filter(
                    item =>
                        normalize(
                            item.location
                        ) === normalize(city)
                        ||
                        item.location ===
                            "Pan India"
                );

    }

    else {

        filtered =
            getPersonalizedOpportunities()
                .slice(0, 3);

    }


    displayOpportunities(filtered);

}


/* =========================================================
   LOCATION EVENTS
========================================================= */

locationFilters.forEach(filter => {

    filter.addEventListener(
        "click",
        () => {

            locationFilters.forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


            filter.classList.add(
                "active"
            );


            filterByLocation(
                filter.dataset.location
            );

        }
    );

});


/* =========================================================
   SEARCH
========================================================= */

function performSearch() {

    const query =
        searchInput
            ? normalize(searchInput.value)
            : "";


    if (!query) {

        displayCurrentOpportunities();

        return;

    }


    const results =
        getPersonalizedOpportunities()
            .filter(opportunity => {

                const searchable =
                    [

                        opportunity.title,

                        opportunity.type,

                        opportunity.description,

                        opportunity.location,

                        ...opportunity.tags

                    ]
                        .map(normalize)
                        .join(" ");


                return searchable.includes(
                    query
                );

            });


    displayOpportunities(results);

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

            if (event.key === "Enter") {

                performSearch();

            }

        }
    );

}


/* =========================================================
   SAVED PANEL
========================================================= */

function renderSaved() {

    if (!savedContainer) return;


    const saved =
        getSaved();


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

            <article class="saved-card">

                <div class="saved-match">
                    ${opportunity.match}%
                </div>


                <div class="saved-card-content">

                    <div class="opportunity-type">
                        ${opportunity.type}
                    </div>


                    <h3>
                        ${opportunity.title}
                    </h3>


                    <div class="saved-meta">

                        <span>
                            📍 ${opportunity.location}
                        </span>

                        <span>
                            ◷ ${opportunity.deadline}
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
        .querySelectorAll(".remove-saved")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    toggleSaved(
                        Number(
                            button.dataset.id
                        )
                    );


                    renderSaved();

                    displayCurrentOpportunities();

                }
            );

        });

}


/* =========================================================
   APPLICATION PANEL
========================================================= */

function renderApplications() {

    if (!applicationsList) return;


    const applications =
        getApplications();


    const total =
        document.getElementById(
            "totalApplications"
        );

    const review =
        document.getElementById(
            "reviewApplications"
        );

    const shortlisted =
        document.getElementById(
            "shortlistedApplications"
        );


    if (total)
        total.textContent =
            applications.length;


    if (review)
        review.textContent =
            applications.filter(
                item =>
                    item.status ===
                    "Under Review"
            ).length;


    if (shortlisted)
        shortlisted.textContent =
            applications.filter(
                item =>
                    item.status ===
                    "Shortlisted"
            ).length;


    if (!applications.length) {

        applicationsList.innerHTML = `

            <div class="applications-empty">

                <div>
                    ▣
                </div>

                <h3>
                    No applications yet
                </h3>

                <p>
                    Explore opportunities and
                    start your journey.
                </p>

            </div>

        `;

        return;

    }


    applicationsList.innerHTML =
        applications.map(
            application => `

            <article class="application-card">

                <div class="application-icon">
                    ✦
                </div>


                <div class="application-info">

                    <div class="opportunity-type">
                        ${application.type}
                    </div>


                    <h3>
                        ${application.title}
                    </h3>


                    <div class="application-meta">

                        <span>
                            📍 ${application.location}
                        </span>

                        <span>
                            Applied ${application.appliedOn}
                        </span>

                    </div>

                </div>


                <div class="application-status">

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
   CLOSE ALL PANELS
========================================================= */

function closeAllPanels() {

    [
        savedPanel,
        applicationsPanel,
        profilePanel
    ]
        .forEach(panel => {

            if (panel) {

                panel.classList.remove(
                    "visible"
                );

            }

        });

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

            savedPanel.classList.add(
                "visible"
            );

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

            applicationsPanel.classList.add(
                "visible"
            );

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

    if (profilePanel) {

        profilePanel.classList.add(
            "visible"
        );

    }


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
   DISPLAY CURRENT OPPORTUNITIES
========================================================= */

function displayCurrentOpportunities() {

    const active =
        document.querySelector(
            ".location-filter.active"
        );


    filterByLocation(
        active
            ? active.dataset.location
            : "Near Me"
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

renderProfile();

displayCurrentOpportunities();