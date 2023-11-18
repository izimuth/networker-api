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
var bcrypt_1 = require("bcrypt");
var sql_1 = require("../db/sql");
var users_1 = require("../users");
var router = express_1["default"].Router();
router.post('/login', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, password, user, token, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                email = req.body.email;
                password = req.body.password;
                return [4 /*yield*/, (0, sql_1["default"])(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT * FROM users WHERE email = ", " LIMIT 1"], ["SELECT * FROM users WHERE email = ", " LIMIT 1"])), email)];
            case 1:
                user = (_a.sent())[0];
                if (!(user && bcrypt_1["default"].compareSync(password, user.password))) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, users_1.createAuthToken)(user)];
            case 2:
                token = _a.sent();
                res.send({ success: true, token: token, user: user });
                return [3 /*break*/, 4];
            case 3:
                res.send({ success: false });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                next(err_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/create', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, display_name, email, password, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, display_name = _a.display_name, email = _a.email, password = _a.password;
                password = bcrypt_1["default"].hashSync(password, 10);
                return [4 /*yield*/, (0, sql_1["default"])(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n\t\t\tINSERT INTO users (email, password, display_name, shareable_code, is_visible, is_active) \n\t\t\tVALUES (\n\t\t\t\t", ",\n\t\t\t\t", ",\n\t\t\t\t", ",\n\t\t\t\tgen_random_uuid(),\n\t\t\t\t'f',\n\t\t\t\t't'\n\t\t\t)\n\t\t"], ["\n\t\t\tINSERT INTO users (email, password, display_name, shareable_code, is_visible, is_active) \n\t\t\tVALUES (\n\t\t\t\t", ",\n\t\t\t\t", ",\n\t\t\t\t", ",\n\t\t\t\tgen_random_uuid(),\n\t\t\t\t'f',\n\t\t\t\t't'\n\t\t\t)\n\t\t"])), email, password, display_name)];
            case 1:
                _b.sent();
                res.status(204);
                res.end();
                return [3 /*break*/, 3];
            case 2:
                err_2 = _b.sent();
                next(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/logout', users_1.authMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var fromAll, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                fromAll = req.body.fromAll === 'yes';
                // delete the current auth token
                return [4 /*yield*/, (0, sql_1["default"])(templateObject_3 || (templateObject_3 = __makeTemplateObject(["DELETE FROM user_auth_tokens WHERE token_value = ", ""], ["DELETE FROM user_auth_tokens WHERE token_value = ", ""])), req.authToken.token_value)];
            case 1:
                // delete the current auth token
                _a.sent();
                if (!fromAll) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, sql_1["default"])(templateObject_4 || (templateObject_4 = __makeTemplateObject(["DELETE FROM user_auth_tokens WHERE user_id = ", ""], ["DELETE FROM user_auth_tokens WHERE user_id = ", ""])), req.authToken.user_id)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                res.status(204);
                res.end();
                return [3 /*break*/, 5];
            case 4:
                err_3 = _a.sent();
                next(err_3);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports["default"] = router;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
