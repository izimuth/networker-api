"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var express_1 = require("express");
var bcrypt_1 = require("bcrypt");
var sql_1 = require("../db/sql");
var users_1 = require("../users");
var client_s3_1 = require("@aws-sdk/client-s3");
var router = express_1["default"].Router();
// retrieve user profile
router.get('/:id', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, following, result, fields, numFollowers, err_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
                user = void 0;
                following = false;
                if (!(req.params.id == 'self')) return [3 /*break*/, 1];
                user = req.user;
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, (0, sql_1["default"])(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT * FROM users WHERE is_visible = 't' AND is_active = 't' AND shareable_code = ", ""], ["SELECT * FROM users WHERE is_visible = 't' AND is_active = 't' AND shareable_code = ", ""])), req.params.id)];
            case 2:
                result = _c.sent();
                // if found use that result
                if (result.length > 0) {
                    user = result[0];
                    // is auth'd user following the requested one?
                    following = req.user.following.includes(user.id.toString());
                }
                // otherwise return 404
                else {
                    res.status(404);
                    res.send({ error: 'User not found' });
                    return [2 /*return*/];
                }
                _c.label = 3;
            case 3: return [4 /*yield*/, (0, sql_1["default"])(templateObject_2 || (templateObject_2 = __makeTemplateObject(["SELECT * FROM user_fields WHERE user_id = ", " ORDER BY field_name ASC"], ["SELECT * FROM user_fields WHERE user_id = ", " ORDER BY field_name ASC"])), user.id)];
            case 4:
                fields = _c.sent();
                return [4 /*yield*/, (0, sql_1["default"])(templateObject_3 || (templateObject_3 = __makeTemplateObject(["SELECT COUNT(*) AS num_followers FROM users WHERE ", " = ANY(following)"], ["SELECT COUNT(*) AS num_followers FROM users WHERE ", " = ANY(following)"])), user.id)];
            case 5:
                numFollowers = _c.sent();
                res.send({
                    profile: __assign(__assign({}, (0, users_1.getUserJson)(user)), { fields: fields, num_followers: (_b = (_a = numFollowers[0]) === null || _a === void 0 ? void 0 : _a.num_followers) !== null && _b !== void 0 ? _b : 0, num_following: user.following.length }),
                    followed: following
                });
                return [3 /*break*/, 7];
            case 6:
                err_1 = _c.sent();
                next(err_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
// update authenticated user's profile
router.post('/', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var data, fields, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                fields = [];
                // add password to update if specified
                if (data.password) {
                    data.password = bcrypt_1["default"].hashSync(data.password, 10);
                    fields.push('password');
                }
                if (data.display_name)
                    fields.push('display_name');
                if (data.is_visible !== undefined)
                    fields.push('is_visible');
                // update user
                // @ts-ignore
                return [4 /*yield*/, (0, sql_1["default"])(templateObject_4 || (templateObject_4 = __makeTemplateObject(["UPDATE users SET ", " WHERE id = ", ""], ["UPDATE users SET ", " WHERE id = ", ""])), (0, sql_1["default"])(data, fields), req.user.id)];
            case 1:
                // update user
                // @ts-ignore
                _a.sent();
                // we're done!
                res.status(204);
                res.end();
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                next(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// retrieve a field
router.get('/fields/:id', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var field, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, sql_1["default"])(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n\t\t\tSELECT * FROM user_fields WHERE id = ", " AND user_id = ", "\n\t\t"], ["\n\t\t\tSELECT * FROM user_fields WHERE id = ", " AND user_id = ", "\n\t\t"])), req.params.id, req.user.id)];
            case 1:
                field = (_a.sent())[0];
                if (field) {
                    res.send({ field: field });
                }
                else {
                    res.status(404);
                    res.send({ error: 'Field not found' });
                }
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                next(err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// create a new field
router.post('/fields', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var data, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                // create field
                return [4 /*yield*/, (0, sql_1["default"])(templateObject_6 || (templateObject_6 = __makeTemplateObject(["INSERT INTO user_fields ", ""], ["INSERT INTO user_fields ", ""])), (0, sql_1["default"])(__assign(__assign({}, data), { user_id: req.user.id }), 'user_id', 'field_content', 'field_icon_type', 'field_name'))];
            case 1:
                // create field
                _a.sent();
                res.status(204);
                res.end();
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                next(err_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// update existing field
router.put('/fields/:id', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var data, field, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = req.body;
                return [4 /*yield*/, (0, sql_1["default"])(templateObject_7 || (templateObject_7 = __makeTemplateObject(["SELECT * FROM user_fields WHERE id = ", " AND user_id = ", ""], ["SELECT * FROM user_fields WHERE id = ", " AND user_id = ", ""])), req.params.id, req.user.id)];
            case 1:
                field = (_a.sent())[0];
                if (!field) return [3 /*break*/, 3];
                // update field
                return [4 /*yield*/, (0, sql_1["default"])(templateObject_8 || (templateObject_8 = __makeTemplateObject(["UPDATE user_fields SET ", " WHERE id = ", ""], ["UPDATE user_fields SET ", " WHERE id = ", ""])), (0, sql_1["default"])(data, 'field_content', 'field_icon_type', 'field_name'), field.id)];
            case 2:
                // update field
                _a.sent();
                res.status(204);
                res.end();
                return [3 /*break*/, 4];
            case 3:
                res.status(404);
                res.send({ error: 'Field not found' });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_5 = _a.sent();
                next(err_5);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// delete field
router["delete"]('/fields/:id', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, sql_1["default"])(templateObject_9 || (templateObject_9 = __makeTemplateObject(["DELETE FROM user_fields WHERE id = ", " AND user_id = ", ""], ["DELETE FROM user_fields WHERE id = ", " AND user_id = ", ""])), req.params.id, req.user.id)];
            case 1:
                _a.sent();
                res.status(204);
                res.end();
                return [3 /*break*/, 3];
            case 2:
                err_6 = _a.sent();
                next(err_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// upload an avatar
router.post('/photo', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var photoFile, s3Client, bucket, key, prev, err_7;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                if (!((_a = req.files) === null || _a === void 0 ? void 0 : _a.photo))
                    throw new Error('No file specified');
                photoFile = req.files.photo;
                s3Client = new client_s3_1.S3Client({
                    region: process.env.AWS_REGION,
                    credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY,
                        secretAccessKey: process.env.AWS_SECRET_KEY
                    }
                });
                bucket = process.env.AWS_S3_BUCKET;
                key = "avatars/".concat(req.user.shareable_code, "/").concat(photoFile.name);
                prev = req.user.avatar_file;
                if (!prev) return [3 /*break*/, 2];
                return [4 /*yield*/, s3Client.send(new client_s3_1.DeleteObjectCommand({
                        Bucket: bucket,
                        Key: req.user.avatar_file
                    }))];
            case 1:
                _b.sent();
                _b.label = 2;
            case 2: 
            // upload new avatar to S3
            return [4 /*yield*/, s3Client.send(new client_s3_1.PutObjectCommand({
                    Bucket: bucket,
                    Key: key,
                    Body: photoFile.data,
                    ContentType: photoFile.mimetype
                }))];
            case 3:
                // upload new avatar to S3
                _b.sent();
                // update user record
                return [4 /*yield*/, (0, sql_1["default"])(templateObject_10 || (templateObject_10 = __makeTemplateObject(["UPDATE users SET avatar_file = ", " WHERE id = ", ""], ["UPDATE users SET avatar_file = ", " WHERE id = ", ""])), key, req.user.id)];
            case 4:
                // update user record
                _b.sent();
                res.status(204);
                res.end();
                return [3 /*break*/, 6];
            case 5:
                err_7 = _b.sent();
                next(err_7);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// delete avatar
router["delete"]('/photo', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var s3Client, bucket, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!req.user.avatar_file) return [3 /*break*/, 3];
                s3Client = new client_s3_1.S3Client({
                    region: process.env.AWS_REGION,
                    credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY,
                        secretAccessKey: process.env.AWS_SECRET_KEY
                    }
                });
                bucket = process.env.AWS_S3_BUCKET;
                // delete from aws
                return [4 /*yield*/, s3Client.send(new client_s3_1.DeleteObjectCommand({
                        Bucket: bucket,
                        Key: req.user.avatar_file
                    }))];
            case 1:
                // delete from aws
                _a.sent();
                // update user record
                return [4 /*yield*/, (0, sql_1["default"])(templateObject_11 || (templateObject_11 = __makeTemplateObject(["UPDATE users SET avatar_file = '' WHERE id = ", ""], ["UPDATE users SET avatar_file = '' WHERE id = ", ""])), req.user.id)];
            case 2:
                // update user record
                _a.sent();
                _a.label = 3;
            case 3:
                // we're done!
                res.status(204);
                res.end();
                return [3 /*break*/, 5];
            case 4:
                err_8 = _a.sent();
                next(err_8);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// add a user to following list
router.post('/followers', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, updated, err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                id = req.body.id;
                return [4 /*yield*/, (0, sql_1["default"])(templateObject_12 || (templateObject_12 = __makeTemplateObject(["SELECT * FROM users WHERE id = ", ""], ["SELECT * FROM users WHERE id = ", ""])), id)];
            case 1:
                user = (_a.sent())[0];
                // if user not found then return error
                if (!user) {
                    res.status(404);
                    res.send({ error: 'User not found' });
                    return [2 /*return*/];
                }
                if (!!req.user.following.includes(id.toString())) return [3 /*break*/, 3];
                updated = __spreadArray(__spreadArray([], req.user.following, true), [id], false);
                return [4 /*yield*/, (0, sql_1["default"])(templateObject_13 || (templateObject_13 = __makeTemplateObject(["UPDATE users SET following = ", " WHERE id = ", ""], ["UPDATE users SET following = ", " WHERE id = ", ""])), updated, req.user.id)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                res.status(204);
                res.end();
                return [3 /*break*/, 5];
            case 4:
                err_9 = _a.sent();
                next(err_9);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// remove a follower from following list
router["delete"]('/followers/:id', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var updated, pos, err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                updated = __spreadArray([], req.user.following, true);
                pos = updated.indexOf(req.params.id);
                if (!(pos >= 0)) return [3 /*break*/, 2];
                updated.splice(pos, 1);
                return [4 /*yield*/, (0, sql_1["default"])(templateObject_14 || (templateObject_14 = __makeTemplateObject(["UPDATE users SET following = ", " WHERE id = ", ""], ["UPDATE users SET following = ", " WHERE id = ", ""])), updated, req.user.id)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                res.status(204);
                res.end();
                return [3 /*break*/, 4];
            case 3:
                err_10 = _a.sent();
                next(err_10);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports["default"] = router;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14;
