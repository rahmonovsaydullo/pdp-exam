const main = document.getElementById("main");
const startQuizBtn = document.getElementById("start-quiz");
const userName = document.getElementById("login-input");
const loginBtn = document.getElementById("login-btn");
const header = document.querySelector("header");

let time = 15; // Time duration
let questionIndex = 0; // Track the current question
let questionNumber = 1; // Track the question number
let userScore = 0; // User score
let timerInterval; // Timer interval
let optionList;
let totalQuestions = 2; // Total number of questions
// let numberOfQuestion = totalQuestions;

// Fetch all countries
const fetchCountries = async () => {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/all`);
    const resData = response.data;

    if (totalQuestions <= 0) {
      results();
      displayResult();
      header.classList.remove("hide");

      return;
    }
    totalQuestions--;

    console.log(totalQuestions);

    // Clear previous question
    main.innerHTML = "";
    clearInterval(timerInterval);

    const randomIndex = Math.floor(Math.random() * resData.length);
    const randomCountry = resData[randomIndex];

    // Correct answer
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
        <div class='box'>
            <img class='country-flag' src="${
              randomCountry.flags.png
            }" alt="The flag of ${randomCountry.name.official}">
            <h4 class="name-of-country">${randomCountry.name.official}</h4>
            <div>
                <div class="question-of-country">What is the capital of ${
                  randomCountry.name.official
                }?</div>
                <div class='capital-options'>
                    ${options
                      .map((option) => `<div class="option">${option}</div>`)
                      .join("")}
                </div>
            </div>
        </div>
        <div class="timer">⏳ <span id="timer">${time}</span> seconds</div>
    `;
    optionList = options;

    // Add event listeners to options
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

    // Start the timer
    startTimer(correctAnswer, optionElements);
  } catch (error) {
    main.innerHTML = `<p>Failed to load data</p>`;
  }
};

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

function results() {
  const name = localStorage.getItem("name");
  const userScore = localStorage.getItem("userScore");

  axios
    .get(
      `https://677cdbc74496848554c7efdb.mockapi.io/api/v1/users?name=${name}`
    )
    .then((res) => {
      console.log(res);

      console.log(res.data[0].score);

      if (res.data.length > 0) {
        const userId = res.data[0].id;
        localStorage.setItem("userIdRes", userId);

        if (res.data[0].score < userScore) {
          return axios.put(
            `https://677cdbc74496848554c7efdb.mockapi.io/api/v1/users/${userId}`,
            {
              score: userScore,
            }
          );
        } else return;
      } else console.log("Not found");
    });
}

function displayResult() {
  const userIdRes = localStorage.getItem("userIdRes");
  axios
    .get(
      `https://677cdbc74496848554c7efdb.mockapi.io/api/v1/users/${userIdRes}`
    )
    .then((res) => {
      const data = res.data;
      console.log(data);
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
       <p>Your score is ${userScore}</p>
       <h2>${higherScore}</h2>
       </div>

       <button class='btn-res' onclick='replayQuiz()'>Play again</button>
      `;
    });
}

function replayQuiz() {
  totalQuestions = numberOfQuestion;
  userScore = 0;
  localStorage.setItem("userScore", userScore);

  main.innerHTML = "";
  fetchCountries();
  header.classList.add("hide");
}
