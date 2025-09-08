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

const InputPanel = () => {
    return (
        <>
        <form id="input" onSubmit={handleSubmit}>

            <InputField
                labelText="Distance of piece (m): "
                className="piece-distance-input"
                name="piece_distance"
                type="number"
                placeholder={2000}
                value={formData.piece_distance}
                onChange={handleChange}
            />

            <InputField
                labelText="Number of divisions of piece: "
                className="number-of-divisions-input"
                name="number_of_divisions"
                type="number"
                placeholder={4}
            />

            <InputField
                labelText="Goal hours: "
                className="goal-hours"
                name="goal_hours"
                type="number"
                placeholder={0}
            />

            <InputField
                labelText="Goal minutes: "
                className="goal-minutes"
                name="goal_minutes"
                type="number"
                placeholder={6}
            />

            <InputField
                labelText="Goal seconds: "
                className="goal-seconds"
                name="goal_seconds"
                type="number"
                placeholder={34}
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