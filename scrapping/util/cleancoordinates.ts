var cleanCoordinates = coord => {
  return parseFloat(parseFloat(coord).toFixed(4));
};

export default cleanCoordinates;
