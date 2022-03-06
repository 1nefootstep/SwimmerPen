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

type PlayPauseAnimationProps = {
  icon: ReactElement,
  progress: SharedValue<boolean>;
};

export default function PlayPauseAnimation({
  icon,
  progress,
}: PlayPauseAnimationProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = progress.value
      ? withSequence(
          withTiming(0.5, { duration: 0 }),
          withTiming(0, { duration: 800 }, () => {
            progress.value = false;
          })
        )
      : 0;
    const s = interpolate(progress.value ? 1 : 0, [0, 1], [0.8, 1.3]);
    const scale = withTiming(s, { duration: 350 });
    return {
      opacity: opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[{ zIndex: 2, position: 'absolute' }, animatedStyle]}>
      {icon}
    </Animated.View>
  );
}
