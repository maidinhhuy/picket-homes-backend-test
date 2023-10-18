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
const dotenv_1 = __importDefault(require("dotenv"));
const supertest_1 = __importDefault(require("supertest"));
dotenv_1.default.config();
const port = process.env.PORT;
var request = (0, supertest_1.default)(`localhost:${port}`);
describe(`something`, function () {
    it('should be return number of unique home in csv file', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield request.post(`/`)
            .set('content-type', 'application/octet-stream')
            .attach('file', './small-payload.csv');
        expect(response.status).toBe(200);
        expect(response.text).toBe('3');
    }));
    it('should be response time less 2s by test large file request', () => __awaiter(this, void 0, void 0, function* () {
        const startTime = new Date().getTime();
        const response = yield request.post(`/`)
            .set('content-type', 'application/octet-stream')
            .attach('file', './large-payload.csv');
        const diffTime = new Date().getTime() - startTime;
        expect(diffTime).toBeLessThanOrEqual(2000);
        expect(response.status).toBe(200);
        expect(response.text).toBe('3');
    }));
});
