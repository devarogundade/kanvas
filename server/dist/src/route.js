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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
const controller_1 = require("./controller");
const contants_1 = require("./contants");
const controller = new controller_1.Controller();
class Route {
    constructor(app, router) {
        router.get('/generate/:properties/:fields/:gameId/:playerId/:templateId', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { properties, fields, gameId, playerId, templateId } = req.params;
            const uri = yield controller.generate(properties, fields, gameId, playerId, Number(templateId));
            return res.status(contants_1.OK).send({ uri });
        }));
        app.use('/', router);
    }
}
exports.Route = Route;
