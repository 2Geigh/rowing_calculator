const OutputGraphForSplitMode = ({ computedData, OutputGraphRender, setOutputGraphRender}) => {
    console.log(computedData);

    // Compute XY coordinates for each point (one per division)
    let number_of_divisions = computedData.number_of_divisions;
    let total_distance = computedData.total_distance;
    let average_split = computedData.final_average_split;

    let point_coordinates = {};
    for (let i=0; i < number_of_divisions; i++) {
        let relative_x = (total_distance / number_of_divisions)
        let x =  relative_x * (i);
        let relative_y = 1;
        let y = average_split;
        point_coordinates[i] = [[x,y], [relative_x, relative_y]];
    };

    const ref = React.useRef();

    // By having ref={ref} on an element, ref.current sets ref.current = <DOM element>  AFTER THE COMPONENT MOUNTS
    // Therefore allowing you to apply whatever methods and stuff you want onto the real HTML element
    const canvas = ref.current;

    if (canvas) { 
        // a Canvas API method
        // specifies the particular canvas element you're gonna draw on
        const context = canvas.getContext('2d');

        const width = canvas.width;
        const height = canvas.height;

        // Draw
        context.beginPath();
        context.moveTo(0,0);
        context.lineTo(20, 20);
        context.stroke();


        // Render X axis in <svg>

        // Render Y axis in <svg>
        
        // Render each XY coordinate as a point along the two axes
    }; //safeguard
    
    return(

    <div id="outputGraphContainer" className="border-2 border-gray-200 border-solid">
        <canvas id="outputGraph" ref={ref}></canvas>
    </div>
        
    );
};