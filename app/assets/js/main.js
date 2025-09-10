console.log('Hi mom');

// Get the inputs

// remove event listeners from the input form button

// Add event listener to input form button to wrangle outputs

// Create the function that draws the output once the input is calculated

// Function for computing the outputs

const App = () => {
    
    const [dataToCompute, setDataToCompute] = React.useState({
        piece_distance: "",
        number_of_divisions: "",
        goal_hours: "",
        goal_minutes: "",
        goal_seconds: "",
    });

    const [computedData, setComputedData] = React.useState({
        final_time: "",
        final_time_display: "",
        final_average_split: "",
        final_average_split_display: "",
    });

    const [hasInputsBeenSubmitted, setHasInputsBeenSubmitted] = React.useState(false);

    return (
        <>
            <InputPanel
                dataToCompute={dataToCompute}
                setDataToCompute={setDataToCompute}

                computedData={computedData}
                setComputedData={setComputedData}

                setHasInputsBeenSubmitted={setHasInputsBeenSubmitted}
            />

            <OutputPanel
                computedData={computedData}

                hasInputsBeenSubmitted={hasInputsBeenSubmitted}
            />
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);