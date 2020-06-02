const AWS = require('aws-sdk');
const config = require('config');

const keys = config.get('AWS');

const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME || keys.BUCKET_NAME;
const AWS_REGION = process.env.AWS_REGION || keys.REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || keys.accessKeyId;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || keys.secretAccessKey;

class Storage {
    constructor() {
        this.S3 = new AWS.S3({
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
            region: AWS_REGION,
        });
    }

    async upload(buffer, path) {
        const key = path;
        const params = {
            Bucket: AWS_BUCKET_NAME,
            Key: key,
            Body: buffer,
        };

        try {
            return await this.S3.upload(params).promise();
        } catch (err) {
            throw new Error(err.message);
        }
    }


    async saveCanvasImage(base64, pictureNumber, socketID, room) {
        const imageBuffer = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        const type = base64.split(';')[0].split('/')[1];
        const params = {
            Bucket: AWS_BUCKET_NAME,
            Key: `pictures/${room}/${socketID}.${pictureNumber}.${type}`,
            Body: imageBuffer,
            ContentEncoding: 'base64',
            ContentType: `image/${type}`
        };
        try {
            return await this.S3.upload(params).promise();
        } catch (err) {
            throw new Error(err.message);
        }
    }

  async getDefaultAvatarList(prefix) {
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Prefix: prefix
    }

    try {
      const res = await this.S3.listObjectsV2(params).promise();
      return res.Contents.slice(1).map(item => {
        return item.Key;
      });
    } catch (err) {
      throw new Error(err.message);
    }

  }

}

module.exports = new Storage();
