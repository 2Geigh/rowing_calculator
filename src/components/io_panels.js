const InputPanel = () => {
    return (
        <form id="input">
            <div className="piece-distance-input">
                <label htmlFor="piece_distance">Distance of piece (m): </label>
                <input name="piece_distance" type="number" placeholder={2000} />
            </div>
            <div className="number-of-divisions-input">
                <label htmlFor="number_of_divisions">Number of piece divisions: </label>
                <input name="number_of_divisions" type="number" placeholder={4} />
            </div>
            <div className="goal-time-input">
                <label htmlFor="goal_time">Goal time: </label>
                <input name="goal_time_hours" type="number" placeholder="Hour" />:
                <input name="goal_time_minutes" type="number" placeholder="Minutes" />:
                <input name="goal_time_seconds" type="number" placeholder="Seconds" />
            </div>
            <input type="submit" defaultValue="Compute" />
        </form>
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