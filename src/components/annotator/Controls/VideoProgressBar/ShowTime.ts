import { AppDispatch } from '../../../../state/redux';
import { hideTime, showTime } from '../../../../state/redux/actions';

let timeoutId: NodeJS.Timeout | null = null;

export function showTimeForDuration(
  dispatch: AppDispatch,
  duration: number = 1000
) {
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
    timeoutId = null;
  } else {
    dispatch(showTime());
  }
  timeoutId = setTimeout(() => {
    dispatch(hideTime());
    timeoutId = null;
  }, duration);
}
