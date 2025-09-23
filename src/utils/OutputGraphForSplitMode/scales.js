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

export { xScale, yScale, xAxisScale, yAxisScale };