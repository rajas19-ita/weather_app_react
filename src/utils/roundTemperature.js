const roundTemperature = (temperature) => {
    const roundedToTenth = parseFloat(temperature.toFixed(1));
    const fractionalPart = roundedToTenth % 1;

    if (fractionalPart >= 0.5) {
        return Math.ceil(roundedToTenth);
    } else {
        return Math.floor(roundedToTenth);
    }
};

export default roundTemperature;
