import arrayMean from "ml-array-mean";
import formatTime from "../../timeFormat";

const detectIfCursorIsWithinGraphingBounds = (event) => {
    let svg_hitbox = document.getElementById("outputGraph").getBoundingClientRect();

    let mouseY_absolute = event.clientY;
    mouseY_relative.current = mouseY_absolute - svg_hitbox.top - margin.top;

    const svg_height = height;
    mousePercentage = mouseY_relative.current / svg_height * 100;

    let mouseIsWithinVerticalBounds = (mouseY_relative.current >= 0) && (mouseY_absolute <= (svg_hitbox.bottom - margin.bottom));
    mouseIsWithinBounds = mouseIsWithinVerticalBounds // This is here for if you want to implement horizontal bounds in the future

    if (mouseIsWithinBounds && isMouseDraggingPointOnPlot.current) {
        // while (isMouseDraggingPointOnPlot) {
            setBarAndCircleHeights({...BarAndCircleHeights, [pointThatsBeingDraggedByTheUser.current]: mouseY_relative.current});
            
            // UPDATE COMPUTED DATA
            // const [computedData, setComputedData] = useState({
            //     final_time: "",
            //     final_time_display: "",
            //     final_average_split: "",
            //     final_average_split_display: "",
            //     number_of_divisions: "",
            //     total_distance: "",
            // });
            
            let plotted_circles = document.getElementsByClassName("plotted_circle");
            let plotted_circles_y_values = [];
            let circle_height_proportions = [];
            let plotted_circles_splits = [];

            console.clear();
            // Get the height values of every circle in the plot
            for (let i=0; i<plotted_circles.length; i++) {
                plotted_circles_y_values.push(plotted_circles[i].cy.animVal.value);
            }

            // Convert all the height values into splits
            for (let i=0; i<plotted_circles_y_values.length; i++) {
                circle_height_proportions.push(plotted_circles_y_values[i] / svg_height);
            }
            console.log(`%`)
            console.log(circle_height_proportions)


            // THE ISSUE LIES IN THIS FOR LOOP
            for (let i=0; i<circle_height_proportions.length; i++) {
                plotted_circles_splits.push(circle_height_proportions[i] * slowestPermissibleSplit);
            }
            console.log(plotted_circles_splits);

            // Compute the average final split from them
            new_final_average_split = arrayMean(plotted_circles_splits);
            console.log(`new_final_average_split: ${new_final_average_split}`);

            // Recompute final time from the new average final split
            new_final_time = new_final_average_split * total_distance / 500;
            console.log(`new_final_time: ${formatTime(new_final_time)[1]}`);
            // setComputedData({...computedData,
            //                     final_time : new_final_time,
            //                     final_time_display : formatTime(new_final_time)[1]
            //                 })
        // }
    }

    else if (!mouseIsWithinVerticalBounds) {
        isMouseDraggingPointOnPlot.current = false;
        handleMouseUp_CIRCLE();
    }

    // if (mouseIsWithinBounds) {

    //     console.clear();            
    //     console.log(`You're hovering at ABS y=${mouseY_absolute}`)
    //     console.log(`You're hovering at REL y=${mouseY_relative.current}`)
    //     console.log(`${mousePercentage}%`)
    //     console.log(`mouseIsWithinBounds: ${mouseIsWithinBounds}`)
    // }
    // else {
    //     console.clear();
    //     console.log(`Cursor is not within graphing bounds.`)
    //     console.log(`${mousePercentage}%`)
    // }

};

export default detectIfCursorIsWithinGraphingBounds;