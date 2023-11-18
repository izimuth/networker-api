"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.__esModule = true;
var express_1 = require("express");
var sql_1 = require("../db/sql");
var client_s3_1 = require("@aws-sdk/client-s3");
var router = express_1["default"].Router();
function deleteAvatar(key) {
    return __awaiter(this, void 0, void 0, function () {
        var s3Client, bucket;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
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
                            Key: key
                        }))];
                case 1:
                    // delete from aws
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
router.get('/account', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                if (!req.user.avatar_file) return [3 /*break*/, 2];
                return [4 /*yield*/, deleteAvatar(req.user.avatar_file)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: 
            // delete auth tokens
            return [4 /*yield*/, (0, sql_1["default"])(templateObject_1 || (templateObject_1 = __makeTemplateObject(["DELETE FROM user_auth_tokens WHERE user_id = ", ""], ["DELETE FROM user_auth_tokens WHERE user_id = ", ""])), req.user.id)];
            case 3:
                // delete auth tokens
                _a.sent();
                // delete fields
                return [4 /*yield*/, (0, sql_1["default"])(templateObject_2 || (templateObject_2 = __makeTemplateObject(["DELETE FROM user_fields WHERE user_id = ", ""], ["DELETE FROM user_fields WHERE user_id = ", ""])), req.user.id)];
            case 4:
                // delete fields
                _a.sent();
                // delete user record
                return [4 /*yield*/, (0, sql_1["default"])(templateObject_3 || (templateObject_3 = __makeTemplateObject(["DELETE FROM users WHERE id = ", ""], ["DELETE FROM users WHERE id = ", ""])), req.user.id)];
            case 5:
                // delete user record
                _a.sent();
                res.status(204);
                res.end();
                return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                next(err_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
exports["default"] = router;
var templateObject_1, templateObject_2, templateObject_3;