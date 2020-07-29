import React from "react";
import { TabContent } from "./Navigation/Navigation";
import SlideIn from "./universal/SlideIn";
import PaddingResizer from "./universal/PaddingResizer";

class Blog extends React.Component {
  render() {
    const { componentOrder } = this.props;
    return (
      <div id="blog">
        <SlideIn>
          <PaddingResizer>
            <div className="w-50-l w-90 center tc slide-in-bottom">
              <TabContent
                index={componentOrder}
                content="Blog"
                isLink={false}
              />
              <h2 className="f2 title">Coming Soon!</h2>
            </div>
          </PaddingResizer>
        </SlideIn>
      </div>
    );
  }
}

export default Blog;
