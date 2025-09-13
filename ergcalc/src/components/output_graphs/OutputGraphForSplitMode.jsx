import { useRef, useEffect } from "react";

const OutputGraphForSplitMode = ({ computedData, OutputGraphRender, setOutputGraphRender}) => {
    console.log(computedData);

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


    const ref = useRef();
    // By having ref={ref} on an element, ref.current sets ref.current = <DOM element>  AFTER THE COMPONENT MOUNTS
    // Therefore allowing you to apply whatever methods and stuff you want onto the real HTML element
    // const svg_element = ref.current;
    
    return(

    <div id="outputGraphContainer" className="border-2 border-gray-200 border-solid">
        <svg id="outputGraph" ref={ref}></svg>
    </div>
    
    );
};

export default OutputGraphForSplitMode;