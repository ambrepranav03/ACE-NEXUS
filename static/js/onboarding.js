const chips = document.querySelectorAll(".selection-chip");

chips.forEach((chip) => {
    chip.addEventListener("click", () => {
        chip.classList.toggle("selected");
    });
});


/* =========================
   SAVE ONBOARDING DATA
========================= */

const continueButton = document.querySelector(".continue-button");

if (continueButton) {

    continueButton.addEventListener("click", () => {

        const selectedChips =
            document.querySelectorAll(".selection-chip.selected");

        const selections = [];

        selectedChips.forEach((chip) => {
            selections.push(chip.textContent.trim());
        });


        /* Detect which onboarding page we're on */

        const currentPage = window.location.pathname;


        if (currentPage.includes("onboarding2")) {

            localStorage.setItem(
                "aceSkills",
                JSON.stringify(selections)
            );

        }

        else if (currentPage.includes("onboarding3")) {

            localStorage.setItem(
                "aceGoals",
                JSON.stringify(selections)
            );

        }

    });

}