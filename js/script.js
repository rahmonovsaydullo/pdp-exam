// Select elements from HTML
const loginInp = document.getElementById("login-input");
const loginBtn = document.querySelector("button");
const api = `https://678937632c874e66b7d803d1.mockapi.io/api/v1/users`

loginBtn.addEventListener("click", () => {
  const userName = loginInp.value.trim();
  // Checks the input, if it
  if (!userName) {
    alert("Enter username");
    return;
  }

  localStorage.setItem("name", userName);

  axios
    .get(api)
    .then((res) => {
      const users = res.data;

      if (!users.some((user) => user.name == localStorage.getItem("name"))) {
        axios.post(api, {
          name: localStorage.getItem("name"),
          score: 0,
        });
        console.log(1);

        console.log("This user no");
        // return;
      } else {
        // console.log('this working');
        
        // axios.post(`https://677cdbc74496848554c7efdb.mockapi.io/api/v1/users`, {
        //   // name: localStorage.getItem("name"),
        //   score: 0,
        // });

        console.log('User exist');
        
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
