import React, { useMemo } from "react";
import { motion, MotionProps } from "framer-motion";

export type AnimationEasing =
  | "sSoft"
  | "sMedium"
  | "sHard"
  | "expIn"
  | "expOut"
  | "expInOut";

export const Easing: { [key in AnimationEasing]: number[] } = {
  sHard: [0.95, 0, 0.5, 1],
  sMedium: [0.8, 0, 0.2, 1],
  sSoft: [0.6, 0, 0.4, 1],
  expIn: [0.9, 0.05, 1, 0.3],
  expOut: [0.05, 0.7, 0.1, 1],
  expInOut: [0.9, 0.05, 0.1, 1],
};

export interface AnimatedMountViewProps {
  styles?: React.CSSProperties;
  easing?: AnimationEasing;
  duration?: number;
  motionProps?: MotionProps;
  mountDirection?: "x" | "y" | "none";
  mountInitialOffset?: number;
  delay?: number;
  className?: string;
}

const AnimatedMountView: React.FC<AnimatedMountViewProps> = ({
  styles,
  easing,
  duration,
  motionProps,
  children,
  mountDirection,
  mountInitialOffset,
  delay,
  className,
}) => {
  const positionFinal = useMemo(() => {
    return mountDirection === "x"
      ? { x: 0 }
      : mountDirection === "none"
      ? {}
      : { y: 0 };
  }, [mountDirection]);

  const initialOffset = useMemo(() => {
    return mountInitialOffset || 16;
  }, [mountInitialOffset]);

  const positionInitial = useMemo(() => {
    return mountDirection === "x"
      ? { x: initialOffset }
      : mountDirection === "none"
      ? {}
      : { y: initialOffset };
  }, [initialOffset, mountDirection]);

  const divProps = useMemo(() => {
    return {
      animate: { ...positionFinal, opacity: 1 },
      initial: { ...positionInitial, opacity: 0 },
      transition: {
        ease: Easing[easing || "expOut"],
        duration: duration || 0.4,
        delay,
      },
    };
  }, [positionFinal, positionInitial, duration, easing, delay]);

  return (
    <motion.div
      {...divProps}
      {...motionProps}
      className={className}
      style={styles}
    >
      {children}
    </motion.div>
  );
};

const FadeAnimatedMountView: React.FC<AnimatedMountViewProps> = (props) => {
  return <AnimatedMountView {...props} mountDirection="none" />;
};

export default Object.assign(AnimatedMountView, {
  Fade: FadeAnimatedMountView,
});
