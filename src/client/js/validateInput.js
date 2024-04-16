function validateInputs(city, startDate, endDate) {
    let errorMessage = "";

    if (city === null || city === '') {
        errorMessage += "Please select your desired destination!\n";
    }
    if (startDate === null || startDate === '') {
        errorMessage += "Please select your start date!\n";
    }
    if (endDate === null || endDate === '') {
        errorMessage += "Please select your end date!\n";
    }
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end <= start) {
            errorMessage += "End date must be after the start date!\n";
        }
    }
    if (errorMessage !== "") {
        alert(errorMessage);
    }
}

export { validateInputs };


