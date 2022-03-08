import { CameraDeviceFormat } from 'react-native-vision-camera';

export type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

/**
 * Returns i such that 0 ≤ i ≤ array.length and
 * the given predicate is false for array[i - 1]
 * and true for array[i].
 * If the predicate is false everywhere, array.length is returned.
 */
export function binarySearch<T>(array: T[], pred: (a: T) => boolean) {
  let lo = -1,
    hi = array.length;
  while (1 + lo < hi) {
    const mi = lo + ((hi - lo) >> 1);
    if (pred(array[mi])) {
      hi = mi;
    } else {
      lo = mi;
    }
  }
  return hi;
}

export function isNotNullNotUndefined(anything: any) {
  return anything !== undefined && anything !== null;
}

export function isNullOrUndefined(anything: any) {
  return anything === undefined || anything === null;
}

export function compareMaps<K, V>(map1: Map<K, V>, map2: Map<K, V>) {
  var testVal;
  if (map1.size !== map2.size) {
    return false;
  }
  for (var [key, val] of map1) {
    testVal = map2.get(key);
    // in cases of an undefined value, make sure the key
    // actually exists on the object so there are no false positives
    if (testVal !== val || (testVal === undefined && !map2.has(key))) {
      return false;
    }
  }
  return true;
}

/**
 * This is meant to replicate the behaviour for map.
 * But somehow, [T1, G][].map => [T2, G][][].
 * Instead, this function take [T1, G][] and returns [T2, G][].
 * @param nestedArr [T1, G][]
 * @param fn function for T1 => T2
 * @returns [T2, G][]
 */
export function nestedArrayMap<T1, T2, G>(
  nestedArr: Array<[T1, G]>,
  fn: (t1: T1) => T2
) {
  const prepareArg: Array<[T2, G]> = [];
  nestedArr.forEach(e => prepareArg.push([fn(e[0]), e[1]]));
  return prepareArg;
}

/**
 * Converts an array of number to string
 * by joining with '-'
 * @param nums Array of number
 */
export function numbersToStringRange(nums: Array<number>) {
  //console.log(`numbersToStringRange, args: ${nums}`);
  return nums.map(e => e.toString()).join('-');
}

function pad(pad: string, num: number, padLeft: boolean) {
  if (padLeft) {
    return (pad + num).slice(-pad.length);
  } else {
    return (num + pad).substring(0, pad.length);
  }
}

export function formatTimeFromPosition(position: number, ignoreMillis = false): string {
  const millis = Math.floor(position % 1000);
  const seconds = Math.floor((position % 60000) / 1000);
  const mins = Math.floor(position / 60000);
  if (ignoreMillis) {
    return `${mins}:${pad('00', seconds, true)}`;
  }
  return `${mins}:${pad('00', seconds, true)}.${pad('000', millis, true)}`;
}

export function formatTimeFromPositionSeconds(position: number): string {
  return formatTimeFromPosition(position * 1000);
}

export function getMaxFps(format: CameraDeviceFormat): number {
  return format.frameRateRanges.reduce((prev, curr) => {
    if (curr.maxFrameRate > prev) return curr.maxFrameRate;
    else return prev;
  }, 0);
}

export function shortenText(text: string, charsAmount = 6) {
  if (text.length > charsAmount * 2) {
    const firstPart = text.substring(0, charsAmount);
    const lastPart = text.substring(text.length - charsAmount, text.length);
    return `${firstPart}...${lastPart}`;
  }
  return text;
}
