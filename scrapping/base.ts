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
      chars: ["\n", "\r", ":", "[", "("]
    }
  ) => {
    let newText = text;
    if (text) {
      if (rules.chars && rules.chars.length) {
        rules.chars.forEach(char => {
          newText.split(char)[0];
        });
      }

      if (rules.trim) {
        newText = newText.trim();
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

  prepareTime: rawValue => {
    const time: { from: { post; ante }; to: { post; ante }; note? } = {
      from: { post: false, ante: false },
      to: { post: false, ante: false }
    };

    const value = Base.cleanText(rawValue);

    if (value) {
      if (value.indexOf("-")) {
        const translatedFrom = Base.timeTranslate(value.split("-")[0]);
        const translatedTo = Base.timeTranslate(value.split("-")[1]);

        time.from = { post: translatedFrom.post, ante: translatedFrom.ante };
        time.to = { post: translatedTo.post, ante: translatedTo.ante };

        if (translatedFrom.note || translatedFrom.note) {
          time.note = value;
        }
      } else {
        const translated = Base.timeTranslate(value);
        time.from.post = translated.post;
        time.to.ante = translated.ante;

        if (translated.note) {
          time.note = value;
        }
      }
    }

    return time;
  },

  timeTranslate: (v): { ante; post; note? } => {
    if (v) {
      if (parseInt(v.trim(), 10) == v.trim()) {
        return { post: parseInt(v.trim(), 10), ante: parseInt(v.trim(), 10) };
      }

      const dictionary = {
        vers: { post: v, ante: false },
        "v.": { post: v, ante: false },
        puis: { ante: v, post: false },
        début: { post: v, ante: false },
        Révolution: { ante: 1789, post: false },
        Ve: { post: 401, ante: 500 },
        VIe: { post: 501, ante: 600 },
        VIIe: { post: 601, ante: 700 },
        VIIIe: { post: 701, ante: 800 },
        IXe: { post: 801, ante: 900 },
        Xe: { post: 901, ante: 1000 },
        XIe: { post: 1001, ante: 1100 },
        XIIe: { post: 1101, ante: 1200 },
        XIIIe: { post: 1201, ante: 1300 },
        "10. Jahrhundert": { post: 901, ante: 1000 },
        "11. Jahrhundert": { post: 1001, ante: 1100 },
        "12. Jahrhundert": { post: 1101, ante: 1200 },
        "13. Jahrhundert": { post: 1201, ante: 1300 },
        "14. Jahrhundert": { post: 1301, ante: 1400 },
        "15. Jahrhundert": { post: 1401, ante: 1500 },
        "16. Jahrhundert": { post: 1501, ante: 1600 },
        "17. Jahrhundert": { post: 1601, ante: 1700 }
      };

      const key = Object.keys(dictionary).find(key => v.includes(key));
      if (key) {
        return dictionary[key];
      }
    }

    return { post: false, ante: false, note: true };
  }
};

export default Base;
