import { FC, useRef, useEffect } from "react";
import { Animated } from "react-native";

import { BaseToast } from "./BaseToast";

import { ProgressLoading } from "@images/index";

const LoadingToast: FC<{ text: string }> = ({ text }) => {
  // Create an animated value
  const spinValue = useRef(new Animated.Value(0)).current;

  // Run the animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000, // Duration of one rotation
        useNativeDriver: true, // Use native driver for better performance
      })
    ).start();
  }, [spinValue]);

  // Map the animated value to an interpolation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"], // Rotate from 0 to 360 degrees
  });

  return (
    <BaseToast borderColor="$grey050">
      <BaseToast.Icon>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <ProgressLoading />
        </Animated.View>
      </BaseToast.Icon>
      <BaseToast.Text>{text}</BaseToast.Text>
    </BaseToast>
  );
};

export default LoadingToast;
