import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import multer from 'multer'


dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static("public"));

app.post('/', upload.single('file'), (req: Request, res: Response) => {
    var payload: Buffer | undefined = req.file?.buffer;
    interface IRow {
        houseId: [number],
        houseAddress: [string]
    };
    let count = 0;
    let houseList: Array<IRow> = []
    let rowString = '';

    // Convert row to object and check existed in house list
    function processRow(str: string): void {
        let parts: Array<string> = str.split(',')
        if(parts && parts.length == 2) {
            let houseId = parseInt(parts[0])
            let houseAddress = parts[1]
            let index = houseList.findIndex((value) => (value.houseId.indexOf(houseId) != -1 || value.houseAddress.indexOf(houseAddress) != -1));
            if (index == -1) {
                let row: IRow = {
                    houseId: [houseId],
                    houseAddress: [houseAddress]
                }
                houseList.push(row);
                count++;
            } else {
                if (houseList[index].houseId.indexOf(houseId) === -1) {
                    houseList[index].houseId.push(houseId)
                }
                if (houseList[index].houseAddress.indexOf(houseAddress) === -1) {
                    houseList[index].houseAddress.push(houseAddress)
                }
            }
        } else {
            throw new Error('Invalid data file');
        }
    }
  
    try {
        if (payload) {
            // Read each line and processing
            for (let a of payload.entries()) {
                // Check if not is new line
                if(a[1] != 10) {
                    rowString += String.fromCharCode(a[1]);
                }
                // Processing row string if end of line
                if(a[1] == 10) {
                    processRow(rowString);
                    rowString = '';
                }
            }
            // Process last row
            processRow(rowString);
            res.status(200).send(`${count}`);
        } else {
            throw new Error('File data is empty');
        }
    } catch(error: any) {
        res.status(400).send((error as Error).message);

    }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
