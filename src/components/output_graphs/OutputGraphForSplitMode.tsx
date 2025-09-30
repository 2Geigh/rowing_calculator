import { scaleLinear } from "@visx/scale";
import { Bar, Line, LinePath, Circle } from "@visx/shape";
import { Axis } from '@visx/axis';
import { Group } from '@visx/group';
import { useState, useEffect, useRef } from "react";
import arrayMean from "ml-array-mean";

import formatTime from "../../utils/timeFormat.js";

import type { OutputData } from "../../App.js";
import type { InputData } from "../../App.js";
import type { Dispatch, FC, SetStateAction } from "react";
import type { MouseEvent, MouseEventHandler } from "react";
import type { RefObject } from "react";
import type { Margin } from "../OutputPanel.js";

type PROPS = {
    computedData: OutputData,
    setComputedData: Dispatch<SetStateAction<InputData | OutputData>>,
    // OutputGraphRender,
    // setOutputGraphRender,
    OutputGraphWidth: number,
    OutputGraphHeight: number, 
    slowestPermissibleSplit: number, 
    OutputGraphMargin: Margin,
    // isMouseDown,
    // setIsMouseDown
}

type PointThatsBeingDraggedByTheUser = {
    circle_id: number | null,
    y: number | null
}

const OutputGraphForSplitMode: FC<PROPS> = ({
                                    computedData,
                                    setComputedData,
                                    // OutputGraphRender,
                                    // setOutputGraphRender,
                                    OutputGraphWidth,
                                    OutputGraphHeight, 
                                    slowestPermissibleSplit, 
                                    OutputGraphMargin,
                                    // isMouseDown,
                                    // setIsMouseDown
                                } : PROPS) => {

    console.clear();

    const haveThePointsOnTheGraphBeenManipulatedByTheUserYet = useRef<boolean>(false);
    const point_y_values_REF = useRef<Record<number, number>>({0: 0});

    type FigureParameters = {
        MARGIN_PIXELS: Margin,
        WIDTH_PIXELS: number;
        HEIGHT_PIXELS: number,
        NUMBER_OF_DIVISIONS: number,
        SLOWEST_PERMISSIBLE_SPLIT: number;
        PADDING_PIXELS: {top: number, right: number, bottom: number, left: number},
        DRAWABLE_REGION_WIDTH_PIXELS: number
    }

    const FIGURE_PARAMETERS: FigureParameters = {
        MARGIN_PIXELS: OutputGraphMargin,
        WIDTH_PIXELS: OutputGraphWidth,
        HEIGHT_PIXELS: OutputGraphHeight - OutputGraphMargin.top, //OutputGraphHeight - MARGIN_PIXELS.top
        NUMBER_OF_DIVISIONS: computedData.number_of_divisions,
        SLOWEST_PERMISSIBLE_SPLIT: slowestPermissibleSplit,
        PADDING_PIXELS: {top: 0, right: 15, bottom: 0, left: 0},
        DRAWABLE_REGION_WIDTH_PIXELS: OutputGraphWidth - OutputGraphMargin.left - OutputGraphMargin.right - {top: 0, right: 15, bottom: 0, left: 0}.right // WIDTH_PIXELS - MARGIN_PIXELS.left - MARGIN_PIXELS.right - PADDING_PIXELS.right
    }

    const TOTAL_DISTANCE_METERS = computedData.total_distance;
    const AVERAGE_SPLIT_SI_UNITS = computedData.final_average_split;




    // const MARGIN_PIXELS = OutputGraphMargin;
    // const FIGURE_WIDTH_PIXELS = OutputGraphWidth;
    // const FIGURE_HEIGHT_PIXELS = OutputGraphHeight - MARGIN_PIXELS.top;
    // const NUMBER_OF_DIVISIONS = computedData.number_of_divisions;
    // const TOTAL_DISTANCE_METERS = computedData.total_distance;
    // const AVERAGE_SPLIT_SI_UNITS = computedData.final_average_split;
    // const SLOWEST_PERMISSIBLE_SPLIT = slowestPermissibleSplit;
    // const FIGURE_PADDING_PIXELS: Margin = {top: 0, right: 15, bottom: 0, left: 0};
    // const FIGURE_DRAWABLE_REGION_WIDTH_PIXELS = FIGURE_WIDTH_PIXELS - MARGIN_PIXELS.left - MARGIN_PIXELS.right - FIGURE_PADDING_PIXELS.right;

    const accessors = {
        xAccessor: (d: Record<'x', number>) => d.x,
        yAccessor: (d: Record<'y', number>) => FIGURE_PARAMETERS.HEIGHT_PIXELS - d.y,
    };

    const isMouseDown = useRef<boolean>(false);
    const [cursorStyle, setCursorStyle] = useState<string>("row-resize");
    const pointThatsBeingDraggedByTheUser = useRef<PointThatsBeingDraggedByTheUser>({circle_id: null, y: null});
    const isMouseDraggingPointOnPlot = useRef<boolean>(false);
    const mouseY_relative = useRef<number | null>(null);
    let mouseIsWithinBounds = false;
    let mousePercentage: number;

    const computedData_REF = useRef<OutputData>(computedData);




    // Compute XY coordinates for each point (one per division)



    const compute_point_coordinates_SI_UNITS = ( 
                                                    number_of_divisions: number,
                                                    total_distance: number,
                                                    haveThePointsOnTheGraphBeenManipulatedByTheUserYet: RefObject<boolean>,
                                                    point_y_values_REF: RefObject<any>,
                                                    average_split: number
                                                
                                                ) => {
        
        let point_coordinates_SI_UNITS: any = {};
        for (let i=0; i <= number_of_divisions; i++) {
            let x =  (total_distance / number_of_divisions) * (i);
            let y;

            if (haveThePointsOnTheGraphBeenManipulatedByTheUserYet.current) {
                y = point_y_values_REF.current[i];
            }

            else {
                y = average_split;
            }

            // x_axis_domain.push(x)
            
            if (i < number_of_divisions) {
                point_y_values_REF.current = {...point_y_values_REF.current, [i]:y};
                // y_coordinates_pixels.push(y);
                // x_coordinates_pixels.push(x);
                point_coordinates_SI_UNITS[i] = {'x': x, 'y': y}
            }
        };

        return point_coordinates_SI_UNITS;
    }

    const compute_point_x_coordinates_SI_UNITS = (
                                                    number_of_divisions: number,
                                                    total_distance: number
                                                
                                                ) => {
        
        let point_x_coordinates_SI_UNITS: any = {};
        for (let i=0; i <= number_of_divisions; i++) {
            let x =  (total_distance / number_of_divisions) * (i);

            if (i < number_of_divisions) {
                point_x_coordinates_SI_UNITS[i] = x;
            }
        };

        return point_x_coordinates_SI_UNITS;
    }

    const compute_point_y_coordinates_SI_UNITS = (  
                                                    number_of_divisions: number,
                                                    haveThePointsOnTheGraphBeenManipulatedByTheUserYet: RefObject<boolean>,
                                                    point_y_values_REF: RefObject<any>,
                                                    average_split: number
                                                
                                                ) => {
        
        let point_y_coordinates_SI_UNITS: any = {};
        for (let i=0; i <= number_of_divisions; i++) {
            let y;

            if (haveThePointsOnTheGraphBeenManipulatedByTheUserYet.current) {
                y = point_y_values_REF.current[i];
            }

            else {
                y = average_split;
            }

            if (i < number_of_divisions) {
                point_y_values_REF.current = {...point_y_values_REF.current, [i]:y};
                point_y_coordinates_SI_UNITS[i] = y;
            }
        };

        return point_y_coordinates_SI_UNITS;
    }

    const compute_x_axis_domain_SI_UNITS = (
                                                number_of_divisions: number,
                                                total_distance: number
                                            
                                            ) => {
        
        let x_axis_domain: number[] = [];
        for (let i=0; i <= number_of_divisions; i++) {
            let x =  (total_distance / number_of_divisions) * (i);
            x_axis_domain.push(x)  
        };

        return x_axis_domain;
    }

    let point_coordinates_SI_UNITS: {[key: number]: [number, number]} = compute_point_coordinates_SI_UNITS(FIGURE_PARAMETERS.NUMBER_OF_DIVISIONS, TOTAL_DISTANCE_METERS, haveThePointsOnTheGraphBeenManipulatedByTheUserYet, point_y_values_REF, AVERAGE_SPLIT_SI_UNITS);
    let point_x_coordinates_SI_UNITS: number[] = compute_point_x_coordinates_SI_UNITS(FIGURE_PARAMETERS.NUMBER_OF_DIVISIONS, TOTAL_DISTANCE_METERS);
    let point_y_coordinates_SI_UNITS: number[] = compute_point_y_coordinates_SI_UNITS(FIGURE_PARAMETERS.NUMBER_OF_DIVISIONS, haveThePointsOnTheGraphBeenManipulatedByTheUserYet, point_y_values_REF, AVERAGE_SPLIT_SI_UNITS);
    let x_axis_domain_SI_UNITS = compute_x_axis_domain_SI_UNITS(FIGURE_PARAMETERS.NUMBER_OF_DIVISIONS, TOTAL_DISTANCE_METERS);


    const xScale_PIXELS = scaleLinear({
        domain: [0, Math.max(...Object.values(point_x_coordinates_SI_UNITS))], // the categorical labels
        range: [0, FIGURE_PARAMETERS.DRAWABLE_REGION_WIDTH_PIXELS],                            // pixel span horizontally
        // padding: 0.0,                         // space between bars
    }); // xScale("A") returns the left-pixel coordinate for Bar A

    const yScale_PIXELS = scaleLinear({
        domain: [0, FIGURE_PARAMETERS.SLOWEST_PERMISSIBLE_SPLIT],
        range: [FIGURE_PARAMETERS.HEIGHT_PIXELS, 0], // because in an svg, the top is 0
        // padding: 0.0,
    });

    const xAxisScale_PIXELS = scaleLinear({
        domain: [0, Math.max(...x_axis_domain_SI_UNITS)],
        range: [0, FIGURE_PARAMETERS.DRAWABLE_REGION_WIDTH_PIXELS],
        // padding: 0.0,
    });

    const yAxisScale_PIXELS = scaleLinear({
        domain: [FIGURE_PARAMETERS.SLOWEST_PERMISSIBLE_SPLIT, 0],
        range: [FIGURE_PARAMETERS.HEIGHT_PIXELS, 0],
        // padding: 0.0,
    });

    // Prepare input data for <Bar/>
    const BAR_WIDTH_PIXELS = FIGURE_PARAMETERS.DRAWABLE_REGION_WIDTH_PIXELS / FIGURE_PARAMETERS.NUMBER_OF_DIVISIONS;
    const bar_coordinates_PIXELS = []
    for (let i = 0; i < FIGURE_PARAMETERS.NUMBER_OF_DIVISIONS; i++) {
        let barX = i * ((FIGURE_PARAMETERS.DRAWABLE_REGION_WIDTH_PIXELS) / FIGURE_PARAMETERS.NUMBER_OF_DIVISIONS);
        let barY: number;

        if (haveThePointsOnTheGraphBeenManipulatedByTheUserYet.current) {
                barY = yScale_PIXELS(Number(point_y_values_REF.current[i]));
        } else {
            barY = yScale_PIXELS(Number(point_y_coordinates_SI_UNITS[i]));
        }

        bar_coordinates_PIXELS[i] = {x: barX, y: barY};
    };

    console.log(`x_axis_domain_SI_UNITS: ${JSON.stringify(x_axis_domain_SI_UNITS)}`)
    console.log(`point_x_coordinates_SI_UNITS: ${JSON.stringify(point_x_coordinates_SI_UNITS)}`)
    console.log(`BAR_WIDTH_PIXELS: ${BAR_WIDTH_PIXELS}`)
    console.log(`bar_coordinates_PIXELS: ${JSON.stringify(bar_coordinates_PIXELS)}`)




    // Prepare input data for <LinearPath/> and <Circle/>
    const pointCoordinates_PIXELS = []
    let to_put_into_BarAndCircleHeights_PIXELS: number[] = []
    for (let i = 0; i < FIGURE_PARAMETERS.NUMBER_OF_DIVISIONS; i++) {
        let pointX = (i * ((FIGURE_PARAMETERS.DRAWABLE_REGION_WIDTH_PIXELS) / FIGURE_PARAMETERS.NUMBER_OF_DIVISIONS)) + (BAR_WIDTH_PIXELS/2);
        let pointY: number;

        if (haveThePointsOnTheGraphBeenManipulatedByTheUserYet.current) {
            pointY = yAxisScale_PIXELS(Number(point_y_values_REF.current[i]));
        } else {
            pointY = yAxisScale_PIXELS(Number(point_y_coordinates_SI_UNITS[i]));
        }
        
        pointCoordinates_PIXELS[i] = {x: pointX, y: pointY};
        to_put_into_BarAndCircleHeights_PIXELS[i] = pointY;
    };
    
    
    const [BarAndCircleHeights_PIXELS, setBarAndCircleHeights_PIXELS] = useState<number[]>(to_put_into_BarAndCircleHeights_PIXELS);
    useEffect(() => { setBarAndCircleHeights_PIXELS(to_put_into_BarAndCircleHeights_PIXELS) }, [computedData]);




    // EVENT HANDLERS
    const detectIfCursorIsWithinGraphingBounds: MouseEventHandler = async (event: MouseEvent<any>) => {
        const OUTPUT_GRAPH_ELEMENT = document.getElementById("outputGraph") as HTMLElement | null;

        if (!OUTPUT_GRAPH_ELEMENT) {
            console.error(`No element with id "outputGraph" found.`)
            return 1;
        }

        const SVG_HITBOX = OUTPUT_GRAPH_ELEMENT.getBoundingClientRect();

        const MOUSE_Y_FROM_VIEWPORT_TOP_PIXELS = event.clientY;
        mouseY_relative.current = MOUSE_Y_FROM_VIEWPORT_TOP_PIXELS - SVG_HITBOX.top - FIGURE_PARAMETERS.MARGIN_PIXELS.top;

        const SVG_HEIGHT_PIXELS = FIGURE_PARAMETERS.HEIGHT_PIXELS;
        mousePercentage = mouseY_relative.current / SVG_HEIGHT_PIXELS * 100;

        let mouseIsWithinVerticalBounds = (mouseY_relative.current >= 0) && (MOUSE_Y_FROM_VIEWPORT_TOP_PIXELS <= (SVG_HITBOX.bottom - FIGURE_PARAMETERS.MARGIN_PIXELS.bottom));
        mouseIsWithinBounds = mouseIsWithinVerticalBounds // This is here for if you want to implement horizontal bounds in the future

        if (mouseIsWithinBounds && isMouseDraggingPointOnPlot.current) {
            // while (isMouseDraggingPointOnPlot) {
                setBarAndCircleHeights_PIXELS({...BarAndCircleHeights_PIXELS, [Number(pointThatsBeingDraggedByTheUser.current)]: mouseY_relative.current});

                // -Infinity so that if the first goes else, the second will also go else
                // Because no number can be smaller than -Infinity
                let pointThatsBeingDraggedByTheUser_y_value = -Infinity;

                if (!pointThatsBeingDraggedByTheUser.current.circle_id || !pointThatsBeingDraggedByTheUser.current.y) {
                    console.error(`No point is recognized as having been touched by the user.`);
                    return 1;
                } else {
                    pointThatsBeingDraggedByTheUser_y_value = pointThatsBeingDraggedByTheUser.current.y;
                }

                if ((pointThatsBeingDraggedByTheUser.current.y > FIGURE_PARAMETERS.SLOWEST_PERMISSIBLE_SPLIT)) {
                    point_y_values_REF.current[pointThatsBeingDraggedByTheUser.current.circle_id] = FIGURE_PARAMETERS.SLOWEST_PERMISSIBLE_SPLIT;
                } else {
                    point_y_values_REF.current[pointThatsBeingDraggedByTheUser.current.circle_id] = pointThatsBeingDraggedByTheUser_y_value;
                }

                haveThePointsOnTheGraphBeenManipulatedByTheUserYet.current = true;
                
                // UPDATE COMPUTED DATA
                // const [computedData, setComputedData] = useState({
                //     final_time: "",
                //     final_time_display: "",
                //     final_average_split: "",
                //     final_average_split_display: "",
                //     number_of_divisions: "",
                //     total_distance: "",
                // });
                
                let plotted_circles = document.getElementsByClassName("plotted_circle") as HTMLCollectionOf<SVGCircleElement>;
                let plotted_circles_y_values: number[] = [];
                let circle_height_proportions: number[] = [];
                let plotted_circles_splits: number[] = [];
                let new_final_average_split: number;
                let new_final_time: number;

                // Get the height values of every circle in the plot
                for (let i=0; i<plotted_circles.length; i++) {
                    const circle = plotted_circles[i] as SVGCircleElement;
                    if (circle) {
                        plotted_circles_y_values.push(Number(circle.cy.animVal.value));
                    }
                }

                // Convert all the height values into splits
                for (let i=0; i<plotted_circles_y_values.length; i++) {
                    const circle_y_value = plotted_circles[i];
                    if (circle_y_value) {
                        circle_height_proportions.push(Number(circle_y_value) / SVG_HEIGHT_PIXELS);
                    }
                }

                for (let i=0; i<circle_height_proportions.length; i++) {
                    const circle_height_proportion = circle_height_proportions[i];
                    plotted_circles_splits.push(Number(circle_height_proportion) * FIGURE_PARAMETERS.SLOWEST_PERMISSIBLE_SPLIT);
                }
                console.log(plotted_circles_splits);

                // Compute the average final split from them
                new_final_average_split = arrayMean(plotted_circles_splits);
                console.log(`new_final_average_split: ${new_final_average_split}`);

                // Recompute final time from the new average final split
                new_final_time = new_final_average_split * TOTAL_DISTANCE_METERS / 500;
                console.log(`new_final_time:${new_final_time}`);

                //Update data state
                computedData_REF.current = {...computedData,
                    final_time: new_final_time,
                    final_time_display: JSON.stringify(formatTime(new_final_time)[1]),
                    final_average_split: new_final_average_split,
                    final_average_split_display: JSON.stringify(formatTime(new_final_average_split)[1]),
                };
            // }
        }

        else if (!mouseIsWithinVerticalBounds) {
            isMouseDraggingPointOnPlot.current = false;
            handleMouseUp_CIRCLE(event);
        }
    };

    const handleMouseleave_CONTAINER: MouseEventHandler = (event: MouseEvent<any>) => {
        isMouseDraggingPointOnPlot.current = false;
        handleMouseUp_CIRCLE(event);
    };

    const handleMouseUp_CONTAINER: MouseEventHandler<HTMLElement> = (event: MouseEvent<HTMLElement>) => {

        if (isMouseDraggingPointOnPlot) {
            haveThePointsOnTheGraphBeenManipulatedByTheUserYet.current = true;
        }

        isMouseDraggingPointOnPlot.current = false;
        setComputedData(computedData_REF.current)
        
    };

    const handleMouseMove_CIRCLE: MouseEventHandler<SVGCircleElement> = (event: MouseEvent) => {
        if (event.target instanceof HTMLElement && event.target.id) {
            pointThatsBeingDraggedByTheUser.current.circle_id = Number(event.target.id.slice(-1));
            pointThatsBeingDraggedByTheUser.current.y = Number(BarAndCircleHeights_PIXELS[pointThatsBeingDraggedByTheUser.current.circle_id]);
        }
    };

    const handleMouseEnter_CIRCLE: MouseEventHandler<SVGCircleElement> = (event: MouseEvent) => {
        // console.log(pointThatsBeingDraggedByTheUser)
    };

    const handleMouseUp_CIRCLE: MouseEventHandler<SVGCircleElement> = (event: MouseEvent) => {
        isMouseDown.current = false;
        setCursorStyle("row-resize");
        isMouseDraggingPointOnPlot.current = false;
        pointThatsBeingDraggedByTheUser.current = null;

    };

    const handleMouseDown_CIRCLE: MouseEventHandler<SVGCircleElement> = (event: MouseEvent) => {
        isMouseDown.current = true;
        setCursorStyle("grab");
        isMouseDraggingPointOnPlot.current = true;
    };

    const handleMouseLeave_CIRCLE: MouseEventHandler<SVGCircleElement> = (event: MouseEvent) => {
        // isMouseDraggingPointOnPlot.current = false;
    };

    // console.log(computedData);
    // console.log(computedData_REF.current);
    // console.log(haveThePointsOnTheGraphBeenManipulatedByTheUserYet.current);
    // console.log(point_y_values_REF.current);

    return(
        <div id="outputGraph" className="flex flex-row items-start justify-start bg-pink-200">

            <div id="graphAndXAxisLabel" className="block center bg-pink-300" onMouseMove={detectIfCursorIsWithinGraphingBounds} onMouseUp={handleMouseUp_CONTAINER} onMouseLeave={handleMouseleave_CONTAINER}>
                <svg
                    width={FIGURE_PARAMETERS.WIDTH_PIXELS - FIGURE_PARAMETERS.MARGIN_PIXELS.right}
                    height={FIGURE_PARAMETERS.HEIGHT_PIXELS + FIGURE_PARAMETERS.MARGIN_PIXELS.bottom}
                    className="bg-red-100"
                    // onMouseMoveCapture={detectIfCursorIsWithinGraphingBounds}
                    >
                        <Group
                            left={FIGURE_PARAMETERS.MARGIN_PIXELS.left}
                            top={FIGURE_PARAMETERS.MARGIN_PIXELS.top}> {/* Offset entire group to make room for label */}
                                
                                {/* Y-Axis with Units */}
                                <Axis
                                scale={yAxisScale_PIXELS}
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
                                scale={xAxisScale_PIXELS}
                                top={FIGURE_PARAMETERS.HEIGHT_PIXELS}
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
                                numTicks={FIGURE_PARAMETERS.NUMBER_OF_DIVISIONS}
                                />

                                {/* BARS */}
                                {bar_coordinates_PIXELS.map((p,i) => {
                                const barHeight = /*p.y*/FIGURE_PARAMETERS.HEIGHT_PIXELS - Number(BarAndCircleHeights_PIXELS[i]);
                                const barX = p.x;
                                const barY = BarAndCircleHeights_PIXELS[i];

                                return (
                                    <Bar
                                    key={p.x}
                                    x={barX}
                                    y={barY}
                                    width={BAR_WIDTH_PIXELS}
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
                                {pointCoordinates_PIXELS.map((p, i) => (
                                    <Circle
                                        id={`point_${i}`}
                                        className="plotted_circle"
                                        key={`point_${i}`}
                                        cx={p.x}
                                        cy={BarAndCircleHeights_PIXELS[i]}
                                        r={5}
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
