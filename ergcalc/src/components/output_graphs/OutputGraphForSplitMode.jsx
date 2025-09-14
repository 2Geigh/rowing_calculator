import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar, LinePath } from "@visx/shape";

const OutputGraphForSplitMode = ({ computedData, OutputGraphRender, setOutputGraphRender, width = 400, height = 200}) => {
    // console.log(computedData);

    // Compute XY coordinates for each point (one per division)
    let number_of_divisions = computedData.number_of_divisions;
    let total_distance = computedData.total_distance;
    let average_split = computedData.final_average_split;

    let point_coordinates = {};
    let point_coordinates_absolute = [];
    let point_coordinates_relative = [];

    let y_coordinates_absolute = [];
    let x_coordinates_absolute = [];
    let y_coordinates_relative = [];
    let x_coordinates_relative = [];

    for (let i=0; i < number_of_divisions; i++) {
        let relative_x = (total_distance / number_of_divisions)
        let x =  relative_x * (i);
        let relative_y = 1;
        let y = average_split;

        point_coordinates[i] = [[x,y], [relative_x, relative_y]];
        point_coordinates_absolute.push([x,y]);
        point_coordinates_relative.push([relative_x, relative_y]);
        y_coordinates_absolute.push(y);
        y_coordinates_relative.push(relative_y);
        x_coordinates_absolute.push(x);
        x_coordinates_relative.push(relative_x);
    };

    console.log(`point_coordinates_absolute: ${point_coordinates_absolute}`);
    console.log(`x_coordinates_absolute: ${x_coordinates_absolute}`);


    const xScale = scaleLinear({
        domain: [0, Math.max(...x_coordinates_absolute)], // the categorical labels
        range: [0, width],                            // pixel span horizontally
        padding: 0.4                                  // space between bars
    }); // xScale("A") returns the left-pixel coordinate for Bar A

    const yScale = scaleLinear({
        domain: [0, Math.max(...y_coordinates_absolute.map((y) => y))], // Numeric min and max of data
        range: [height, 0] // Range in pixels, inverted because in SVG 0 is at the top
    });


    const barWidth = width / number_of_divisions;
    const barCoordinates = []
    // const barCoordinates = point_coordinates_absolute.map((x) => {x});
    for (let i = 0; i < number_of_divisions; i++) {
        let barX = i * ((number_of_divisions - 1) * (width / number_of_divisions));
        barCoordinates[i] = [barX, y_coordinates_absolute[i]];
    };
    console.log(`barCoordinates: ${barCoordinates}`);
    


    
    return(
    <>
        <svg width={width} height={height} className="bg-red-100">
            {/* BARS */}
            {barCoordinates.map(p => {
                const barHeight = height - yScale(p[1]);
                const barX = xScale(p[0]);
                const barY = yScale(p[1]);
            
            
                return (
                    <Bar
                        key={p[0]}
                        x={barX}
                        y={barY}
                        width={barWidth}
                        height={barHeight}
                        fill="steelblue"
                        stroke="black"
                        strokeWidth={1}   
                    >    
                    </Bar>
                );
            })}

            {/* LINE */}
            <LinePath
                data={point_coordinates_absolute}
                x={p => xScale(p[0])}
                y={p => yScale(p[1])}
                stroke="black"
                strokeWidth={2}
            >
            </LinePath>
        </svg>
    </>
    );
};

export default OutputGraphForSplitMode;