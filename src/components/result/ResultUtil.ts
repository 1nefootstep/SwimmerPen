import {
  DPSStatistic,
  StrokeCountStatistic,
  StrokeRateStatistic,
  TimeDistStatistic,
  Turn,
  VelocityAtRangeStatistic,
} from '../../state/StatisticsCalculator';

export function tdDataToGeneral(
  nameAndTd: Array<{
    name: string;
    stats: Array<TimeDistStatistic>;
  }>
) {
  return nameAndTd.map(e => ({
    name: e.name,
    stats: e.stats.map(i => ({
      label: `${i.distance}m`,
      stat: i.time,
    })),
  }));
}

export function turnDataToGeneral(
  nameAndTd: Array<{
    name: string;
    stats: Array<Turn>;
  }>
) {
  return nameAndTd.map(e => ({
    name: e.name,
    stats: e.stats.map(i => ({
      label: `${i.startRange}m-${i.endRange}m`,
      stat: i.time,
    })),
  }));
}

export function velocityDataToGeneral(
  nameAndVelocities: Array<{
    name: string;
    stats: Array<VelocityAtRangeStatistic>;
  }>
) {
  return nameAndVelocities.map(e => ({
    name: e.name,
    stats: e.stats.map(i => ({
      label: `${i.startRange}m-${i.endRange}m`,
      // startRange: i.startRange,
      // endRange: i.endRange,
      stat: i.velocity,
    })),
  }));
}

export function scDataToGeneral(
  nameAndStrokeCounts: Array<{
    name: string;
    stats: Array<StrokeCountStatistic>;
  }>
) {
  return nameAndStrokeCounts.map(e => ({
    name: e.name,
    stats: e.stats.map(i => ({
      label: `${i.startRange}m-${i.endRange}m`,
      // startRange: i.startRange,
      // endRange: i.endRange,
      stat: i.strokeCount,
    })),
  }));
}

export function srDataToGeneral(
  nameAndStrokeRates: Array<{
    name: string;
    stats: Array<StrokeRateStatistic>;
  }>
) {
  return nameAndStrokeRates.map(e => ({
    name: e.name,
    stats: e.stats.map(i => ({
      label: `${i.startRange}m-${i.endRange}m`,
      // startRange: i.startRange,
      // endRange: i.endRange,
      stat: i.strokeRate,
    })),
  }));
}

export function dpsDataToGeneral(
  nameAndDps: Array<{
    name: string;
    stats: Array<DPSStatistic>;
  }>
) {
  return nameAndDps.map(e => ({
    name: e.name,
    stats: e.stats.map(i => ({
      label: `${i.startRange}m-${i.endRange}m`,
      // startRange: i.startRange,
      // endRange: i.endRange,
      stat: i.distancePerStroke,
    })),
  }));
}
