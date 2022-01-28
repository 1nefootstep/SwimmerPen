import { AppDispatch } from "../../../../state/redux";
import { hideTime, showTime } from "../../../../state/redux/actions";

let timeoutId: NodeJS.Timeout | null = null;

export function showTimeForDuration(
  dispatch: AppDispatch,
  duration: number = 1000,
) {
  dispatch(showTime());
  const timeToHideTime = Date.now() + duration;
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
  }
  const id = setTimeout(() => {
    if (Date.now() > timeToHideTime) {
      dispatch(hideTime());
      // setWaitingForTimeout(false);
    } else {
      showTimeForDuration(dispatch, duration);
    }
    if (timeoutId !== null) {
      timeoutId = null;
    }
  }, duration);
  timeoutId = id;
}
