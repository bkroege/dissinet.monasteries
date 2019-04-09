var fs = require("fs");

import BASE from "./scrapping/base";

const orderTableKey = "1oPjlu-9lAbADfbvpXnYJBqE5gDxuXWapq0k86jSj65g";

const ordersJSON = [];
BASE.readSpreadsheet(orderTableKey, orderRows => {
  orderRows.forEach(orderRow => {
    delete orderRow["_xml"];
    delete orderRow["_links"];
    ordersJSON.push(orderRow);
  });

  console.log(ordersJSON);

  fs.writeFile(
    "./app/data/orders.json",
    JSON.stringify(ordersJSON, null, 2),
    () => {}
  );
});

fs.copyFile(
  "./scrapping/data/monasteries_validated.json",
  "./app/data/monasteries.json",
  () => {}
);
