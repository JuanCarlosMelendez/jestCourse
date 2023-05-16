import { Authorizer } from "../../../../app/server_app/auth/Authorizer";
import { LoginHandler } from "../../../../app/server_app/handlers/LoginHandler"
import { IncomingMessage, ServerResponse } from 'http';
import { Account } from "../../../../app/server_app/model/AuthModel";
import { HTTP_CODES, HTTP_METHODS } from "../../../../app/server_app/model/ServerModel";
import { getRequestBody } from "../../../../app/server_app/utils/Utils";

const getRequestBodyMock = jest.fn();

jest.mock('../../../../app/server_app/utils/Utils', ()=>({
    getRequestBody: () => getRequestBodyMock()
}))


describe('LoginHandler test suit', ()=>{

    let sut: LoginHandler;

    const request = {
        method: undefined
    }
    const responseMock = {
        statusCode: 0,
        writeHead: jest.fn(),
        write: jest.fn()
    }
    const authorizerMock = {
        login: jest.fn()
    }

    const someToken = '1234';

    const someAccount: Account = {
        id: '',
        password: 'somePassword',
        userName: 'someUserName'
    }

    beforeEach(()=>{
        sut = new LoginHandler(
            request as IncomingMessage,
            responseMock as any as ServerResponse,
            authorizerMock as any as Authorizer
        )
    })
    afterEach(()=>{
        jest.clearAllMocks()
    })

    it('should return token for valid accounts in requests', async()=>{
        request.method = HTTP_METHODS.POST;
        getRequestBodyMock.mockResolvedValueOnce(someAccount);
        authorizerMock.login.mockResolvedValueOnce(someToken);

        await sut.handleRequest();

        expect(authorizerMock.login).toBeCalledWith(
            someAccount.userName,
            someAccount.password
        )

        expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
        expect(responseMock.writeHead).toBeCalledWith(
            HTTP_CODES.CREATED, 
            { 'Content-Type': 'application/json' }
        );
        expect(responseMock.write).toBeCalledWith(JSON.stringify({
            token: someToken}
            ))
    })
    it('should do nothing for not supported http methods',async ()=>{
        request.method = HTTP_METHODS.GET;
        await sut.handleRequest();

        expect(responseMock.write).not.toBeCalled();
        expect(responseMock.writeHead).not.toBeCalled();
        expect(getRequestBodyMock).not.toBeCalled();
    })
    it('should return no found for invalid accounts in requests', async()=>{
        request.method = HTTP_METHODS.POST;
        getRequestBodyMock.mockResolvedValueOnce(someAccount);
        authorizerMock.login(undefined);

        await sut.handleRequest();

        expect(authorizerMock.login).toBeCalledWith(
            someAccount.userName,
            someAccount.password
        )

        expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
        expect(responseMock.write).toBeCalledWith(JSON.stringify('wrong username or password'));


    })
    it('should return bad request for invalid requests', async()=>{
        request.method = HTTP_METHODS.POST;
        getRequestBodyMock.mockResolvedValueOnce({});

        await sut.handleRequest();

        expect(authorizerMock.login).not.toBeCalled();
        expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
        expect(responseMock.write).toBeCalledWith(JSON.stringify('userName and password required'));
    })



})