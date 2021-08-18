"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nanoid_1 = require("nanoid");
const URLcontroller_1 = require("./controller/URLcontroller");
const api = express_1.default();
api.use(express_1.default.json());
api.get('/test', (req, res) => {
    console.log('URL:', req.url);
    console.log('METHOD', req.method);
    res.statusCode = 200;
    res.json({
        'success': true,
        'uid': nanoid_1.nanoid(10)
    });
    res.end('<h1> my test API<h1/>');
});
const urlcontroller = new URLcontroller_1.URLcontroller;
api.post('/test-short', urlcontroller.shorten);
api.get('/:hash', urlcontroller.redirect);
api.listen(3000, () => {
    console.log('server listen');
});
