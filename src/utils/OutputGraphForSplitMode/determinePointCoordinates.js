const determinePointCoordinates = (
                                    number_of_divisions,
                                    width,
                                    barWidth,
                                    yScale,
                                    y_coordinates_absolute,
                                    pointCoordinates,
                                    to_put_into_BarAndCircleHeights
                                ) => {

    for (let i = 0; i < number_of_divisions; i++) {
        let pointX = (i * ((width) / number_of_divisions)) + (barWidth/2);
        let pointY = yScale(y_coordinates_absolute[i]);
        
        pointCoordinates[i] = {x: pointX, y: pointY};
        to_put_into_BarAndCircleHeights[i] = pointY;
    };
    
};

export default determinePointCoordinates;