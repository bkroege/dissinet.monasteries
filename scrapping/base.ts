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
  },

  prepareDate: value => {
    const date = {
      from: { post: false, ante: false },
      to: { post: false, ante: false }
    };
    if (value.indexOf("-")) {
      date.from = this.timeTranslate(value.split("-")[0]);
      date.to = this.timeTranslate(value.split("-")[1]);
    } else {
      const translated = this.timeTranslate(value);
      date.from.post = translated.post;
      date.to.ante = translated.ante;
    }

    return date;
  },

  timeTranslate: (v): { ante; post } => {
    if (v && parseInt(v.trim(), 10) == v.trim()) {
      return { post: v, ante: v };
    }
    const dictionary = {
      vers: { post: v, ante: false },
      "v.": { post: v, ante: false },
      puis: { ante: v, post: false },
      début: { post: v, ante: false },
      Révolution: { ante: 1789, post: false },
      "Ve s": { post: 401, ante: 500 },
      "VIe s": { post: 501, ante: 600 },
      "VIIe s": { post: 601, ante: 700 },
      "VIIIe s": { post: 701, ante: 800 },
      "IXe s": { post: 801, ante: 900 },
      "Xe s": { post: 901, ante: 1000 },
      "XIe s": { post: 1001, ante: 1100 },
      "XIIe s": { post: 1101, ante: 1200 },
      "XIIIe s": { post: 1201, ante: 1300 }
    };

    Object.keys(dictionary).forEach(key => {
      if (v.includes(key)) {
        return dictionary[key];
      }
    });

    return { post: false, ante: false };
  }
};

export default Base;
