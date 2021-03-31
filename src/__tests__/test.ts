import * as dotenv from "dotenv";
dotenv.config({ path: './.test.env' });
import app from "../app";
import supertest from "supertest";
import {database} from "../Database/Models";

beforeAll(async () => {
    await database.sync();
    Object.values(database.models).map(async x => await x.destroy({ truncate: true, cascade: true  }));
})

describe('GET /', () => {
    it('should does not exist', async () => {
        const result = await supertest(app).get('/');
        expect(result.statusCode).toEqual(404);
    });
});

describe('POST /register', () => {
    it('should not register john@doe : params missing', async () => {
        const result = await supertest(app)
            .post('/register')
            .send({ firstname: 'John', password: '12345', 'passwordConfirm': '1234' })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(result.statusCode).toEqual(400);
    })
    it('should not register john@doe : password not equals', async () => {
        const result = await supertest(app)
            .post('/register')
            .send({ firstname: 'John', email: 'john@doe.unk', password: '12345', 'passwordConfirm': '1234' })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(result.statusCode).toEqual(400);
    })
    it('should register john@doe', async () => {
        const result = await supertest(app)
            .post('/register')
            .send({ firstname: 'John', email: 'john@doe.unk', password: '1234', 'passwordConfirm': '1234' })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(result.statusCode).toEqual(201);
    })
    it('should not register john@doe : email already used', async () => {
        const result = await supertest(app)
            .post('/register')
            .send({ firstname: 'John', email: 'john@doe.unk', password: '1234', 'passwordConfirm': '1234' })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(result.statusCode).toEqual(400);
    })
})

describe('POST /login', () => {
    it('should not login john@doe : params missing', async () => {
        const result = await supertest(app)
            .post('/login')
            .send({ email: 'john@doe.unk' })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(result.statusCode).toEqual(400);
    });
    it('should not login john@doe : invalid credentials', async () => {
        const result = await supertest(app)
            .post('/login')
            .send({ email: 'john@doe.unk', password: '12344' })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(result.statusCode).toEqual(404);
    });
    it('should login john@doe', async () => {
        const result = await supertest(app)
            .post('/login')
            .send({ email: 'john@doe.unk', password: '1234' })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        global["connectedUser"] = result;
        expect(result.statusCode).toEqual(200);
    });
    it('should contains jwt token', async () => {
        expect(global["connectedUser"].body.data.jwt.token).toBeDefined();
    })
})

afterAll(async () => {
    await database.close();
})
