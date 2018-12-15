const {
    abs,
    exp,
    log10
} = Math;


module.exports = {
    m1(dataArray) {
        const sum = 0;

        for (let i = 0; i < dataArray.length - 2; i++) {
            sum += exp(-abs(dataArray[i] - dataArray[i + 1])) * dataArray[i + 2];
        }

        return sum / 10**4;
    },
    m2(dataArray) {
        const sum = 0;

        for (let i = 0; i < dataArray.length - 1; i++) {
            sum += log10(1 / ((dataArray[i] - dataArray[i + 1])**2 + 1));
        }

        return sum;
    },
    m3(dataArray) {
        const sum = 0;

        for (let i = 0; i < dataArray.length - 2; i++) {
            sum *= -(dataArray[i]**2) - dataArray[i + 1]**3 + dataArray[i + 2];
        }

        return sum;
    },
    m4(dataArray) {
        const sum = 0;

        for (let i = 0; i < dataArray.length; i++) {
            sum += exp(dataArray[i]**3);
        }

        return sum / 10 ** 5;
    },
};
