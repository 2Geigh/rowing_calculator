import OutputGraphForSplitMode from "./output_graphs/OutputGraphForSplitMode";
import { useState } from "react";

const OutputPanel = ( {computedData, hasInputsBeenSubmitted} ) => {

    const [OutputGraphRender, setOutputGraphRender] = useState(0);

    const [OutputGraphWidth, setOutputGraphWidth] = useState(400);
    const [OutputGraphHeight, setOutputGraphheight] = useState(180);

    if (hasInputsBeenSubmitted) {
        return (
        <section
            id="output"
            className={`bg-gray-300 border-solid border-2 border-gray-400 p-2 max-w-lg flex flex-col items-center justify-center rounded`}>
            <span id="final-time">Goal final time: {computedData.final_time_display}</span>
            <span id="final-average-split">Goal average split: {computedData.final_average_split_display}</span>
            <OutputGraphForSplitMode
                OutputGraphRender={OutputGraphRender}
                setOutputGraphRender={setOutputGraphRender}
                computedData={computedData}
                OutputGraphWidth={OutputGraphWidth}
                OutputGraphHeight={OutputGraphHeight}
                />
            {/* <span id="final-divisional-split">Final split per division:</span> */}
        </section>
    );
    }
};

export default OutputPanel;