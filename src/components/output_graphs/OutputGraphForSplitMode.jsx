import { scaleLinear } from "@visx/scale";
import { Bar, Line, LinePath, Circle } from "@visx/shape";
import { Axis } from '@visx/axis';
import { Group } from '@visx/group';
import { useState, useEffect, useRef } from "react";

const OutputGraphForSplitMode = ({
                                    computedData,
                                    // OutputGraphRender,
                                    // setOutputGraphRender,
                                    OutputGraphWidth,
                                    OutputGraphHeight, 
                                    slowestPermissibleSplit, 
                                    OutputGraphMargin,
                                    // isMouseDown,
                                    // setIsMouseDown
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

    for (let i=0; i <= number_of_divisions; i++) {
        let x =  (total_distance / number_of_divisions) * (i);
        let y = average_split;

        x_axis_domain.push(x)

        if (i < number_of_divisions) {
            point_coordinates_absolute.push([x,y]);
            y_coordinates_absolute.push(y);
            x_coordinates_absolute.push(x);
        }
    };

    const xScale = scaleLinear({
        domain: [0, Math.max(...x_coordinates_absolute)], // the categorical labels
        range: [0, (width)],                            // pixel span horizontally
        padding: 0.0,                         // space between bars
    }); // xScale("A") returns the left-pixel coordinate for Bar A

    const yScale = scaleLinear({
        domain: [0, slowestPermissibleSplit],
        range: [height, 0], // because in an svg, the top is 0
        padding: 0.0,
    });

    const xAxisScale = scaleLinear({
        domain: [0, Math.max(...x_axis_domain)],
        range: [0, width],
        padding: 0.0,
    });

    const yAxisScale = scaleLinear({
        domain: [slowestPermissibleSplit, 0],
        range: [height, 0],
        padding: 0.0,
    });

    // Prepare input data for <Bar/>
    const barWidth = (width) / number_of_divisions;
    const barCoordinates = []
    for (let i = 0; i < number_of_divisions; i++) {
        let barX = i * ((width) / number_of_divisions);
        let barY = yScale(y_coordinates_absolute[i]);
        barCoordinates[i] = {x: barX, y: barY};
    };

    // Prepare input data for <LinearPath/>
    const pointCoordinates = []
    let to_put_into_BarAndCircleHeights = {}
    for (let i = 0; i < number_of_divisions; i++) {
        let pointX = (i * ((width) / number_of_divisions)) + (barWidth/2);
        let pointY = yScale(y_coordinates_absolute[i]);
        
        pointCoordinates[i] = {x: pointX, y: pointY};
        to_put_into_BarAndCircleHeights[i] = pointY;
    };
    const accessors = {
        xAccessor: (d) => d.x,
        yAccessor: (d) => height - d.y,
    };
    
    const [BarAndCircleHeights, setBarAndCircleHeights] = useState(to_put_into_BarAndCircleHeights)
    useEffect(() => { setBarAndCircleHeights(to_put_into_BarAndCircleHeights) }, [computedData])

    const isMouseDown = useRef(false);
    const [cursorStyle, setCursorStyle] = useState("row-resize");
    const pointThatsBeingDraggedByTheUser = useRef(null);

    const isMouseDraggingPointOnPlot = useRef(false);
    const mouseY_relative = useRef(null);
    let mouseIsWithinBounds = false;
    let mousePercentage;

    const detectIfCursorIsWithinGraphingBounds = (event) => {
        let svg_hitbox = document.getElementById("outputGraph").getBoundingClientRect();

        let mouseY_absolute = event.clientY;
        mouseY_relative.current = mouseY_absolute - svg_hitbox.top - margin.top;

        const svg_height = height;
        mousePercentage = mouseY_relative.current / svg_height * 100;

        let mouseIsWithinVerticalBounds = (mouseY_relative.current >= 0) && (mouseY_absolute <= (svg_hitbox.bottom - margin.bottom));
        mouseIsWithinBounds = mouseIsWithinVerticalBounds // This is here for if you want to implement horizontal bounds in the future

        if (mouseIsWithinBounds && isMouseDraggingPointOnPlot.current) {
            // while (isMouseDraggingPointOnPlot) {
                setBarAndCircleHeights({...BarAndCircleHeights, [pointThatsBeingDraggedByTheUser.current]: mouseY_relative.current});
            // }
        }

        else if (!mouseIsWithinVerticalBounds) {
            isMouseDraggingPointOnPlot.current = false;
            handleMouseUp_CIRCLE();
        }

        // if (mouseIsWithinBounds) {

        //     console.clear();            
        //     console.log(`You're hovering at ABS y=${mouseY_absolute}`)
        //     console.log(`You're hovering at REL y=${mouseY_relative.current}`)
        //     console.log(`${mousePercentage}%`)
        //     console.log(`mouseIsWithinBounds: ${mouseIsWithinBounds}`)
        // }
        // else {
        //     console.clear();
        //     console.log(`Cursor is not within graphing bounds.`)
        //     console.log(`${mousePercentage}%`)
        // }

    };

    const handleMouseUp_CONTAINER = (event) => {
        isMouseDraggingPointOnPlot.current = false;
    };

    const handleMouseMove_CIRCLE = (event) => {
        pointThatsBeingDraggedByTheUser.current = event.target.id.slice(-1);
        pointThatsBeingDraggedByTheUser.y = BarAndCircleHeights[pointThatsBeingDraggedByTheUser.current];
        console.log(pointThatsBeingDraggedByTheUser)
    };

    const handleMouseUp_CIRCLE = (event) => {
        isMouseDown.current = false;
        setCursorStyle("row-resize");
        isMouseDraggingPointOnPlot.current = false;
        pointThatsBeingDraggedByTheUser.current = null;
    };

    const handleMouseDown_CIRCLE = (event) => {
        isMouseDown.current = true;
        setCursorStyle("grab");
        isMouseDraggingPointOnPlot.current = true;
    };

    const handleMouseLeave_CIRCLE = (event) => {
        // isMouseDraggingPointOnPlot.current = false;
    };

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
                                        key={`point_${i}`}
                                        cx={p.x}
                                        cy={BarAndCircleHeights[i]}
                                        r={20}
                                        fill="orange"
                                        onMouseMove={handleMouseMove_CIRCLE}
                                        onMouseDown={handleMouseDown_CIRCLE}
                                        onMouseUp={handleMouseUp_CIRCLE}
                                        onMouseLeave={handleMouseLeave_CIRCLE}
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
