import React, { useEffect, useState } from 'react';
import SlidingTopInfo, { AlertType } from '../../components/SlidingTopInfo';
import { useAppSelector } from '../../state/redux/hooks';
import { FrameLoadingStatus } from '../../state/redux/types';

function statusToTypeAndText(frameLoadingStatus: FrameLoadingStatus): {
  type: AlertType;
  text: string;
} {
  switch (frameLoadingStatus) {
    case 'failed':
      return { type: 'error', text: 'Frame loading failed' };
    case 'loaded':
      return { type: 'success', text: 'Frame loading completed' };
    case 'loading':
      return {
        type: 'warning',
        text: 'Frametime is being processed. This may take some time...',
      };
    default:
      return { type: 'error', text: '' };
  }
}

export default function FrameLoadingAlert() {
  const [infoIsOpen, setInfoIsOpen] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [alertType, setAlertType] = useState<AlertType>('error');
  const frameLoadingStatus = useAppSelector(
    state => state.video.frameLoadingStatus
  );
  useEffect(() => {
    const result = statusToTypeAndText(frameLoadingStatus);
    if (result.text !== '') {
      setText(result.text);
      setAlertType(result.type);
      setInfoIsOpen(true);      
    }
  }, [frameLoadingStatus]);

  return (
    <SlidingTopInfo
      type={alertType}
      text={text}
      isOpen={infoIsOpen}
      setIsOpen={setInfoIsOpen}
    />
  );
}
