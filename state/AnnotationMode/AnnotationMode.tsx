import { StrokeRange } from "../AKB/StrokeCounts";

// export class AnnotationMode {
//   name: string;
//   checkpointNames: NameDistance[];
//   strokeRanges: StrokeRange[];
//   constructor(n: string, checkpointNames: NameDistance[], strokeRanges: StrokeRange[]) {
//     this.name = n;
//     this.checkpointNames = checkpointNames;
//     this.strokeRanges = strokeRanges;
//   }

//   public toString = () => this.name;
// }

export interface Checkpoint {
  name: string;
  distanceMeter: number;
}

export type AnnotationMode = {
  name: string;
  checkpoints: Checkpoint[];
  strokeRanges: StrokeRange[];
}