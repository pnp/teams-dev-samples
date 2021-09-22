import * as React from "react";
import { PeopleMgtTabLogin } from "./PeopleMgtTabLogin";
import { PeopleMgtTabSSO } from "./PeopleMgtTabSSO";
import { PeopleMgtTabTeamsSSO } from "./PeopleMgtTabTeamsSSO";

/**
 * Implementation of the People MGT Tab content page
 */
export const PeopleMgtTab = () => {
    /**
     * The render() method to create the UI of the tab
     */
    return (
        <div>
            {/* <PeopleMgtTabSSO /> */}
            {/* <PeopleMgtTabLogin /> */}
            <PeopleMgtTabTeamsSSO />
        </div>
    );
};
