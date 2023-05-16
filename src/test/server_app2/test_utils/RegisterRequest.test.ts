import { DataBase } from "../../../app/server_app/data/DataBase"
import { Account } from "../../../app/server_app/model/AuthModel";
import { HTTP_CODES, HTTP_METHODS } from "../../../app/server_app/model/ServerModel";
import { Server } from "../../../app/server_app/server/Server";
import { RequestTestWrapper } from "./RequestTestWrapper";
import { ResponseTestWrapper } from "./ResponseTestWrapper";
import { createServer } from 'http';


jest.mock('../../../app/server_app/data/DataBase');

const requestWrapper = new RequestTestWrapper();
const responseWrapper = new ResponseTestWrapper();

const fakeServer = {
    listen: ()=>{},
    close: ()=>{}
}

jest.mock('http', ()=>({
    createServer: (cb: Function) =>{
        cb(requestWrapper, responseWrapper)
        return fakeServer;
    }
}))


describe('Register request test suite',()=>{

    afterEach(()=>{
        requestWrapper.clearFields();
        responseWrapper.clearFields();
    });

    it('should register new users', async ()=> {
        requestWrapper.method = HTTP_METHODS.POST;
        requestWrapper.body = {
            userName: 'someUserName',
            password: 'somePassword'
        }
        requestWrapper.url = 'localhost:8080/register'
        jest.spyOn(DataBase.prototype, 'insert').mockResolvedValueOnce('1234');

        await new Server().startServer();

        await new Promise(process.nextTick) // esto resuelve el problema de timing

        expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
        expect(responseWrapper.body).toEqual(expect.objectContaining({
            userId: expect.any(String)
        }))
    })

    it('should reject request with no userName and password', async ()=> {
        requestWrapper.method = HTTP_METHODS.POST;
        requestWrapper.body = {};
        requestWrapper.url = 'localhost:8080/register'

        await new Server().startServer();

        await new Promise(process.nextTick) // esto resuelve el problema de timing

        expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        expect(responseWrapper.body).toBe('userName and password required')
    })

    it('should do nothing for not suppported methods', async ()=> {
        requestWrapper.method = HTTP_METHODS.DELETE;
        requestWrapper.body = {};
        requestWrapper.url = 'localhost:8080/register'

        await new Server().startServer();

        await new Promise(process.nextTick) // esto resuelve el problema de timing

        expect(responseWrapper.statusCode).toBeUndefined();
        expect(responseWrapper.body).toBeUndefined();
    })
})