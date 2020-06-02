const getBiggerArrayLength = require('./getBiggerArrayLength');
const createPairs = (room) => {
    const pairs = [];
    const {pictures, phrases} = room[0];
    const biggerLength = getBiggerArrayLength(pictures, phrases);

    for (let i = 0; i < biggerLength; i++) {
        pairs.push({
            picture: pictures[i] || null,
            phrase: phrases[i] || null
        })
    }
    return pairs;
};
module.exports = createPairs;
