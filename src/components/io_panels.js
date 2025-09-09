const InputField = (props) => {
    return (
        <div className={props.className}>
            <label htmlFor={props.name}>{props.labelText}</label>

            <input
                name={props.name}
                type={props.type}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
            />
        </div>
    );
}

const InputPanel = ( { dataToCompute, setDataToCompute, computedData, setComputedData } ) => {

    const handleChange = (e) => {
        // e is the event
        // ...dataToCompute is creating a new object with all the elements of dataToCompute, because React states are immutable
        // We're copying the original state with ...dataToCompute so that when one field's value changes, the rest of the state remains in tact
        setDataToCompute(
            // e.target is the element that fired the event (the <input>)
            // [] tells JS to use the value inside it as the name of the key that we're overwriting (in this case, use e.target.name as the name of the key)
            {...dataToCompute, [e.target.name]: Math.abs(e.target.value)}
        );
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // stops page reload

        // Compute final time
        let final_time = (parseFloat(dataToCompute.goal_hours) * 360) + (parseFloat(dataToCompute.goal_minutes) * 60) + (parseFloat(dataToCompute.goal_seconds));
        let final_time_display;
        if (Math.floor(dataToCompute.goal_hours) > 0) {
            final_time_display = `${dataToCompute.goal_hours}:${dataToCompute.goal_minutes}:${dataToCompute.goal_seconds}`;
        } 
        else if (Math.floor(dataToCompute.goal_minutes) > 0) {
            final_time_display = `${dataToCompute.goal_minutes}:${dataToCompute.goal_seconds}`;
        }
        else {
            final_time_display = `${dataToCompute.goal_seconds}`;
        }

        // Compute final average split
        // H:M:S (/ 500)

        let final_average_split = (final_time / dataToCompute.piece_distance) * 500;
        let final_average_split_display;

        let final_average_split_hours = Math.floor((final_average_split / 60) / 60);
        let final_average_split_minutes = Math.floor(final_average_split / 60);
        let final_average_split_seconds = final_average_split % 60;

        if (Math.floor(final_average_split_hours > 0)) {
            final_average_split_display = `${final_average_split_hours}:${final_average_split_minutes}:${final_average_split_seconds}`;
        }
        else if (Math.floor(final_average_split_minutes > 0)) {
            final_average_split_display = `${final_average_split_minutes}:${final_average_split_seconds}`;
        }
        else {
            final_average_split_display = `0:${final_average_split_seconds}`;
        }

        


        // Compute split 
        console.log(final_average_split_display);

        // Update state
        setComputedData(
            { ...computedData,
                    final_time: final_time,
                    final_time_display: final_time_display,
                    final_average_split: final_average_split,
                    final_average_split_display: final_average_split_display
                }
        )

        setInterval(console.log(computedData), 5000);
    };

    return (
        <>
        <form id="input" onSubmit={handleSubmit}>

            <InputField
                labelText="Distance of piece (m): "
                className="piece-distance-input"
                name="piece_distance"
                type="number"
                placeholder={2000}
                value={dataToCompute.piece_distance}
                onChange={handleChange}
            />

            <InputField
                labelText="Number of divisions of piece: "
                className="number-of-divisions-input"
                name="number_of_divisions"
                type="number"
                placeholder={4}
                onChange={handleChange}
            />

            <InputField
                labelText="Goal hours: "
                className="goal-hours"
                name="goal_hours"
                type="number"
                placeholder={0}
                onChange={handleChange}
            />

            <InputField
                labelText="Goal minutes: "
                className="goal-minutes"
                name="goal_minutes"
                type="number"
                placeholder={6}
                onChange={handleChange}
            />

            <InputField
                labelText="Goal seconds: "
                className="goal-seconds"
                name="goal_seconds"
                type="number"
                placeholder={34}
                onChange={handleChange}
            />

            <input type="submit" defaultValue="Compute" />
        </form>
        </>
    );
};

const OutputPanel = () => {
    return (
        <article id="output">
            <span id="final-time">Goal final time:</span>
            <span id="final-average-split">Goal average split:</span>
            {/* <span id="final-divisional-split">Final split per division:</span> */}
        </article>
    );
};