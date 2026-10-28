const die1 = document.getElementById("die1");
const die2 = document.getElementById("die2");

const result = document.getElementById("result");
const totalText = document.getElementById("total");
const historyList = document.getElementById("history");

const rollOneButton = document.getElementById("rollOne");
const rollTwoButton = document.getElementById("rollTwo");
const clearButton = document.getElementById("clearHistory");

const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

let rolling = false;

// Generate a random number between 1 and 6.
function randomDie() {
    return Math.floor(Math.random() * 6) + 1;
}

// Display the correct dice symbol.
function showFace(die, number) {
    die.textContent = diceFaces[number - 1];
    die.setAttribute("aria-label", "Dice showing " + number);
}

// Add a result to the recent-roll history.
function updateHistory(numbers) {
    const entry = document.createElement("li");

    const sum = numbers.reduce(
        (total, number) => total + number,
        0
    );

    const rollDetails = document.createElement("span");
    rollDetails.textContent = numbers.join(" + ");

    const totalDetails = document.createElement("strong");
    totalDetails.textContent = "= " + sum;

    entry.append(rollDetails, totalDetails);

    // Remove the initial placeholder when the first roll happens.
    const placeholder = historyList.querySelector(".empty-history");

    if (placeholder) {
        placeholder.remove();
    }

    historyList.prepend(entry);

    // Keep only the latest 10 rolls.
    while (historyList.children.length > 10) {
        historyList.lastElementChild.remove();
    }
}

// Roll either one die or two dice.
function rollDice(numberOfDice) {
    if (rolling) {
        return;
    }

    rolling = true;

    rollOneButton.disabled = true;
    rollTwoButton.disabled = true;

    // Hide the second die when rolling only one.
    die2.classList.toggle("hidden", numberOfDice === 1);

    result.textContent = "Rolling...";
    totalText.textContent = "TOTAL: ...";

    die1.classList.add("rolling");

    if (numberOfDice === 2) {
        die2.classList.add("rolling");
    }

    // Show changing faces during the animation.
    const animation = setInterval(() => {
        showFace(die1, randomDie());

        if (numberOfDice === 2) {
            showFace(die2, randomDie());
        }
    }, 100);

    // Stop the animation and show the final result.
    setTimeout(() => {
        clearInterval(animation);

        die1.classList.remove("rolling");
        die2.classList.remove("rolling");

        const numbers = [];

        for (let i = 0; i < numberOfDice; i++) {
            numbers.push(randomDie());
        }

        showFace(die1, numbers[0]);

        if (numberOfDice === 2) {
            showFace(die2, numbers[1]);
        }

        const sum = numbers.reduce(
            (total, number) => total + number,
            0
        );

        result.textContent = "You rolled " + numbers.join(" and ");
        totalText.textContent = "TOTAL: " + sum;

        updateHistory(numbers);

        rolling = false;

        rollOneButton.disabled = false;
        rollTwoButton.disabled = false;
    }, 800);
}

// Connect the buttons to the game.
rollOneButton.addEventListener("click", () => {
    rollDice(1);
});

rollTwoButton.addEventListener("click", () => {
    rollDice(2);
});

// Clear the recent-roll history.
clearButton.addEventListener("click", () => {
    if (rolling) {
        return;
    }

    historyList.innerHTML =
        '<li class="empty-history">Your next roll starts a new history!</li>';
});
