import InputPanel from './components/InputPanel.jsx';
import OutputPanel from './components/OutputPanel';
import { useState } from 'react';
import './App.css';

console.log('Hi mom');

// Get the inputs

// remove event listeners from the input form button

// Add event listener to input form button to wrangle outputs

// Create the function that draws the output once the input is calculated

// Function for computing the outputs

const App = () => {
    
    const [dataToCompute, setDataToCompute] = useState({
        piece_distance: "",
        number_of_divisions: "",
        goal_hours: "",
        goal_minutes: "",
        goal_seconds: "",
    });

    const [computedData, setComputedData] = useState({
        final_time: "",
        final_time_display: "",
        final_average_split: "",
        final_average_split_display: "",
        number_of_divisions: "",
        total_distance: "",
    });

    const [hasInputsBeenSubmitted, setHasInputsBeenSubmitted] = useState(false);

    const slowestPermissibleSplit = 180; // 3:00 / 500m

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