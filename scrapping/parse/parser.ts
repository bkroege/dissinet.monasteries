var request = require("request");
var cheerio = require("cheerio");

export class Parser {
  private trackingTimeout = 1000;

  private meta: any = {};
  private store = false;
  private monasteries = [];

  public next: Function = () => {};

  constructor(store, meta, next: Function) {
    this.meta = meta;
    this.store = store;
    this.next = next;
  }

  parse() {
    this.monasteries = this.initialiseRecords();
    this.monasteries.map(monastery => {
      this.parseMonastery(monastery);
    });
  }

  // will be extended
  parseMonastery(monastery) {
    return false;
  }

  initialiseRecords() {
    return [];
  }

  checkFinished(): boolean {
    return this.monasteries.every(m => m.saved);
  }

  startTracking(): void {
    this.track();
  }

  track(): void {
    setTimeout(() => {
      if (this.checkFinished()) {
        this.next();
      } else {
        this.report();
        this.track();
      }
    }, this.trackingTimeout);
  }

  report(): void {
    const all = this.monasteries.length;
    const parsed = this.monasteries.filter(m => m.saved).length;
    const percents = ((parsed / all) * 100).toFixed(3);

    const reportText =
      this.meta.id + ": " + parsed + " / " + all + " [" + percents + "]";

    console.log(reportText);
  }
}
