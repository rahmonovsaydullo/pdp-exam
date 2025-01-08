const loginInp = document.getElementById("login-input");
const loginBtn = document.querySelector("button");

const nextPage = () => {
  loginBtn.addEventListener("click", () => {
    const userName = loginInp.value.trim();

    if (!userName) {
      return;
    }
    localStorage.setItem("name", userName);
    //   window.location.href = "../index.html";
   if( axios
    .post(`https://677cdbc74496848554c7efdb.mockapi.io/api/v1/users`, {
      name: userName,
      score: null,
    })
    .then((res) => {
      const userData = res.data;
      console.log(res.data.id);
      localStorage.setItem("userId", res.data.id);
      console.log(localStorage.getItem("userId"));
      
    })){

   }
  });

  loginInp.value = "";
};

nextPage();
