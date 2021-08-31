"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.URLcontroller = void 0;
const nanoid_1 = require("nanoid");
const Consts_1 = require("./Consts");
const nedb_1 = __importDefault(require("nedb"));
const dataStorage = new nedb_1.default({
    filename: './database/urlStorage.db',
    autoload: true
});
class URLcontroller {
    shorten(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { originalURL } = req.body;
            // ver se url foi enviada
            if (!originalURL) {
                res.end('URL Not found');
                return;
            }
            // ver se ja existe url curta no db
            dataStorage.findOne({ 'originalURL': originalURL }, (err, urlData) => {
                if (err) {
                    return console.log('error');
                }
                // caso nao. add ao db
                if (urlData == null) {
                    //cria hash code e url curta
                    const hashCode = nanoid_1.nanoid(8);
                    const shortURL = `${Consts_1.config.API_URL}/${hashCode}`;
                    // retornar url
                    res.json({ shortURL });
                    //salvar hash no db
                    dataStorage.insert({ originalURL, hashCode, shortURL });
                }
                else { // caso sim. ler dados do db
                    dataStorage.findOne({ 'originalURL': originalURL }, (err, urlData) => {
                        if (err) {
                            return console.log('error');
                        }
                        // retornar url
                        res.json(urlData.shortURL);
                    });
                }
            });
        });
    }
    redirect(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // pegar hash
            const { hash } = req.params; // wwww.youtube.com/h1f847198
            dataStorage.findOne({ 'hashCode': hash }, (err, urlData) => {
                if (err) {
                    return console.log('error');
                }
                if (urlData == null) {
                    console.log('URL not found');
                }
                else {
                    res.redirect(urlData.originalURL);
                }
            });
            // achar url ori epla hash no banco de dados
            //dar redirect para url original 
        });
    }
}
exports.URLcontroller = URLcontroller;
