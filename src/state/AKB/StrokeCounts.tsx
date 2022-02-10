import { Distance } from "./Annotations";

export interface StrokeCountWithTimes {
  strokeCount: number;
  startTime: number;
  endTime: number;
}

export type StrokeCounts = {
  [strokeRange: string]: StrokeCountWithTimes;
};

function ifNaNThen0(num: number) {
  if (isNaN(num)) {
    return 0;
  }
  return num;
}

export class StrokeRange {
  startRange: Distance;
  endRange: Distance;
  constructor(sr: Distance, er: Distance) {
    this.startRange = sr === NaN ? 0 : sr;
    this.endRange = er === NaN ? 0 : er;
  }

  /**
   * Constructs a StrokeRange with a string.
   * @param s string of the form 'SC [NUM]-[NUM]m'
   * @returns StrokeRange with the two nums. Returns StrokeRange(0,0) on any error
   */
  static fromString(s: string) {
    const parsed = /^SC (\d+)-(\d+)m$/.exec(s);
    if (parsed === null) {
      return new StrokeRange(0, 0);
    }
    let sr = ifNaNThen0(parseInt(parsed[1]));
    let er = ifNaNThen0(parseInt(parsed[2]));
    
    return new StrokeRange(sr, er);
  }

  toString() {
    return `SC ${this.startRange}-${this.endRange}m`;
  }
}
