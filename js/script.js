const main = document.getElementById("main");
const nextCountryBtn = document.getElementById("next-country");






let timeValue = 20;
let questionIndex = 0;
let questionNumber = 1;
let userScore = 0;

const fetchCountries = async () => {
  try {
    const response = await axios.get(
      `https://restcountries.com/v3.1/all?limit=10`
    );
    const resData = response.data;

    // Clear previous question
    main.innerHTML = "";
    const randomIndex = Math.floor(Math.random() * resData.length);
    const randomCountry = resData[randomIndex];

    // Correct answer
    const correctAnswer = randomCountry.capital?.[0];
    const options = [correctAnswer];

    // Add another 3 incorrect answers
    while (options.length < 4) {
      const randomOptionIndex = Math.floor(Math.random() * resData.length);
      const randomOptionCountry = resData[randomOptionIndex];
      const randomOptionCapital = randomOptionCountry.capital?.[0];
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
    `;

    // Add event listeners to options
    const optionElements = document.querySelectorAll(".option");
    optionElements.forEach((option) => {
      option.addEventListener("click", () => {
        // Remove any existing styles
        optionElements.forEach((opt) =>
          opt.classList.remove("correct", "incorrect")
        );

        // Check the selected answer
        if (option.textContent.trim() === correctAnswer) {
          option.classList.add("correct");
        } else {
          option.classList.add("incorrect");

          // Highlight the correct answer
          optionElements.forEach((opt) => {
            if (opt.textContent.trim() === correctAnswer) {
              opt.classList.add("correct");
            }
          });
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
};




function startQuiz(){
  
}
// Fetch a new country on button click
nextCountryBtn.addEventListener("click", () => {
  fetchCountries();
});

const userName = document.getElementById("login-input");
const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", () => {
  fetchCountries();
});
