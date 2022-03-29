export type PoolDistance = '25m' | '50m';
export type RaceDistance = '50m' | '100m' | '200m' | '400m' | '800m' | '1500m';

export function strToPoolDistance(s:string): PoolDistance {
  switch (s) {
    case('20'):
    case('25m'): {
      return '25m'
    }
    case('50'):
    case('50m'): {
      return '50m';
    }
    default: 
      return '50m';
  }
}

export function strToRaceDistance(s:string): RaceDistance {
  switch (s) {
    case '50':
    case '50m': {
      return '50m';
    }
    case '100':
    case '100m': {
      return '100m';
    }
    case '200':
    case '200m': {
      return '200m';
    }
    case '400':
    case '400m': {
      return '400m';
    }
    case '800':
    case '800m': {
      return '800m';
    }
    case '1500':
    case '1500m': {
      return '1500m';
    }
    default:
      return '100m';
  }
}

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
    case 800: {
      return '800m';
    }
    case 1500: {
      return '1500m';
    }
    default:
      return '100m';
  }
}
