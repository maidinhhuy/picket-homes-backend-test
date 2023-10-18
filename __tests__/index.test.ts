import dotenv from 'dotenv';
import supertest from  'supertest'
dotenv.config();

const port = process.env.PORT;
var request = supertest(`localhost:${port}`);

describe(`something`, function () {

    it('should be return number of unique home in csv file', async () => {
        const response = await request.post(`/`)
            .set('content-type', 'application/octet-stream')
            .attach('file', './small-payload.csv');
    
        expect(response.status).toBe(200);
        expect(response.text).toBe('3');
    });
    
    it('should be response time less 2s by test large file request', async () => {
        const startTime = new Date().getTime();
        const response = await request.post(`/`)
            .set('content-type', 'application/octet-stream')
            .attach('file', './large-payload.csv');
        const diffTime = new Date().getTime() - startTime;
        expect(diffTime).toBeLessThanOrEqual(2000);
        expect(response.status).toBe(200);
        expect(response.text).toBe('3');
    });
})
