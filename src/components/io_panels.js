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

    const handleSubmit = async (event) => {
        await event.preventDefault(); // stops page reload
        
        // await setIsFormattedCorrectly(false)

        // Compute final time
        let final_time = (parseFloat(dataToCompute.goal_hours) * 360) + (parseFloat(dataToCompute.goal_minutes) * 60) + (parseFloat(dataToCompute.goal_seconds));
        let final_time_display;
        let final_time_seconds = dataToCompute.goal_seconds;
        let final_time = (Math.abs(parseFloat(dataToCompute.goal_hours) * 3600)) + (Math.abs(parseFloat(dataToCompute.goal_minutes) * 60)) + (Math.abs(parseFloat(dataToCompute.goal_seconds)));
        let final_time_display = formatTime(final_time)[1];

        let final_average_split = 0;
        if (dataToCompute.piece_distance > 0) {
            final_average_split = Math.abs((final_time / dataToCompute.piece_distance) * 500);
        }

        let final_average_split_display = formatTime(final_average_split)[1];

        // await is redundant here because despite being asynchronous, React releases control of the code immediately after the setState call before its done
        // And because state updaters don't return promises, we can't use .then() either
        // Left as a learning lesson for the reader
        await setComputedData(
            { ...computedData,
                    final_time: final_time,
                    final_time_display: final_time_display,
                    final_average_split: final_average_split,
                    final_average_split_display: final_average_split_display
                }
        )

        // for key in dataToCompute
            // Set the value to a version with the leading zeroes trimmed

            // To trim zeroes
                // if value is a string type, splice
                // If it's a number, convert to string, splice, then back to number
                // Else nothing

    };

    // SOLUTION
    // Runs *AFTER* computedData updates, as specified
    React.useEffect(() => { console.log(computedData);console.log(dataToCompute) }, [computedData])
    // React.useEffect(() => { console.log(dataToCompute)}, [dataToCompute])

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
                value={dataToCompute.number_of_divisions}
                onChange={handleChange}
            />

            <InputField
                labelText="Goal hours: "
                className="goal-hours"
                name="goal_hours"
                type="number"
                placeholder={0}
                value={dataToCompute.goal_hours}
                onChange={handleChange}
            />

            <InputField
                labelText="Goal minutes: "
                className="goal-minutes"
                name="goal_minutes"
                type="number"
                placeholder={6}
                value={dataToCompute.goal_minutes}
                onChange={handleChange}
            />

            <InputField
                labelText="Goal seconds: "
                className="goal-seconds"
                name="goal_seconds"
                type="number"
                placeholder={34}
                value={dataToCompute.goal_seconds}
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