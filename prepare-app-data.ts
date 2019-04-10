var fs = require("fs");

import BASE from "./scrapping/base";

const orderTableKey = "1oPjlu-9lAbADfbvpXnYJBqE5gDxuXWapq0k86jSj65g";
const statusTableKey = "1jokkKYu6tYHyAaW0Svl0FQUxRp5pWQjujlnilVUwCNY";

// moving orders table
const ordersJSON = [];
BASE.readSpreadsheet(orderTableKey, rows => {
  rows.forEach(row => {
    delete row["_xml"];
    delete row["_links"];
    ordersJSON.push(row);
  });

  fs.writeFile(
    "./app/data/orders.json",
    JSON.stringify(ordersJSON, null, 2),
    () => {}
  );
});

// moving statuses table
const statusesJSON = [];
BASE.readSpreadsheet(statusTableKey, rows => {
  rows.forEach(row => {
    delete row["_xml"];
    delete row["_links"];
    statusesJSON.push(row);
  });

  fs.writeFile(
    "./app/data/statuses.json",
    JSON.stringify(statusesJSON, null, 2),
    () => {}
  );
});

fs.copyFile(
  "./scrapping/data/monasteries_processed.json",
  "./app/data/monasteries.json",
  () => {}
);
