import {
  DPSStatistic,
  StrokeCountStatistic,
  StrokeRateStatistic,
  VelocityAtRangeStatistic,
} from '../../state/StatisticsCalculator';

export function velocityDataToGeneral(
  nameAndVelocities: Array<{
    name: string;
    stats: Array<VelocityAtRangeStatistic>;
  }>
) {
  return nameAndVelocities.map(e => ({
    name: e.name,
    stats: e.stats.map(i => ({
      startRange: i.startRange,
      endRange: i.endRange,
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
      startRange: i.startRange,
      endRange: i.endRange,
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
      startRange: i.startRange,
      endRange: i.endRange,
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
      startRange: i.startRange,
      endRange: i.endRange,
      stat: i.distancePerStroke,
    })),
  }));
}
