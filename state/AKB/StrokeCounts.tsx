import { compareMaps, isNullOrUndefined, nestedArrayMap, numbersToStringRange } from "../Util";
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

// export class StrokeCounts {
//   private strokeCounts: Map<string, StrokeCountWithTimes>;

//   constructor(arg: Array<[StrokeRange, StrokeCountWithTimes]>) {
//     // const prepareArg: Array<[string, StrokeCount]> = [];
//     // arg.forEach((e) => prepareArg.push([e[0].toString(), e[1]]));
//     const mapped = nestedArrayMap<StrokeRange, string, StrokeCountWithTimes>(
//       arg,
//       (sr: StrokeRange) => sr.toHashString()
//     );
//     this.strokeCounts = new Map(mapped);
//   }

//   static fromJSON(arg: Array<[string, StrokeCountWithTimes]>) {
//     const toStrokeRange: Array<[StrokeRange, StrokeCountWithTimes]> = [];
//     arg.forEach((e) =>
//       toStrokeRange.push([StrokeRange.fromHashString(e[0]), e[1]])
//     );
//     return new StrokeCounts(toStrokeRange);
//   }

//   toJSON() {
//     return Array.from(this.strokeCounts.entries());
//   }

//   entries = () =>
//     nestedArrayMap<string, StrokeRange, StrokeCountWithTimes>(
//       Array.from(this.strokeCounts.entries()),
//       (s: string) => StrokeRange.fromHashString(s)
//     );
//   values = () => this.strokeCounts.values();
//   keys = () =>
//     Array.from(this.strokeCounts.keys()).map((e) =>
//       StrokeRange.fromHashString(e)
//     );
//   set = (sr: StrokeRange, sc: StrokeCountWithTimes) => {
//     this.strokeCounts.set(sr.toHashString(), sc);
//   };
//   get = (sr: StrokeRange) => { 
//     if (isNullOrUndefined(sr)) {
//       return undefined;
//     }
//     return this.strokeCounts.get(sr.toHashString());
//   };
//   public toString = this.toJSON;

//   public equals = (other: StrokeCounts) => {
//     return compareMaps(this.strokeCounts, other.strokeCounts);
//   };
// }
