import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar, LinePath } from "@visx/shape";

const OutputGraphForSplitMode = ({ computedData, OutputGraphRender, setOutputGraphRender, OutputGraphWidth, height = 200}) => {
    // console.log(computedData);

    const width = OutputGraphWidth;

    // Compute XY coordinates for each point (one per division)
    let number_of_divisions = computedData.number_of_divisions;
    let total_distance = computedData.total_distance;
    let average_split = computedData.final_average_split;

    let point_coordinates = {};
    let point_coordinates_absolute = [];

    let y_coordinates_absolute = [];
    let x_coordinates_absolute = [];

    for (let i=0; i < number_of_divisions; i++) {
        let relative_x = (total_distance / number_of_divisions)
        let x =  relative_x * (i);
        let y = average_split;

        point_coordinates_absolute.push([x,y]);
        y_coordinates_absolute.push(y);
        x_coordinates_absolute.push(x);
    };

    console.log(`point_coordinates_absolute: ${point_coordinates_absolute}`);
    console.log(`x_coordinates_absolute: ${x_coordinates_absolute}`);


    const xScale = scaleLinear({
        domain: [0, Math.max(...x_coordinates_absolute)], // the categorical labels
        range: [0, width],                            // pixel span horizontally
        padding: 0.0,                         // space between bars
    }); // xScale("A") returns the left-pixel coordinate for Bar A

    const barWidth = width / number_of_divisions;
    const barCoordinates = []
    // const barCoordinates = point_coordinates_absolute.map((x) => {x});
    for (let i = 0; i < number_of_divisions; i++) {
        const barX = i * (width / number_of_divisions);
        barCoordinates[i] = [barX, y_coordinates_absolute[i]];
    };
    console.log(`barCoordinates: ${barCoordinates}`);
    console.log(`width: ${OutputGraphWidth}`);
    console.log(`barWidth: ${barWidth}`);
    


    
    return(
    <>
        <svg width={OutputGraphWidth} height={height} className="bg-red-100">
            {/* BARS */}
            {barCoordinates.map(p => {
                const barHeight = height - p[1];
                const barX = p[0];
                const barY = p[1];
            
            
                return (
                    <Bar
                        key={p[0]}
                        x={barX}
                        y={barY}
                        width={barWidth}
                        height={barHeight}
                        fill="steelblue"
                        stroke="red"
                        strokeWidth={1}   
                    >    
                    </Bar>
                );
            })}

            {/* LINE
            <LinePath
                data={point_coordinates_absolute}
                x={p => xScale(p[0])}
                y={p => yScale(p[1])}
                stroke="black"
                strokeWidth={2}
            >
            </LinePath> */}
        </svg>
    </>
    );
};

export default OutputGraphForSplitMode;