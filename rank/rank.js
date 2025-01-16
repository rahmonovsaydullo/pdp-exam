// Select elements from HTML
const main = document.querySelector("main");
const tableBody = document.querySelector("tbody");

axios
  .get(`https://678937632c874e66b7d803d1.mockapi.io/api/v1/users`)
  .then((res) => {
    const resData = res.data;
    // Sort score via descending
    const sortedPlayers = resData.sort((a,b) =>  b.score -  a.score)
    console.log(sortedPlayers);
    // Insert datas to table
    const tableRows = sortedPlayers.map((data, index) => 
      `
          <tr>
            <td>${index + 1}</td>
              <td>${data.name}</td>
              <td>${data.score}</td>
          </tr>`
    ).join("")
      tableBody.innerHTML = tableRows

  });
