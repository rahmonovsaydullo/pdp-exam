
const loginInp = document.getElementById("login-input");
const loginBtn = document.querySelector("button");

const nextPage = () => {
  loginBtn.addEventListener("click", () => {
    const userName = loginInp.value.trim();

    if (!userName) {
      alert('Enter username')
      return;
    }

    localStorage.setItem("name", userName);

    axios
      .get(`https://677cdbc74496848554c7efdb.mockapi.io/api/v1/users`)
      .then((res) => {
        const users = res.data;

        if (users.length == 0) {
          axios.post(
            `https://677cdbc74496848554c7efdb.mockapi.io/api/v1/users`,
            {
              name: localStorage.getItem("name"),
             score: 0,
            }
          );
          console.log(1);
        } else if (
          users.some((user) => user.name === localStorage.getItem("name"))
        ) {
          console.log("This user exist");
          return;
        } else {
          axios.post(
            `https://677cdbc74496848554c7efdb.mockapi.io/api/v1/users`,
            {
              name: localStorage.getItem("name"),
            score: 0,
            }
          );
          console.log('Found');
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
};

nextPage();
