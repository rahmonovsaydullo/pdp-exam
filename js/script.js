const main = document.getElementById("main");
const nextCountryBtn = document.getElementById("next-country");

const fetchCountries = async () => {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/all`);
    const resData = response.data;
     main.innerHTML = ''
    const randomIndex = Math.floor(Math.random() * resData.length);
    const randomCountry = resData[randomIndex];
    main.innerHTML += `
        <div class='box'>
              <img src="${randomCountry.flags.png}" alt="country image">
              <h4>${randomCountry.name.official}</h4>
        </div>
        `;
  } catch (error) {
    console.log(error);
  }
};

nextCountryBtn.addEventListener("click", () => {
  fetchCountries();
});
