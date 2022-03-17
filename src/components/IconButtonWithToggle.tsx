import React from 'react';

import { Button, Icon } from 'native-base';

export default function IconButtonWithToggle({
  isToggled,
  setIsToggled,
  isDisabled,
  as,
  iconWhenToggled,
  iconWhenUntoggled,
  colourWhenToggled,
  colourWhenUntoggled,
}: {
  isToggled: boolean;
  setIsToggled: React.Dispatch<React.SetStateAction<boolean>>;
  isDisabled?: boolean;
  as: any;
  iconWhenToggled: string;
  iconWhenUntoggled: string;
  colourWhenToggled?: string;
  colourWhenUntoggled?: string;
}) {
  const onPress = async () => {
    if (isToggled) {
      setIsToggled(false);
    } else {
      setIsToggled(true);
    }
    //console.log(isRecording);
  };

  return (
    <Button
      variant="unstyled"
      onPress={onPress}
      isDisabled={isDisabled}
      leftIcon={
        <Icon
          as={as}
          name={isToggled ? iconWhenToggled : iconWhenUntoggled}
          size={{ sm: '12', md: '12', lg: '16' }}
          color={isToggled ? colourWhenToggled : colourWhenUntoggled}
        />
      }
    />
  );
}
