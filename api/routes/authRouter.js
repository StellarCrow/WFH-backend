/* eslint-disable import/no-unresolved */
const express = require('express');

const router = express.Router();

const registerPostHandler = require('@authHandlers/registerPostHandler');
const loginPostHandler = require('@authHandlers/loginPostHandler');

router.post('/register', registerPostHandler);
/**
 * @api {post} /api/auth/register  User registration
 * @apiName Registration
 * @apiGroup User
 *
 * @apiParam {Object} UserData User's data for registration
 *
 * @apiExample {Object} Object with user data for registration example:
 *{
 * "email": "sometest@tmail.com",
 * "password": "pasSw0rD@",
 * "firstName": "Andre",
 * "lastName": "Santiago"
 *}
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
 * @apiError {Object} Error-response Error when registration failed
 *
 * @apiErrorExample {Object} Error response example:
 *     HTTP/1.1 400 Bad request
 * {
 *      success: false,
 *      payload: null,
 *      error: { status: "400 Bad request", message: "Registration was failed!"}
 * }
 */

router.post('/login', loginPostHandler);
/**
 * @api {post} /api/auth/login  User login
 * @apiName Login
 * @apiGroup User
 *
 * @apiParam {Object} Credential User's credential
 *
 * @apiExample {Object} Object with user's credential example:
 *{
 * "email": "sometest@tmail.com",
 * "password": "pasSw0rD@",
 *}
 *
 * @apiSuccess (200) {Object} Success-response Success response with  JWT token contained user id
 *
 * @apiSuccessExample {Object} Success response example:
 * HTTP/1.1 200 OK
 * {
 * success: true,
 * payload: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjVlYmQxMzZmMTVkZWI4NTQ4MmNhMjY4M
 * SIsImlhdCI6MTU4OTc5MTk3OCwiZXhwIjoxNTg5ODc4Mzc4fQ.VQAQ4oD9-MHDxcYcL2Aj4WuUQ3BS9rA-4SuDlklEnEI",
 * status: "200 OK",
 * }
 * @apiError {Object} Error-response Login failed
 *
 * @apiErrorExample {Object} Error response example:
 *     HTTP/1.1 400 Bad request
 * {
 *      success: false,
 *      payload: null,
 *      error: { status: "400 Bad request", message: "Login failed. Can no find such user!"}
 * }
 */

module.exports = router;
