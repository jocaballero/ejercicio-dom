const url =
  "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";

fetch(url)
  .then((response) => response.json())
  .then((json) => {
    const table = document.querySelector(".event-table");
    //Array that will contain the mcc for each event.
    let mcc = [];
    //Array that will contain all the events.
    let eventList = [];
    //This appends a row to the table for each entry in the result of the fetch.
    for (i = 0; i < json.length; i++) {
      let node = document.createElement("tr");
      let entry = json[i];
      //This calculates the mcc for each event and store it in 'mcc'.
      for (let j = 0; j < entry.events.length; j++) {
        let event = entry.events[j];
        if (!eventList.includes(event)) {
          eventList.push(event);
          mcc.push([event, getMCC(confusionMatrix(event, json))]);
        }
      }
      //This checks if the value of squirrel is true to change the color of the row.
      if (json[i].squirrel) {
        node.innerHTML = `<th class="table-danger" scope="row">${i + 1}</th>
                        <td class="table-danger">${json[i].events}</td>
                        <td class="table-danger">${json[i].squirrel}</td>`;
      } else {
        node.innerHTML = `<th scope="row">${i + 1}</th>
                        <td>${json[i].events}</td>
                        <td>${json[i].squirrel}</td>`;
      }
      table.appendChild(node);
    }

    //This is a constant that contains sorted mcc for each event.
    const sortedMCC = mcc.sort((a, b) => b[1] - a[1]);

    //This is the table that will contain all mcc.
    const mccTable = document.querySelector(".mcc-table");

    for (let i = 0; i < sortedMCC.length; i++) {
      let node = document.createElement("tr");
      let entry = sortedMCC[i];
      node.innerHTML = `<th scope="row">${i + 1}</th>
                        <td>${entry[0]}</td>
                        <td>${entry[1]}</td>`;
      mccTable.appendChild(node);
    }

    console.log(sortedMCC);
  });

//This function returns the values for TP (true positives), TN (true negatives), FP (false positives), and FN (false negatives) for an event.
function confusionMatrix(event, json) {
  let table = [0, 0, 0, 0];
  for (let i = 0; i < json.length; i++) {
    let entry = json[i],
      index = 0;
    if (entry.events.includes(event)) index += 1;
    if (entry.squirrel) index += 2;
    table[index] += 1;
  }
  return table;
}

//This function returns the Matthews Correlation Coefficient based on the confusionMatrix
function getMCC(table) {
  let tn = table[0];
  let fn = table[1];
  let fp = table[2];
  let tp = table[3];
  let ans = (tp * tn - fp * fn) / Math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn));
  return ans;
}
