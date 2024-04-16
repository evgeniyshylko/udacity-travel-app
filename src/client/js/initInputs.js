function initializeInputs() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').setAttribute('min', today);
    document.getElementById('endDate').setAttribute('min', today);
    document.querySelector('.trip-info').style.display = 'none';
}

export { initializeInputs };


