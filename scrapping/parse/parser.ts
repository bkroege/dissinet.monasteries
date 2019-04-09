var request = require("request");
var cheerio = require("cheerio");
var async = require("async");
import BASE from "./../base";

import { Monastery } from "./monastery";

export class Parser {
  trackingTimeout = 1000;

  meta: any = {};
  store = false;
  monasteries = [];

  resolve;

  next: Function = () => {};

  constructor(store, meta, next: Function) {
    this.store = store;
    this.meta = meta;
    this.next = next;
  }

  parse(resolve) {
    this.resolve = resolve;

    this.initialiseRecords(() => {
      this.startTracking();
      async.eachLimit(
        this.monasteries,
        50,
        this.parseMonastery.bind(this),
        () => {}
      );
    });
  }

  // will be extended
  parseMonastery(monastery, next) {
    // parsing monastery html to monastery data
    monastery.finishParsing();
    monastery.save(this.store);
    next();
  }

  addMonastery(monasteryHtml) {
    this.monasteries.push(new Monastery(this.meta, monasteryHtml));
  }

  initialiseRecords(next) {
    next([]);
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
        this.resolve();
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
      this.meta.id + ": " + parsed + " / " + all + " [" + percents + "%]";

    console.log(reportText);
  }
}
