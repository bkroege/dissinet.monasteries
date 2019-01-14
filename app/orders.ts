var colors = [
  "#8dd3c7",
  "#ffffb3",
  "#bebada",
  "#fb8072",
  "#80b1d3",
  "#fdb462",
  "#b3de69",
  "#fccde5",
  "#d9d9d9",
  "#bc80bd",
  "#ccebc5",
  "#ffed6f"
];

var orders: any = [
  {
    name: "franciscan"
  },
  {
    name: "benedictines"
  },
  {
    name: "praemonstratensians"
  },
  {
    name: "cluniac"
  },
  {
    name: "dominican"
  },
  {
    name: "cisterciennes"
  },
  {
    name: "trappistes"
  },
  {
    name: "augustins"
  },
  {
    name: "collegiales"
  },
  {
    name: "others"
  },
  {
    name: "unknown"
  }
];
orders.forEach((o, io) => (o.color = colors[io]));

export default orders;
