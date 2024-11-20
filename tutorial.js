document.addEventListener("DOMContentLoaded", () => {
    const chineseButton = document.getElementById("chineseButton");
    const englishButton = document.getElementById("englishButton");
    const chineseText = document.querySelector("#tutorialText.chinese");
    const englishText = document.querySelector("#tutorialText.english");
    const closeTutorial = document.getElementById("closeTutorial");

    // Switch to Chinese
    chineseButton.addEventListener("click", () => {
        chineseText.classList.remove("hidden");
        englishText.classList.add("hidden");
        chineseButton.classList.add("active");
        englishButton.classList.remove("active");
    });

    // Switch to English
    englishButton.addEventListener("click", () => {
        englishText.classList.remove("hidden");
        chineseText.classList.add("hidden");
        englishButton.classList.add("active");
        chineseButton.classList.remove("active");
    });

    // Close the tutorial popup
    closeTutorial.addEventListener("click", () => {
        window.close();
    });
});
