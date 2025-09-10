const InputField = (props) => {
    return (
        <div className={`${props.className} flex justify-between rounded items-center bg-gray-200 block m-3 p-2 w-100`}>
            <label htmlFor={props.name}>{props.labelText}</label>

            <input

                className={`bg-white w-20 text-center rounded p-1`}

                name={props.name}
                type={props.type}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}

                style={{ 
                    'MozAppearance': 'textfield', // For Firefox
                    'appearance': 'none' // For other browsers
                    }}
            />
        </div>
    );
}

const InputPanel = ( { dataToCompute, setDataToCompute, computedData, setComputedData, setHasInputsBeenSubmitted } ) => {

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
        let final_time = (Math.abs(parseFloat(dataToCompute.goal_hours) * 3600)) + (Math.abs(parseFloat(dataToCompute.goal_minutes) * 60)) + (Math.abs(parseFloat(dataToCompute.goal_seconds)));
        isNaN(final_time) ? final_time = 0 : final_time;
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

        // Clean input fields
        let cleaned_dataToCompute = {} 
        for (const key in dataToCompute) {
            cleaned_dataToCompute[key] = trimLeadingZeroes(dataToCompute[key]);
        }
        setDataToCompute(cleaned_dataToCompute);

        setHasInputsBeenSubmitted(true);
    };

    // SOLUTION
    // Runs *AFTER* computedData updates, as specified
    React.useEffect(() => { console.log(computedData);console.log(dataToCompute) }, [computedData])
    // React.useEffect(() => { console.log(dataToCompute)}, [dataToCompute])

    return (
        <>
        <form
            id="input"
            onSubmit={handleSubmit}
            className="bg-gray-300 border-solid border-2 border-gray-400 p-2 max-w-lg flex flex-col items-center justify-center rounded"
        >

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

            <input
                type="submit"
                defaultValue="Compute"
                className={`bg-gray-50 w-100 mb-3 rounded`}
            />
        </form>
        </>
    );
};

const OutputPanel = ( {computedData, hasInputsBeenSubmitted} ) => {

    if (hasInputsBeenSubmitted) {
        return (
        <article
            id="output"
            className={`bg-gray-300 border-solid border-2 border-gray-400 p-2 max-w-lg flex flex-col items-center justify-center rounded`}>
            <span id="final-time">Goal final time: {computedData.final_time_display}</span>
            <span id="final-average-split">Goal average split: {computedData.final_average_split_display}</span>
            {/* <span id="final-divisional-split">Final split per division:</span> */}
        </article>
    );
    }
};