import React from 'react';
import { useAppSelector } from '../../state/redux/hooks';
import IconButtonWithToggle from '../IconButtonWithToggle';
import { FontAwesome } from '@expo/vector-icons';

export default function MuteButton({
  isMute,
  setIsMute,
}: {
  isMute: boolean;
  setIsMute: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const isRecording = useAppSelector(state => state?.recording.isRecording);

  return (
    <IconButtonWithToggle
      isToggled={isMute}
      isDisabled={isRecording}
      setIsToggled={setIsMute}
      as={FontAwesome}
      iconWhenToggled="volume-off"
      iconWhenUntoggled="volume-up"
      colourWhenToggled="lime.700"
      colourWhenUntoggled="lime.300"
    />
  );
}
