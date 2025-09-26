const formatTime = (total_time_in_seconds) => {
    /*
    INPUT MUST BE A NUMBER.

    Returns a 2-element array.
    Element 1 is a 3-element array corresponding to the hours, minutes, and remaining seconds
    Element 2 is a string with the elements of the first array displayed as if on a Concept2 ergometer
    
    >>> formatTime(60)
    [[0,1,0],'1:00']

    >>> formatTime(440)
    [[0,7,20],'7:00']

    >>> formatTime(3601)
    [[1,0,1],'1:00:01']
    
    */
    
    let hours = Math.floor(total_time_in_seconds / 3600); // Calculate hours
    let seconds = total_time_in_seconds % 3600; // Remaining seconds after extracting hours
    let minutes = Math.floor(seconds / 60); // Calculate minutes
    seconds %= 60; // Remaining seconds after extracting minutes


    // Format the display string
    let time_display;
    let display_minutes = minutes;
    let display_seconds = Math.floor(seconds);

    if (seconds < 10) {
        display_seconds = `0${display_seconds}`;
    }

    time_display = `${display_minutes}:${display_seconds}`;

    if (hours > 0) {
        if (minutes > 0 && minutes < 10) { // Ex: 1:08:00
            display_minutes = `0${minutes}`
        }

        else if (minutes === 0) { // Ex: 1:00:00
            display_minutes = `00`;
        }

        time_display = `${hours}:${display_minutes}:${display_seconds}`;
    }

    return [[hours, minutes, seconds], time_display]
}

export default formatTime;