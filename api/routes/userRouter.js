const express = require('express');
const multer = require('multer');
const upload = multer();

const router = express.Router();
const uploadAvatarPostHandler = require('../handlers/userHandlers/avatarUploadPostHandler');

router.post('/:id/avatar', upload.single('image'), uploadAvatarPostHandler);
/**
 * @api {post} /api/users/:id/avatar  Upload Avatar
 * @apiName Upload Avatar
 * @apiGroup User
 *
 * @apiParam {Object} file image file
 * @apiParam {String} id User's id
 *
 *
 * @apiSuccess (200) {Object} Success-response Success response with no data
 *
 * @apiSuccessExample {Object} Success response example:
 * HTTP/1.1 200 OK
 * {
 * success: true,
 * payload: null,
 * status: "200 OK",
 * }
 * @apiError {Object} Error-response Error when image uploading failed
 *
 * @apiErrorExample {Object} Error response example:
 *     HTTP/1.1 400 Bad request
 * {
 *      success: false,
 *      payload: null,
 *      error: { status: "400 Bad request", message: "Image upload was failed!"}
 * }
 */

module.exports = router;
