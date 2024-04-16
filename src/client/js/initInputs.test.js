import { initializeInputs } from './initInputs';

describe('initializeInputs function', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <input id="startDate" />
            <input id="endDate" />
            <div class="trip-info"></div>
        `;
    });

    it('sets the minimum date for startDate and endDate inputs to today', () => {
        const today = new Date().toISOString().split('T')[0];
        initializeInputs();
        
        const startDate = document.getElementById('startDate');
        const endDate = document.getElementById('endDate');

        expect(startDate.getAttribute('min')).toBe(today);
        expect(endDate.getAttribute('min')).toBe(today);
    });

    it('hides the .trip-info element', () => {
        initializeInputs();
        const tripInfo = document.querySelector('.trip-info');

        expect(tripInfo.style.display).toBe('none');
    });
});
