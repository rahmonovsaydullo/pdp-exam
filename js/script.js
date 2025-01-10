// Select elements from HTML
const loginInp = document.getElementById("login-input");
const loginBtn = document.querySelector("button");

loginBtn.addEventListener("click", () => {
  const userName = loginInp.value.trim();
  // Checks the input, if it
  if (!userName) {
    alert("Enter username");
    return;
  }

  localStorage.setItem("name", userName);

  axios
    .get(`https://677cdbc74496848554c7efdb.mockapi.io/api/v1/users`)
    .then((res) => {
      const users = res.data;

      if (!users.some((user) => user.name == localStorage.getItem("name"))) {
        axios.post(`https://677cdbc74496848554c7efdb.mockapi.io/api/v1/users`, {
          name: localStorage.getItem("name"),
          score: 0,
        });
        console.log(1);

        console.log("This user exist");
        return;
      } else {
        axios.post(`https://677cdbc74496848554c7efdb.mockapi.io/api/v1/users`, {
          name: localStorage.getItem("name"),
          score: 0,
        });
      }
    })
    .then(() => {
      setTimeout(() => {
        window.location.href = `./main/main.html`;
      }, 500);
    })
    .catch((err) => {
      console.log(err);
    });

  loginInp.value = ""; // Clear the input
});
