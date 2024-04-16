import { validateInputs } from './validateInput';

describe('validateInputs function', () => {
    // Mock alert
    let alertSpy;

    beforeEach(() => {
        alertSpy = jest.spyOn(window, 'alert').mockImplementation();
    });

    afterEach(() => {
        alertSpy.mockRestore();
    });

    it('alerts an error if the city is empty', () => {
        validateInputs('', '2023-04-10', '2023-04-15');
        expect(alertSpy).toHaveBeenCalledWith("Please select your desired destination!\n");
    });

    it('alerts an error if the start date is empty', () => {
        validateInputs('New York', '', '2023-04-15');
        expect(alertSpy).toHaveBeenCalledWith("Please select your start date!\n");
    });

    it('alerts an error if the end date is empty', () => {
        validateInputs('New York', '2023-04-10', '');
        expect(alertSpy).toHaveBeenCalledWith("Please select your end date!\n");
    });

    it('alerts an error if the end date is before the start date', () => {
        validateInputs('New York', '2023-04-15', '2023-04-10');
        expect(alertSpy).toHaveBeenCalledWith("End date must be after the start date!\n");
    });

    it('does not alert an error when all inputs are valid and end date is after start date', () => {
        validateInputs('New York', '2023-04-10', '2023-04-15');
        expect(alertSpy).not.toHaveBeenCalled();
    });

    it('alerts multiple errors when city and dates are empty', () => {
        validateInputs('', '', '');
        expect(alertSpy).toHaveBeenCalledWith(
            "Please select your desired destination!\n" +
            "Please select your start date!\n" +
            "Please select your end date!\n"
        );
    });
});
