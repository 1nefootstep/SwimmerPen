import React, { ReactElement, useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  interpolate,
  withDelay,
  withTiming,
  SharedValue,
  withSequence,
} from 'react-native-reanimated';

type Props = {
  children: ReactElement;
  progress: SharedValue<boolean>;
};

export const AnimatedAppearance = ({ children, progress }: Props) => {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = progress.value
      ? withSequence(
          withTiming(1, { duration: 0 }),
          withTiming(0, { duration: 750 }, () => {
            progress.value = false;
          })
        )
      : 0;
    const s = interpolate(progress.value ? 1 : 0, [0, 1], [0.7, 1.2]);
    const scale = withTiming(s, { duration: 400 });
    return {
      opacity: opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[{ zIndex: 2, position: 'absolute' }, animatedStyle]}>
      {children}
    </Animated.View>
  );
};
