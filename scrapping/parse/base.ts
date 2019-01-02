var Base: any = {
  generateUuid: (): number => {
    const now = new Date();
    return now.valueOf();
  },
  cleanCoordinates: coord => {
    return parseFloat(parseFloat(coord).toFixed(4));
  },
  cleanText: (text, rules) => {
    let newText = text;
    if (rules.chars && rules.chars.length) {
      rules.chars.forEach(char => {
        newText.split(char)[0];
      });
    }

    if (rules["trim"]) {
      newText.trim();
    }

    return newText
      .split("[")[0]
      .split("(")[0]
      .split("\n")[0]
      .trim();
  }
};

export default Base;
