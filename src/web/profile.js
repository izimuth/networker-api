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
var promises_1 = require("fs/promises");
var sql_1 = require("../db/sql");
var router = express_1["default"].Router();
router.get('/:id', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, fields, template, html, _i, _a, key, value, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                return [4 /*yield*/, (0, sql_1["default"])(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT * FROM users WHERE shareable_code = ", " AND is_active = 't' AND is_visible = 't'"], ["SELECT * FROM users WHERE shareable_code = ", " AND is_active = 't' AND is_visible = 't'"])), req.params.id)];
            case 1:
                user = (_b.sent())[0];
                if (!user) return [3 /*break*/, 3];
                fields = {
                    PROFILE_ID: user.id.toString(),
                    PROFILE_DISPLAY_NAME: user.display_name,
                    PROFILE_EMAIL: user.email,
                    PROFILE_SHAREABLE_CODE: user.shareable_code
                };
                if (user.avatar_file) {
                    fields.PROFILE_AVATAR = "<img src=\"https://".concat(process.env.AWS_S3_BUCKET, ".s3.ca-central-1.amazonaws.com/").concat(user.avatar_file, "\">");
                }
                else {
                    fields.PROFILE_AVATAR = "<div class=\"avatar-text\">".concat(user.display_name.slice(0, 2).toUpperCase(), "</div>");
                }
                return [4 /*yield*/, promises_1["default"].readFile("templates/profile.html")];
            case 2:
                template = _b.sent();
                html = template.toString('utf-8');
                // replace data in template
                for (_i = 0, _a = Object.keys(fields); _i < _a.length; _i++) {
                    key = _a[_i];
                    value = fields[key].toString();
                    html = html.replace(new RegExp("{".concat(key, "}"), 'g'), value);
                }
                res.send(html);
                return [3 /*break*/, 4];
            case 3:
                res.status(404);
                res.send('Profile not found');
                _b.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_1 = _b.sent();
                console.log(err_1);
                res.status(500);
                res.send('A server error occurred');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports["default"] = router;
var templateObject_1;
