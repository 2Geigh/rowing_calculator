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

const InputPanel = ( { dataToCompute, setDataToCompute } ) => {

    const handleChange = (e) => {
        // e is the event
        // ...dataToCompute is creating a new object with all the elements of dataToCompute, because React states are immutable
        // We're copying the original state with ...dataToCompute so that when one field's value changes, the rest of the state remains in tact
        setDataToCompute(
            // e.target is the element that fired the event (the <input>)
            // [] tells JS to use the value inside it as the name of the key that we're overwriting (in this case, use e.target.name as the name of the key)
            {...dataToCompute, [e.target.name]: e.target.value}
        );
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // stops page reload

        console.log(dataToCompute.piece_distance);

        console.log("Submitted successfully.");
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
            <span id="final-divisional-split">Final split per division:</span>
        </article>
    );
};