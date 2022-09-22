import { Slide, SlideProps } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";

export const CustomTransition = React.forwardRef(function Transition(
  props: SlideProps &
    TransitionProps & {
      children: React.ReactElement;
    },
  ref: React.Ref<unknown>
) {
  return <Slide ref={ref} {...props} />;
});
