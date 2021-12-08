export type PoolDistance = '25m' | '50m';
export type RaceDistance = '50m' | '100m' | '200m' | '400m';

export type PoolConfig = {
  poolDistance: PoolDistance;
  raceDistance: RaceDistance;
};

export function numberToPoolDistance(num: number): PoolDistance {
  switch (num) {
    case 25: {
      return '25m';
    }
    case 50: {
      return '50m';
    }
    default:
      return '50m';
  }
}

export function numberToRaceDistance(num: number): RaceDistance {
  switch (num) {
    case 50: {
      return '50m';
    }
    case 100: {
      return '100m';
    }
    case 200: {
      return '200m';
    }
    case 400: {
      return '400m';
    }
    default:
      return '100m';
  }
}
