const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

require('dotenv').config();
const s3 = new aws.S3({
    region         : process.env.AWS_REGION,
    accessKeyId    : process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp', '.gif'];

const uploadImage = multer({
    storage: multerS3({
        s3         : s3,
        bucket     : 'karyl',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key        : (req, file, callback) => {
            const today = new Date();
            const currentYear = today.getFullYear();
            const currentMonth = today.getMonth() + 1;
            const currentDate = today.getDate();
            const currentHour = today.getHours();
            const currentMinute = today.getMinutes();
            const currentSecond = today.getSeconds();
            const date = `${currentYear}-${currentMonth}-${currentDate}-${currentHour}-${currentMinute}-${currentSecond}`;
            
            let randomNumber = '';
            for (let i = 0; i < 4; i++) {
                randomNumber += String(Math.floor(Math.random() * 10));
            }
            
            const extension = path.extname(file.originalname).toLowerCase();
            if (!allowedExtensions.includes(extension)) {
                return callback(new Error('확장자 에러'));
            }
            const photo_ip = `https://karyl.s3.ap-northeast-2.amazonaws.com/folder/${date}_${randomNumber}`
            req.photo_ip = photo_ip;

            callback(null, `folder/${date}_${randomNumber}`);
        },
        acl        : 'public-read'
    }),
    limits: {
        fileSize: 25 * 1024 * 1024
    }
}); 

module.exports = uploadImage;