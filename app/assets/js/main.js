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
        goal_time_hours: "",
        goal_time_minutes: "",
        goal_time_seconds: "",
    });

    return (
        <>
            <InputPanel dataToCompute={dataToCompute} setDataToCompute={setDataToCompute}/>
            <OutputPanel dataToCompute={dataToCompute}/>
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);