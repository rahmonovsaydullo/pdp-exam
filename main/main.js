// Select elements from HTML
const main = document.getElementById("main");
const startQuizBtn = document.getElementById("start-quiz");
const userName = document.getElementById("login-input");
const loginBtn = document.getElementById("login-btn");
const header = document.querySelector("header");

let time = 15; // Time duration
let questionIndex = 1; // Track the current question
let questionNumber = 1; // Track the question number
let userScore = 0; // User score
let timerInterval; // Timer interval
let optionList; // Options listf
let totalQuestions = 10; // Total number of questions
let numberOfQuestion = totalQuestions;

// Fetch all countries
const fetchCountries = async () => {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/all`);
    const resData = response.data;
    // Check question if run out of question next function will be work
    if (totalQuestions <= 0) {
      results();
      displayResult();
      header.classList.remove("hide");

      return;
    }
    totalQuestions--;

    // Clear previous question
    main.innerHTML = "";
    clearInterval(timerInterval);
    // Get random country
    const randomIndex = Math.floor(Math.random() * resData.length);
    const randomCountry = resData[randomIndex];

    // Define correct answer
    const correctAnswer = randomCountry.capital?.[0];
    const options = [correctAnswer];

    // Add another 3 incorrect answers
    while (options.length < 4) {
      const randomOptionIndex = Math.floor(Math.random() * resData.length);
      const randomOptionCapital = resData[randomOptionIndex].capital?.[0];
      if (randomOptionCapital && !options.includes(randomOptionCapital)) {
        options.push(randomOptionCapital);
      }
    }

    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    // Create the question and options
    main.innerHTML += `
      <div class='number-of-question'>Question ${questionIndex++} of 10</div>

        <div class='box'>
            <img class='country-flag' src="${
              randomCountry.flags.svg || randomCountry.flags.png
            }" alt="The flag of ${randomCountry.name.official}">
            <div>
                <div class="question-of-country">What is the capital of ${
                  randomCountry.name.official
                }?</div>
                <div class='capital-options'>
                    ${options
                      .map((option) => `<div class="option ">${option}</div>`)
                      .join("")}
                </div>
            </div>
        </div>
        <div class="timer"><span id="timer-icon">⏳</span> <span id="timer">${time}</span> seconds</div>
    `;
    optionList = options;

    // Remove styles from options for next question
    const optionElements = document.querySelectorAll(".option");
    optionElements.forEach((option) => {
      option.addEventListener("click", () => {
        clearInterval(timerInterval);
        optionElements.forEach((opt) =>
          opt.classList.remove("correct", "incorrect")
        );

        // Check the selected answer
        if (option.textContent.trim() === correctAnswer) {
          option.classList.add("correct");
          userScore++;
          localStorage.setItem("userScore", userScore);
        } else {
          option.classList.add("incorrect");

          // Show the correct answer
          optionElements.forEach((opt) => {
            if (opt.textContent.trim() === correctAnswer) {
              opt.classList.add("correct");
            }
          });
        }
        setTimeout(fetchCountries, 1000);
      });
    });

    startTimer(correctAnswer, optionElements);
  } catch (error) {
    main.innerHTML = `<p>Failed to load data</p>`;
  }
};
// Start the timer
const startTimer = (correctAnswer, optionElements) => {
  let timeLeft = time;
  const timerDisplay = document.getElementById("timer");
  timerDisplay.innerText = timeLeft;

  const updateTimer = () => {
    timerDisplay.innerText = timeLeft < 10 ? `0${timeLeft}` : timeLeft;
  };

  updateTimer();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      updateTimer();
      clearInterval(timerInterval);
      optionElements.forEach((option) => {
        if (option.textContent.trim() === correctAnswer) {
          option.classList.add("correct");
        }
      });

      setTimeout(fetchCountries, 3000);
    }
  }, 1000);
};

startQuizBtn.addEventListener("click", () => {
  fetchCountries();
  startQuizBtn.classList.add("hide");
  header.classList.add("hide");
});

let userFiltered;
const getName = () => {
  axios
    .get(`https://677cdbc74496848554c7efdb.mockapi.io/api/v1/users`)
    .then((res) => {
      const users = res.data;
      let userInfo = users.filter((user) => {
        return user.name === localStorage.getItem("name");
      });
      userFiltered = userInfo;
    })
    .catch((error) => {
      console.log(error);
    });
};

document.addEventListener("DOMContentLoaded", () => {
  getName();
});

//  Update results end of quiz
function results() {
  let previousBestScore = parseInt(userFiltered[0].score); // Get the user's previous best score
  console.log(previousBestScore, "old score");

  let recentScore = localStorage.getItem("userScore");
  console.log(recentScore, "new score");

  if (recentScore > previousBestScore) {
    axios
      .put(
        `https://677cdbc74496848554c7efdb.mockapi.io/api/v1/users/${userFiltered[0].id}`,
        {
          score: recentScore,
        }
      )
      .then(() => {
        displayResult(); // Display the updated results
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    displayResult(); // Display the results without updating the score
  }
}

// Display quiz results
function displayResult() {
  axios
    .get(
      `https://677cdbc74496848554c7efdb.mockapi.io/api/v1/users/${userFiltered[0].id}`
    )
    .then((res) => {
      const data = res.data;
      let higherScore;
      if (userScore >= 7) {
        higherScore = "Nobody can't stop you. 🥳🤩";
      } else if (userScore < 7 && userScore > 3) {
        higherScore = "Next time you can find all 🤓";
      } else if (userScore <= 3) {
        higherScore = "Did you know what is geography 🤥";
      }

      main.innerHTML = `
       <div class='result-section'>
       <p>Your best score is ${data.score}</p>
       <h3>🎉 Congratulations ${data.name} 🎉 </h3>
       <p>Your current score is ${userScore}</p>
       <h2>${higherScore}</h2>
       </div>

       <button class='btn-res' onclick='replayQuiz()'>Play again</button>
      `;
    });
}
// Play again question
function replayQuiz() {
  totalQuestions = numberOfQuestion;
  userScore = 0;
  questionIndex = 1;

  main.innerHTML = "";
  fetchCountries();
  header.classList.add("hide");
}



