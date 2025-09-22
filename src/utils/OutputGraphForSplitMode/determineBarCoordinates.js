import { scaleLinear } from "@visx/scale";

const determineBarCoordinates = (   number_of_divisions,
                                    width,
                                    yScale,
                                    y_coordinates_absolute,
                                    barCoordinates
                                ) => {

    for (let i = 0; i < number_of_divisions; i++) {

        let barX = i * ((width) / number_of_divisions);
        let barY = yScale(y_coordinates_absolute[i]);
        barCoordinates[i] = {x: barX, y: barY};
        
    };

};

export default determineBarCoordinates;