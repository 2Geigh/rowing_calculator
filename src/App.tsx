import InputPanel from './components/InputPanel.js';
import OutputPanel from './components/OutputPanel.js';
import { useState } from 'react';
import type { FC } from 'react';
import './App.css';

console.log('Hi mom');

// Get the inputs

// remove event listeners from the input form button

// Add event listener to input form button to wrangle outputs

// Create the function that draws the output once the input is calculated

// Function for computing the outputs

const App: FC = () => {

    type InputData = {
        piece_distance: number | string,
        number_of_divisions: number | string,
        goal_hours: number | string,
        goal_minutes: number | string,
        goal_seconds: number | string,
    }

    type OutputData = {
        final_time: number,
        final_time_display: string,
        final_average_split: number,
        final_average_split_display: string,
        number_of_divisions: number,
        total_distance: number
    }
    

    const [dataToCompute, setDataToCompute] = useState<InputData>({
        piece_distance: '',
        number_of_divisions: '',
        goal_hours: '',
        goal_minutes: '',
        goal_seconds: '',
    });

    const [computedData, setComputedData] = useState<OutputData>({
        final_time: 0,
        final_time_display: '',
        final_average_split: 0,
        final_average_split_display: '',
        number_of_divisions: 0,
        total_distance: 0,
    });

    const [hasInputsBeenSubmitted, setHasInputsBeenSubmitted] = useState<boolean>(false);

    const slowestPermissibleSplit: number = 180; // 3:00 per 500m

    // let [isMouseDown, setIsMouseDown] = useState(false);
    // const handleMouseUp = (event) => {
    //         setIsMouseDown(false);
    //         console.log(`You lifted the mouse!`);
    // }

    return (
        <>
            <InputPanel
                dataToCompute={dataToCompute}
                setDataToCompute={setDataToCompute}

                computedData={computedData}
                setComputedData={setComputedData}

                setHasInputsBeenSubmitted={setHasInputsBeenSubmitted}

                slowestPermissibleSplit={slowestPermissibleSplit}
            />

            <OutputPanel
                computedData={computedData}
                setComputedData={setComputedData}

                hasInputsBeenSubmitted={hasInputsBeenSubmitted}

                slowestPermissibleSplit={slowestPermissibleSplit}

                // isMouseDown={isMouseDown}
                // setIsMouseDown={setIsMouseDown}
            />
        </>
    );
};

export default App;