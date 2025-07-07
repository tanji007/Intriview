const result = JSON.parse(localStorage.getItem("intriviewResult"));
const table = document.getElementById("report-table");

if (result) {
  let i = 1;
  for (let question in result) {
    const answer = result[question];

    const row1 = document.createElement("tr");
    const row2 = document.createElement("tr");

    row1.innerHTML = `
  <td rowspan="2">${i}</td>
  <td class="que-label">Que</td>
  <td class="desc que-desc">${question}</td>
  <td rowspan="2">Pending</td>`;

    row2.innerHTML = `
  <td class="ans-label">Ans</td>
  <td class="desc ans-desc">${answer}</td>`;

    table.appendChild(row1);
    table.appendChild(row2);
    i++;
  }
} else {
  const row = document.createElement("tr");
  row.innerHTML = `<td colspan="4" style="text-align:center;">No data found. Please complete the interview first.</td>`;
  table.appendChild(row);
}
