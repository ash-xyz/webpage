import React from "react";
import { GitHub, LinkedIn, Email } from "./Logos";
import SlideIn from "../universal/SlideIn";

export default class SocialMedia extends React.Component {
  render() {
    return (
      <SlideIn
        isSegmentInViewport={true}
        isAnimationSlideIn={false}
        animationDelayClass="delay-150"
      >
        <div className="justify-center align-center">
          <GitHub />
          <LinkedIn />
          <Email />
        </div>
      </SlideIn>
    );
  }
}
