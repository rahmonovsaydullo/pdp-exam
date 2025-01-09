const main = document.querySelector("main");
const tableBody = document.querySelector("tbody");


axios
  .get(`https://677cdbc74496848554c7efdb.mockapi.io/api/v1/users`)
  .then((res) => {
    const resData = res.data;
    console.log(resData);
    resData.map((data, index) => {
      tableBody.innerHTML += `
          <tr>
            <td>${index + 1}</td>
              <td>${data.name}</td>
              <td>${data.score}</td>
          </tr>`;
    });
  });


