const determineBaseCoordinates = (x_axis_domain, pointCoordinates, y_coordinates_absolute, x_coordinates_absolute) => {
    
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
};

export default determineBaseCoordinates;