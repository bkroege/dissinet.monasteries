var Base: any = {
  generateUuid: (): string => {
    const now = new Date();
    return (
      now.valueOf() +
      "-" +
      Math.random()
        .toString(36)
        .substring(7)
    );
  },
  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },
  cleanCoordinates: coord => {
    return parseFloat(parseFloat(coord).toFixed(4));
  },
  cleanText: (
    text,
    rules = {
      trim: true,
      chars: ["\n", ":", "[", "("]
    }
  ) => {
    let newText = text;
    if (text) {
      if (rules.chars && rules.chars.length) {
        rules.chars.forEach(char => {
          newText.split(char)[0];
        });
      }

      if (rules["trim"]) {
        newText.trim();
      }
    }

    return newText;
  },

  splitColumn: (html, $) => {
    const htmlArray = html.split("<br>");
    return htmlArray.map(line => {
      const wrapped = "<span>" + line + "</span>";
      return $(wrapped).text();
    });
  }
};

export default Base;
