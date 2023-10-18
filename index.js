"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(express_1.default.static("public"));
app.post('/', upload.single('file'), (req, res) => {
    var _a;
    var payload = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer;
    ;
    let count = 0;
    let houseList = [];
    let rowString = '';
    // Convert row to object and check existed in house list
    function processRow(str) {
        let parts = str.split(',');
        if (parts && parts.length == 2) {
            let houseId = parseInt(parts[0]);
            let houseAddress = parts[1];
            let index = houseList.findIndex((value) => (value.houseId.indexOf(houseId) != -1 || value.houseAddress.indexOf(houseAddress) != -1));
            if (index == -1) {
                let row = {
                    houseId: [houseId],
                    houseAddress: [houseAddress]
                };
                houseList.push(row);
                count++;
            }
            else {
                if (houseList[index].houseId.indexOf(houseId) === -1) {
                    houseList[index].houseId.push(houseId);
                }
                if (houseList[index].houseAddress.indexOf(houseAddress) === -1) {
                    houseList[index].houseAddress.push(houseAddress);
                }
            }
        }
        else {
            throw new Error('Invalid data file');
        }
    }
    try {
        if (payload) {
            // Read each line and processing
            for (let a of payload.entries()) {
                // Check if not is new line
                if (a[1] != 10) {
                    rowString += String.fromCharCode(a[1]);
                }
                // Processing row string if end of line
                if (a[1] == 10) {
                    processRow(rowString);
                    rowString = '';
                }
            }
            // Process last row
            processRow(rowString);
            res.status(200).send(`${count}`);
        }
        else {
            throw new Error('File data is empty');
        }
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
