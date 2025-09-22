import { scaleLinear } from "@visx/scale";

const compute_xScale = (x_coordinates_absolute, width) => {
    return (
        scaleLinear({
            domain: [0, Math.max(...x_coordinates_absolute)], // the categorical labels
            range: [0, (width)],                            // pixel span horizontally
            padding: 0.0,                         // space between bars
        }) // xScale("A") returns the left-pixel coordinate for Bar A
    );
};

const compute_yScale = (slowestPermissibleSplit, height) => {
    return (
        scaleLinear({
            domain: [0, slowestPermissibleSplit],
            range: [height, 0], // because in an svg, the top is 0
            padding: 0.0,
        })
    );
};

const compute_xAxisScale = (x_axis_domain, width) => {
    return (
        scaleLinear({
            domain: [0, Math.max(...x_axis_domain)],
            range: [0, width],
            padding: 0.0,
        })
    );
};

const compute_yAxisScale = (slowestPermissibleSplit, height) => {
    return (
        scaleLinear({
            domain: [slowestPermissibleSplit, 0],
            range: [height, 0],
            padding: 0.0,
        })
    );
};

export { compute_xScale, compute_yScale, compute_xAxisScale, compute_yAxisScale}