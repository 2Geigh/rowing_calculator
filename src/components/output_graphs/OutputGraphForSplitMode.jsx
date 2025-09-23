import { scaleLinear } from "@visx/scale";
import { Bar, Line, LinePath, Circle } from "@visx/shape";
import { Axis } from '@visx/axis';
import { Group } from '@visx/group';
import { useState, useEffect, useRef } from "react";

import determineBaseCoordinates from "../../utils/OutputGraphForSplitMode/determineBaseCoordinates";
import { xScale, yScale, xAxisScale, yAxisScale } from "../../utils/OutputGraphForSplitMode/scales"
import determineBarCoordinates from "../../utils/OutputGraphForSplitMode/determineBarCoordinates";
import determinePointCoordinates from "../../utils/OutputGraphForSplitMode/determinePointCoordinates";

import detectIfCursorIsWithinGraphingBounds from "../../utils/OutputGraphForSplitMode/event_handlers/detectIfCursorIsWithinGraphingBounds";
import handleMouseEnter_CIRCLE from "../../utils/OutputGraphForSplitMode/event_handlers/handleMouseEnter_CIRCLE";
import handleMouseMove_CIRCLE from "../../utils/OutputGraphForSplitMode/event_handlers/handleMouseMove_CIRCLE";
import handleMouseUp_CIRCLE from "../../utils/OutputGraphForSplitMode/event_handlers/handleMouseUp_CIRCLE";
import handleMouseDown_CIRCLE from "../../utils/OutputGraphForSplitMode/event_handlers/handleMouseDown_CIRCLE";
import handleMouseLeave_CIRCLE from "../../utils/OutputGraphForSplitMode/event_handlers/handleMouseLeave_CIRCLE";
import handleMouseUp_CONTAINER from "../../utils/OutputGraphForSplitMode/event_handlers/handleMouseUp_CONTAINER";

const OutputGraphForSplitMode = ({
                                    computedData,
                                    setComputedData,
                                    OutputGraphWidth,
                                    OutputGraphHeight, 
                                    slowestPermissibleSplit, 
                                    OutputGraphMargin,
                                }) => {

    const margin = OutputGraphMargin;
    const width = OutputGraphWidth / (1.5);
    const height = OutputGraphHeight - margin.top;
    const number_of_divisions = computedData.number_of_divisions;
    const total_distance = computedData.total_distance;
    const average_split = computedData.final_average_split;

    // Compute XY coordinates for each point (one per division)
    let point_coordinates_absolute = [];
    let y_coordinates_absolute = [];
    let x_coordinates_absolute = [];
    let x_axis_domain = [];
    determineBaseCoordinates(x_axis_domain, pointCoordinates, y_coordinates_absolute, x_coordinates_absolute);

    // Prepare input data for <Bar/>
    const barWidth = (width) / number_of_divisions;
    const barCoordinates = []
    determineBarCoordinates(number_of_divisions, width, barCoordinates);

    // Prepare input data for <LinearPath/>
    const pointCoordinates = []
    let to_put_into_BarAndCircleHeights = {}
    determinePointCoordinates(number_of_divisions, width, barWidth, pointCoordinates, to_put_into_BarAndCircleHeights);


    const accessors = {
        xAccessor: (d) => d.x,
        yAccessor: (d) => height - d.y,
    };
    
    const [BarAndCircleHeights, setBarAndCircleHeights] = useState(to_put_into_BarAndCircleHeights);
    useEffect(() => { setBarAndCircleHeights(to_put_into_BarAndCircleHeights) }, [computedData]);

    // Default parameters for cursor dragging behaviour
    const isMouseDown = useRef(false);
    const [cursorStyle, setCursorStyle] = useState("row-resize");
    const pointThatsBeingDraggedByTheUser = useRef(null);
    const isMouseDraggingPointOnPlot = useRef(false);
    const mouseY_relative = useRef(null);

    // initializing variables for detectIfCursorIsWithinGraphingBounds
    let mouseIsWithinBounds = false;
    let mousePercentage;
    let new_final_average_split;
    let new_final_time;

    return(
        <div id="outputGraph" className="flex flex-row items-start justify-start bg-pink-200">

            <div id="graphAndXAxisLabel" className="block center bg-pink-300" onMouseMove={detectIfCursorIsWithinGraphingBounds} onMouseUp={handleMouseUp_CONTAINER}>
                <svg
                    width={OutputGraphWidth - margin.right}
                    height={OutputGraphHeight + margin.bottom}
                    className="bg-red-100"
                    // onMouseMoveCapture={detectIfCursorIsWithinGraphingBounds}
                    >
                        <Group
                            left={margin.left}
                            top={margin.top}> {/* Offset entire group to make room for label */}
                                
                                {/* Y-Axis with Units */}
                                <Axis
                                scale={yAxisScale}
                                left={0}
                                stroke="black"
                                tickStroke="black"
                                orientation="left"
                                hideZero={false}
                                tickLabelProps={() => ({
                                    fill: 'black',
                                    fontSize: 12,
                                    textAnchor: 'end',
                                })}
                                label="Split (s/500m)"
                                labelOffset={30}
                                labelClassName="text-base"
                                />

                                {/* X-Axis with Units */}
                                <Axis
                                scale={xAxisScale}
                                top={height}
                                left={0}
                                // stroke="black"
                                // tickStroke="black"
                                tickLabelProps={() => ({
                                    fill: 'black',
                                    fontSize: 12,
                                    textAnchor: 'end',
                                })}
                                label="Distance (m)"
                                labelOffset={15}
                                labelClassName="text-base"
                                numTicks={number_of_divisions}
                                />

                                {/* BARS */}
                                {barCoordinates.map((p,i) => {
                                const barHeight = /*p.y*/height - BarAndCircleHeights[i];
                                const barX = p.x;
                                const barY = BarAndCircleHeights[i];

                                return (
                                    <Bar
                                    key={p.x}
                                    x={barX}
                                    y={barY}
                                    width={barWidth}
                                    height={barHeight}
                                    fill="steelblue"
                                    stroke="red"
                                    strokeWidth={1}
                                    />
                                );
                                })}

                                {/* LINE */}
                                {/* <LinePath
                                    data={pointCoordinates}
                                    x={accessors.xAccessor}
                                    y={(accessors.yAccessor)}
                                    stroke="#6B1400"
                                    strokeWidth={2}
                                /> */}

                                {/* CIRCLES */}
                                {pointCoordinates.map((p, i) => (
                                    <Circle
                                        id={`point_${i}`}
                                        className="plotted_circle"
                                        key={`point_${i}`}
                                        cx={p.x}
                                        cy={BarAndCircleHeights[i]}
                                        r={20}
                                        fill="orange"
                                        onMouseMove={handleMouseMove_CIRCLE}
                                        onMouseDown={handleMouseDown_CIRCLE}
                                        onMouseUp={handleMouseUp_CIRCLE}
                                        onMouseLeave={handleMouseLeave_CIRCLE}
                                        onMouseEnter={handleMouseEnter_CIRCLE}
                                        cursor={cursorStyle}
                                    />
                                ))}
                        </Group>
                </svg>
            </div>
        </div>
    );
};

export default OutputGraphForSplitMode;
