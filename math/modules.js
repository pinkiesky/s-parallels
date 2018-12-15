const {
    abs,
    exp
} = Math;


module.exports = {
    m1(dataArray) {
        const sum = 0;

        for (let i = 0; i < dataArray.length - 2; i++) {
            sum += exp(-abs(dataArray[i] - dataArray[i + 1])) * dataArray[i + 2];
        }

        return sum / 10**4;
    }
};
