const getBiggerArrayLength = (array1, array2) => {
    if (array1.length > array2.length) {
        return array1.length
    } else if (array1.length < array2.length) {
        return array2.length;
    }
    return array1.length;
};

module.exports = getBiggerArrayLength;
