const AWS = require('aws-sdk');
const keys = require('config').AWS;
const BUCKET_NAME = keys.BUCKET_NAME;
const AWS_REGION = keys.REGION;


class Storage {
    constructor() {
        this.S3 = new AWS.S3({
            accessKeyId: keys.accessKeyId,
            secretAccessKey: keys.secretAccessKey,
            region: AWS_REGION,
        });
    }

    //return object with Location (url to the uploaded media) that can be stored in DB and used for
    //retrieving media
    async upload(file, user) {
        const key = `${user}/avatar/${user}.jpg`;
        const params = {
            Bucket: BUCKET_NAME,
            Key: key,
            Body: file.buffer,
        };

        try {
            return await this.S3.upload(params).promise();
        } catch (err) {
            throw new Error(err.message);
        }
    }
}

module.exports = new Storage();
