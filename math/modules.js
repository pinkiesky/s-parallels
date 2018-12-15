const {
    abs,
    exp,
    log10,
} = Math;


module.exports = {
    m1(dataArray) {
        let sum = 0;

        for (let i = 0; i < dataArray.length - 2; i += 1) {
            sum += exp(-abs(dataArray[i] - dataArray[i + 1])) * dataArray[i + 2];
        }

        return sum / (10 ** 4);
    },
    m2(dataArray) {
        let sum = 0;

        for (let i = 0; i < dataArray.length - 1; i += 1) {
            const d = ((dataArray[i] - dataArray[i + 1]) ** 2) + 1;
            sum += log10(1 / d);
        }

        return sum;
    },
    m3(dataArray) {
        let sum = 0;

        for (let i = 0; i < dataArray.length - 2; i += 1) {
            sum *= -(dataArray[i] ** 2) - (dataArray[i + 1] ** 3) + dataArray[i + 2];
        }

        return sum;
    },
    m4(dataArray) {
        let sum = 0;

        for (let i = 0; i < dataArray.length; i += 1) {
            sum += exp(dataArray[i] ** 3);
        }

        return sum / (10 ** 5);
    },
};
