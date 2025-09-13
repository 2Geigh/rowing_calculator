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

export default InputField;