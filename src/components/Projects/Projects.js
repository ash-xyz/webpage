import React from "react";
import { TabContent } from "../Navigation/Navigation";
import content from "../../config/content";
import SlideIn from "../universal/SlideIn";
import PaddingResizer from "../universal/PaddingResizer";

export default class Projects extends React.Component {
  render() {
    const { componentOrder } = this.props;
    const { section_name } = content.projects;
    return (
      <div id="projects">
        <SlideIn>
          <PaddingResizer>
            <div className="w-40-xxxl w-50-xxl w-60-xl w-70-l-mine w-90-m w-90-ns center tc">
              <div className="pv3">
                <TabContent
                  index={componentOrder}
                  content={section_name}
                  isLink={false}
                />
              </div>
              Coming Soon
            </div>
          </PaddingResizer>
        </SlideIn>
      </div>
    );
  }
}
