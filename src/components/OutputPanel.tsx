import OutputGraphForSplitMode from "./output_graphs/OutputGraphForSplitMode.js";
import { useState, type Dispatch, type FC, type SetStateAction, } from "react";

import type { InputData, OutputData } from "../App.js";

type Props = {
    computedData: OutputData,
    setComputedData: Dispatch<SetStateAction<OutputData>>,
    hasInputsBeenSubmitted: boolean,
    slowestPermissibleSplit: number
    // outputGraphRender: number,
}

export type Margin = {
    top: number,
    right: number,
    bottom: number,
    left: number
}

const OutputPanel: FC<Props> = ( {
                        computedData,
                        setComputedData,
                        hasInputsBeenSubmitted,
                        slowestPermissibleSplit,
                        // outputGraphRender,
                        // isMouseDown,
                        // setIsMouseDown
                    }) => {

    const [OutputGraphRender, setOutputGraphRender] = useState<number>(0);

    const OUTPUT_GRAPH_WIDTH_PIXELS_DEFAULT = 500;
    const OUTPUT_GRAPH_HEIGHT_PIXELS_DEFAULT = 100;
    const OUTPUT_GRAPH_MARGINS_PIXELS_DEFAULT = { top: (OUTPUT_GRAPH_HEIGHT_PIXELS_DEFAULT * 0.1),
                                        right: (OUTPUT_GRAPH_WIDTH_PIXELS_DEFAULT * 0.04),
                                        bottom: (OUTPUT_GRAPH_HEIGHT_PIXELS_DEFAULT * 0.1),
                                        left: (OUTPUT_GRAPH_WIDTH_PIXELS_DEFAULT * 0.13)}

    const [OutputGraphWidth, setOutputGraphWidth] = useState<number>(500); // Default test value: 500;
    const [OutputGraphHeight, setOutputGraphheight] = useState<number>(200); // Default test value: 200;
    const [OutputGraphMargin, setOutputGraphMargin] = useState<Margin>({
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
                // OutputGraphRender={OutputGraphRender}
                // setOutputGraphRender={setOutputGraphRender}
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

    else {
        return (<></>)
    }
};


export default OutputPanel;