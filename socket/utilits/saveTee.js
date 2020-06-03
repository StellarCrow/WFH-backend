const {teeValidation} = require('../schemas/tee.schema');
const log4js = require('log4js');
const logger = log4js.getLogger();

const saveTee = (tee, created_by) => {
    const {value, error} = teeValidation.validate({...tee, created_by});

    if (error) return null;

    logger.info('Created tee:', tee);
    return value;
};

module.exports = saveTee;