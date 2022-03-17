import React from 'react';
import { useAppSelector } from '../../state/redux/hooks';
import { Button } from 'native-base';

export default function AiToggleButton({
  isToggled,
  setIsToggled,
}: {
  isToggled: boolean;
  setIsToggled: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const isRecording = useAppSelector(state => state?.recording.isRecording);
  const onPress = () => setIsToggled(!isToggled);

  return (
    <Button
      variant="subtle"
      isDisabled={isRecording}
      size="sm"
      w={[12, 16, 20, 32, 40]}
      onPress={onPress}
      colorScheme={isToggled ? 'tertiary' : 'secondary'}
    >
      {isToggled ? 'AI active' : 'AI inactive'}
    </Button>
  );
}
