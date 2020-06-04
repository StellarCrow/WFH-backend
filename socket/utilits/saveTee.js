const {teeValidation} = require('../schemas/tee.schema');
const log4js = require('log4js');
const logger = log4js.getLogger();

const saveTee = (tee, room_id, created_by) => {
    const {value, error} = teeValidation.validate({...tee, room_id, created_by});
    if (error) return null;
    return value;
};

module.exports = saveTee;