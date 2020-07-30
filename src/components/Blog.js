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
            <div className="w-two-thirds-l w-75 center tc">
              <div className="pv3">
                <TabContent
                  index={componentOrder}
                  content="Blog"
                  isLink={false}
                />
              </div>
              <div className="flex flex-row-l flex-column flex-nowrap justify-around tl">
                Coming Soon
              </div>
            </div>
          </PaddingResizer>
        </SlideIn>
      </div>
    );
  }
}

export default Blog;
