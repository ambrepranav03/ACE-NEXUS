const chips = document.querySelectorAll(".selection-chip");

chips.forEach((chip) => {
    chip.addEventListener("click", () => {
        chip.classList.toggle("selected");
    });
});