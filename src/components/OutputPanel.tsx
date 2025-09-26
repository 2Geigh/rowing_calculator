import OutputGraphForSplitMode from "./output_graphs/OutputGraphForSplitMode.js";
import { useState } from "react";

const OutputPanel = ( {
                        computedData,
                        setComputedData,
                        hasInputsBeenSubmitted, 
                        slowestPermissibleSplit,
                        // isMouseDown,
                        // setIsMouseDown
                    } ) => {

    const [OutputGraphRender, setOutputGraphRender] = useState(0);

    const OutputGraphWidth_DEFAULT = 500;
    const OutputGraphHeight_DEFAULT = 100;
    const OutputGraphMargin_DEFAULT = { top: (OutputGraphHeight_DEFAULT * 0.1),
                                        right: (OutputGraphWidth_DEFAULT * 0.04),
                                        bottom: (OutputGraphHeight_DEFAULT * 0.1),
                                        left: (OutputGraphWidth_DEFAULT * 0.13)}

    const [OutputGraphWidth, setOutputGraphWidth] = useState(500); // Default test value: 500;
    const [OutputGraphHeight, setOutputGraphheight] = useState(200); // Default test value: 200;
    const [OutputGraphMargin, setOutputGraphMargin] = useState({
                                                                top: ((0.0292 * OutputGraphHeight) + 28.9),
                                                                right: ((0.296 * OutputGraphWidth) - 74.6),
                                                                bottom: ((6.99 * (10**(-3)) * OutputGraphHeight) + 65), 
                                                                left: 65}); // Default test values: 20, 20, 60, 65

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
                setComputedData={setComputedData}
                OutputGraphWidth={OutputGraphWidth}
                OutputGraphHeight={OutputGraphHeight}
                OutputGraphMargin={OutputGraphMargin}
                slowestPermissibleSplit={slowestPermissibleSplit}

                // isMouseDown={isMouseDown}
                // setIsMouseDown={setIsMouseDown}

                // onMouseUp={setIsMouseDown(false)}
            />
            {/* <span id="final-divisional-split">Final split per division:</span> */}
        </section>
    );
    }
};

export default OutputPanel;