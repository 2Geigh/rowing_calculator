const trimLeadingZeroes = (n) => {
    /* Used to trim the leading zeroes off of a number

    >>> trimLeadingZeroes(0001);
    1

    >>> trimLeadingZeroes("08");
    "08"

    >>> trimLeadingZeroes("9245378257");
    9245378257

    >>> trimLeadingZeroes(0)
    0
    */

    // Check type first
    let was_string = true;
    let string_num = n;
    if (typeof(n) === "number") {
        was_string = false;
        string_num = JSON.stringify(n);
    }
    string_num = string_num.trim();

    // No point in trimming if the input is only length 1
    if (string_num.length <= 1) {
        return(n);
    }

    // No point in trimming if the input's first digit is not 0
    if (string_num[0] != 0) {
        return(n);
    }

    while (string_num[0] == 0) {
        string_num = string_num.slice(1)
    }

    if (was_string) {
        return(n);
    }
    else {
        return(Number(n))
    }

};