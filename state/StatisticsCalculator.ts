import { AnnotationInformation, Annotations } from './AKB';
import { StrokeCounts, StrokeRange } from './AKB/StrokeCounts';

// Time(s) at Distance(m)
export interface TimeDistStatistic {
  time: number;
  distance: number;
}

/**
 * Gives a sorted (ascending order) of time distance statistics.
 */
function getTimeAtDistance(annotations: Annotations): Array<TimeDistStatistic> {
  const timeDistStatistics: Array<TimeDistStatistic> = [];
  for (const [key, value] of Object.entries(annotations)) {
    console.log(`getTimeAtDistance: annotations[${key}] = ${value}`);
    timeDistStatistics.push({ time: value / 1000, distance: parseInt(key) });
  }
  timeDistStatistics.sort((a, b) => a.distance - b.distance);
  return timeDistStatistics;
}

// metres per second
export interface VelocityAtRangeStatistic {
  startRange: number;
  endRange: number;
  velocity: number;
}

/**
 * Computes the average velocities between adjacent time points.
 */
function computeAverageVelocities(
  timeDistStatistics: Array<TimeDistStatistic>
): Array<VelocityAtRangeStatistic> {
  if (timeDistStatistics.length < 2) {
    return [];
  }
  const velocities = [];
  // find velocity between each adjacent pair of time distance
  for (let i = 0; i + 1 < timeDistStatistics.length; i++) {
    const td1 = timeDistStatistics[i];
    const td2 = timeDistStatistics[i + 1];
    const distTravelled = td2.distance - td1.distance;
    const timeTaken = td2.time - td1.time;
    console.log(
      `computeAverageVelocities: velocity at ${td1.distance}m-${
        td2.distance
      }m is ${distTravelled / timeTaken}m/s`
    );
    velocities.push({
      startRange: td1.distance,
      endRange: td2.distance,
      velocity: distTravelled / timeTaken,
    });
  }
  return velocities;
}

// strokeRate: strokes per minute
export interface StrokeRateStatistic {
  startRange: number;
  endRange: number;
  strokeRate: number;
}

function computeStrokeRate(
  strokeCounts: StrokeCounts
): Array<StrokeRateStatistic> {
  const strokeRates: Array<StrokeRateStatistic> = [];
  for (const [key, scWithTime] of Object.entries(strokeCounts)) {
    const strokeRange = StrokeRange.fromString(key);
    // converted to minutes
    const timeTaken = (scWithTime.endTime - scWithTime.startTime) / 60000;
    if (timeTaken === 0 || strokeRange.startRange === strokeRange.endRange) {
      continue;
    }
    console.log(
      `computeStrokeRate: ${strokeRange.toString()} ${
        scWithTime.strokeCount / timeTaken
      } strokes/min`
    );
    strokeRates.push({
      startRange: strokeRange.startRange,
      endRange: strokeRange.endRange,
      strokeRate: scWithTime.strokeCount / timeTaken,
    });
  }
  return strokeRates;
}

export interface StrokeCountStatistic {
  startRange: number;
  endRange: number;
  strokeCount: number;
}

function computeStrokeCounts(
  annotations: Annotations,
  strokeRates: Array<StrokeRateStatistic>
): Array<StrokeCountStatistic> {
  const strokeCounts: Array<StrokeCountStatistic> = [];
  strokeRates.forEach(sr => {
    const { startRange, endRange, strokeRate } = sr;
    if (startRange in annotations && endRange in annotations) {
      // convert to minutes
      const timeTaken =
        (annotations[endRange] - annotations[startRange]) / 60000;
      if (timeTaken === 0) {
        return;
      }
      console.log(
        `computeStrokeCount: ${startRange}m-${endRange}m is ${
          strokeRate * timeTaken
        } `
      );
      strokeCounts.push({
        startRange: startRange,
        endRange: endRange,
        strokeCount: strokeRate * timeTaken,
      });
    }
  });
  return strokeCounts;
}

// Distance(m) per stroke
export interface DPSStatistic {
  startRange: number;
  endRange: number;
  distancePerStroke: number;
}

function computeDPS(
  strokeCounts: Array<StrokeCountStatistic>
): Array<DPSStatistic> {
  const dps: Array<DPSStatistic> = [];
  strokeCounts.forEach(sc => {
    const { startRange, endRange, strokeCount } = sc;
    if (startRange === endRange) {
      return;
    }
    console.log(
      `computeDPS: ${startRange}m-${endRange}m is ${
        (endRange - startRange) / strokeCount
      } `
    );
    dps.push({
      startRange: startRange,
      endRange: endRange,
      distancePerStroke: (endRange - startRange) / strokeCount,
    });
  });
  return dps;
}

export interface ComputedResult {
  timeAndDistances: Array<TimeDistStatistic>;
  strokeCounts: Array<StrokeCountStatistic>;
  strokeRates: Array<StrokeRateStatistic>;
  averageVelocities: Array<VelocityAtRangeStatistic>;
  distancePerStroke: Array<DPSStatistic>;
}

export function computeResult(
  annotationsInfo: AnnotationInformation
): ComputedResult {
  const { annotations, strokeCounts } = annotationsInfo;
  if (
    Object.entries(annotations).length === 0 ||
    Object.entries(strokeCounts).length === 0
  ) {
    return {
      timeAndDistances: [],
      strokeCounts: [],
      strokeRates: [],
      averageVelocities: [],
      distancePerStroke: [],
    };
  }
  const timeDists = getTimeAtDistance(annotations);
  const velocities = computeAverageVelocities(timeDists);
  const sr = computeStrokeRate(strokeCounts);
  const scAtRange = computeStrokeCounts(annotations, sr);
  const dps = computeDPS(scAtRange);
  return {
    timeAndDistances: timeDists,
    strokeCounts: scAtRange,
    strokeRates: sr,
    averageVelocities: velocities,
    distancePerStroke: dps,
  };
}
