const main = document.getElementById("main");
const startQuizBtn = document.getElementById("start-quiz");
const userName = document.getElementById("login-input");
const loginBtn = document.getElementById("login-btn");

let time = 15; // Timer duration
let questionIndex = 0; // Track the current question
let questionNumber = 1; // Track the question number
let userScore = 0; // User score
let timerInterval; // Timer interval
let optionList;
let totalQuestions = 10; // Total number of questions
let numberOfQuestion = totalQuestions;

const fetchCountries = async () => {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/all`);
    const resData = response.data;

    if (totalQuestions <= 0) {
      results();
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
            <img src="${randomCountry.flags.png}" alt="The flag of ${
      randomCountry.name.official
    }">
            <h4>${randomCountry.name.official}</h4>
            <div>
                <div>What is the capital of ${
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
    console.log(error);
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
      timeLeft < 10 ? timerDisplay.textContent + "0" : timerDisplay.textContent;
      clearInterval(timerInterval);
      optionElements.forEach((option) => {
        if (option.textContent.trim() === correctAnswer) {
          option.classList.add("correct");
        } else {
          option.classList.add("incorrect");
        }
      });

      setTimeout(fetchCountries, 1000);
    }
  }, 1000);
};

startQuizBtn.addEventListener("click", () => {
  fetchCountries();
  startQuizBtn.classList.add("hide");
});

function results() {
  const id = localStorage.getItem('userId')
  console.log(id);
  
  axios.put(`https://677cdbc74496848554c7efdb.mockapi.io/api/v1/users/${id}`, {
    score: localStorage.getItem("userScore"),
  });
}
