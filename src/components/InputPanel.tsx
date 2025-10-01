import InputField from './InputField.js';
import formatTime from '../utils/timeFormat.js'
import trimLeadingZeroes from '../utils/validation.js';

import type { InputData, OutputData } from '../App.js';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';

type Props = {
    dataToCompute: InputData,
    setDataToCompute: Dispatch<SetStateAction<InputData>>,

    computedData: OutputData,
    setComputedData: Dispatch<SetStateAction<OutputData>>,

    setHasInputsBeenSubmitted: Dispatch<SetStateAction<boolean>>,

    slowestPermissibleSplit: number
};

const InputPanel = ( {
                        dataToCompute,
                        setDataToCompute,
                        computedData,
                        setComputedData,
                        setHasInputsBeenSubmitted,
                        slowestPermissibleSplit
                    } : Props ) => {

    const handleChange = (e : ChangeEvent) => {
        // e is the event
        // ...dataToCompute is creating a new object with all the elements of dataToCompute, because React states are immutable
        // We're copying the original state with ...dataToCompute so that when one field's value changes, the rest of the state remains in tact
        let target_name: string;
        let target_value: number;

        if (e.target != null) {
            target_name = e.target.className;
            target_value = e.target.value;
        }
        setDataToCompute(
            // e.target is the element that fired the event (the <input>)
            // [] tells JS to use the value inside it as the name of the key that we're overwriting (in this case, use e.target.name as the name of the key)
            {...dataToCompute, [e.target.name]: Math.abs(e.target.value)}
        );
    };

    const handleSubmit = async (event: Event) => {
        await event.preventDefault(); // stops page reload
        
        // await setIsFormattedCorrectly(false)
        const PIECE_DISTANCE = Number(dataToCompute.piece_distance);
        const GOAL_HOURS = Number(dataToCompute.goal_hours);
        const GOAL_MINUTES = Number(dataToCompute.goal_minutes);
        const GOAL_SECONDS = Number(dataToCompute.goal_seconds);
        const NUMBER_OF_DIVISIONS = Number(dataToCompute.number_of_divisions);

        // Compute final time
        let final_time = (Math.abs(GOAL_HOURS * 3600)) + (Math.abs(GOAL_MINUTES * 60)) + (Math.abs(GOAL_SECONDS));
        isNaN(final_time) ? final_time = 0 : final_time;
        let final_time_display = formatTime(final_time)[1];

        let final_average_split = 0;
        if (PIECE_DISTANCE > 0) {
            final_average_split = Math.abs((final_time / PIECE_DISTANCE) * 500);
        }

        const INPUT_SPLIT_TOO_SLOW = (final_average_split >= slowestPermissibleSplit);
        
        if (INPUT_SPLIT_TOO_SLOW) {
            window.alert("Goal split must be faster than 3:00 / 500m.")
            return;
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
                    final_average_split_display: final_average_split_display,
                    number_of_divisions: NUMBER_OF_DIVISIONS,
                    total_distance: PIECE_DISTANCE,
                }
        )

        // Clean input fields
        let cleaned_dataToCompute: any = {} 
        for (const key in dataToCompute) {
            cleaned_dataToCompute[key] = trimLeadingZeroes(dataToCompute[key]);
        }
        setDataToCompute(cleaned_dataToCompute);

        setHasInputsBeenSubmitted(true);
    };

    // SOLUTION
    // Runs *AFTER* computedData updates, as specified
    // React.useEffect(() => { console.log(computedData);console.log(dataToCompute) }, [computedData])

    return (
        <>
        <form
            id="input"
            onSubmit={handleSubmit}
            className="bg-gray-300 border-solid border-2 border-gray-400 p-2 max-w-lg flex flex-col items-center justify-center rounded"
        >

            <InputField
                labelText="Distance of piece (m): "
                className="piece_distance_input"
                name="piece_distance"
                type="number"
                placeholder={2000}
                value={Number(dataToCompute.piece_distance)}
                onChange={handleChange}
            />

            <InputField
                labelText="Number of divisions of piece: "
                className="number_of_divisions"
                name="number_of_divisions"
                type="number"
                placeholder={4}
                value={Number(dataToCompute.number_of_divisions)}
                onChange={handleChange}
            />

            <InputField
                labelText="Goal hours: "
                className="goal_hours"
                name="goal_hours"
                type="number"
                placeholder={0}
                value={Number(dataToCompute.goal_hours)}
                onChange={handleChange}
            />

            <InputField
                labelText="Goal minutes: "
                className="goal_minutes"
                name="goal_minutes"
                type="number"
                placeholder={6}
                value={Number(dataToCompute.goal_minutes)}
                onChange={handleChange}
            />

            <InputField
                labelText="Goal seconds: "
                className="goal_seconds"
                name="goal_seconds"
                type="number"
                placeholder={34}
                value={Number(dataToCompute.goal_seconds)}
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

export default InputPanel;