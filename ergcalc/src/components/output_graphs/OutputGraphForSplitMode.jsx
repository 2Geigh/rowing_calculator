import { scaleLinear } from "@visx/scale";
import { Bar, LinePath } from "@visx/shape";
import { Axis } from '@visx/axis';
import { Group } from '@visx/group';

const OutputGraphForSplitMode = ({ computedData, OutputGraphRender, setOutputGraphRender, OutputGraphWidth, OutputGraphHeight, slowestPermissibleSplit, OutputGraphMargin}) => {

    const margin = OutputGraphMargin;
    const width = OutputGraphWidth / (1.5);
    const height = OutputGraphHeight - margin.top;

    // Compute XY coordinates for each point (one per division)
    let number_of_divisions = computedData.number_of_divisions;
    let total_distance = computedData.total_distance;
    let average_split = computedData.final_average_split;

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
    console.log(x_axis_domain)

    // console.log(`point_coordinates_absolute: ${point_coordinates_absolute}`);
    // console.log(`x_coordinates_absolute: ${x_coordinates_absolute}`);


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

    const yAxisScale = scaleLinear({
        domain: [slowestPermissibleSplit, 0],
        range: [height, 0],
        padding: 0.0,
    });

    const xAxisScale = scaleLinear({
        domain: [0, Math.max(...x_axis_domain)],
        range: [0, width],
        padding: 0.0,
    });

    const barWidth = (width) / number_of_divisions;
    const barCoordinates = []
    // const barCoordinates = point_coordinates_absolute.map((x) => {x});
    for (let i = 0; i < number_of_divisions; i++) {
        let barX = i * ((width) / number_of_divisions);
        let barY = yScale(y_coordinates_absolute[i]);
        barCoordinates[i] = {x: barX, y: barY};
    };
    // console.log(`barCoordinates:`);
    // console.log(barCoordinates)
    // console.log(`width: ${OutputGraphWidth}`);
    // console.log(`barWidth: ${barWidth}`);
    // console.log(`bar_: ${barHeightZ}`)



    return(
    <div id="outputGraph" className="flex flex-row items-start justify-start bg-pink-200">
        {/* <div id="yAxisLabelWrapper" className="w-full h-{height} flex flex-col items-end bg-pink-500">
            <span id="yAxisLabel" className="bg-green-400">0:00</span>
            <span id="yAxisLabel" className="bg-green-400">1:30</span>
            <span id="yAxisLabel" className="bg-green-400">3:00</span>
        </div>

        <div id="graphAndXAxisLabel" className="block center bg-pink-300"> */}
            <svg width={OutputGraphWidth - margin.right - margin.left} height={OutputGraphHeight + margin.bottom} className="bg-red-100">
                <Group left={margin.left} top={margin.top}> {/* Offset entire group to make room for label */}
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
                    {barCoordinates.map(p => {
                    const barHeight = p.y;
                    const barX = p.x;
                    const barY = height - barHeight;

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
                </Group>
            </svg>

            {/* <text id="xAxisLabel" className="block bg-black text-center">
                X Axis Label
            </text>
        </div> */}
    </div>
    );
};

export default OutputGraphForSplitMode;
