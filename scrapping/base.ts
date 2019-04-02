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

  // manage input time values and prepare time object
  timeParse: (rawTime, opts = {}) => {
    const time = {
      from: { ante: false, post: false },
      to: { ante: false, post: false },
      notes: ""
    };
    if (rawTime.all) {
      const parsedPart = Base.timePartParse(rawTime.all, opts);
      time.from.post = parsedPart.post;
      time.to.ante = parsedPart.ante;
      time.notes += "| all: " + rawTime.all;
    }
    if (rawTime.from) {
      const parsedPart = Base.timePartParse(rawTime.from, opts);
      time.from.post = parsedPart.post;
      time.from.ante = parsedPart.ante;
      time.notes += "| from: " + rawTime.from;
    }
    if (rawTime.to) {
      const parsedPart = Base.timePartParse(rawTime.to, opts);
      time.to.post = parsedPart.post;
      time.to.ante = parsedPart.ante;
      time.notes += "| from: " + rawTime.to;
    }
    return time;
  },

  // parse one part of time value
  timePartParse: (rawTime, opts = {}) => {
    const timeValue = Base.cleanText(rawTime);

    // check if rawTime is just one point or a duration span
    const spanDelimiters = ["-", "–", " to "];
    let delimiter: string | boolean = false;
    spanDelimiters.forEach(d => {
      if (timeValue.includes(d)) {
        delimiter = d;
      }
    });

    if (delimiter) {
      // duration
      const values = timeValue.split(delimiter);
      const value1 = Base.timeValueTranslate(values[0], opts);
      const value2 = Base.timeValueTranslate(values[1], opts);

      return Base.timeValuesIntersect(value1, value2);
    } else {
      return Base.timeValueTranslate(timeValue, opts);
    }
  },

  // takes two time objects and returns one intersected object
  timeValuesIntersect(v1, v2) {
    return {
      post: v1.post,
      ante: v2.ante
    };
  },

  // translate time value into time object
  timeValueTranslate: (v, opts = {}): { ante; post; note? } => {
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
