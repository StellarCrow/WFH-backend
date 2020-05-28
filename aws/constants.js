const config = require('config');
const keys = config.get('AWS');
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME || keys.BUCKET_NAME;
const AWS_REGION = process.env.AWS_REGION || keys.REGION;

const pathToDefaultAvatars = 'defaults/avatars/';
const amazonBucketPath = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/`;

module.exports = {pathToDefaultAvatars, amazonBucketPath};
