import { Authorizer } from "../../../../app/server_app/auth/Authorizer";
import { RegisterHandler } from "../../../../app/server_app/handlers/RegisterHandler";
import { IncomingMessage, ServerResponse } from 'http';
import { getRequestBody } from "../../../../app/server_app/utils/Utils";
import { HTTP_METHODS, HTTP_CODES } from '../../../../app/server_app/model/ServerModel';

const getRequestBodyMock = jest.fn();

jest.mock('../../../../app/server_app/utils/Utils', ()=>({
    getRequestBody: () => getRequestBodyMock()
}))

describe( 'RegisterHandler test suit', ()=>{


    let sut: RegisterHandler;
// !Explicacion:
// Para este caso la clase Register Handler posee varios metodos privados, a los que haremos mock
// para poder testear la clase: Authorizer, IncomingMessage, ServerResponse; cada uno de esos metodos
// poseen propiedades las cuales emularemos con jest.fn tal y como se hace a continuacion
    const request = {
        method: undefined
    }
    const responseMock = {
        statusCode: 0,
        writeHead: jest.fn(),
        write: jest.fn()

    }

    const authorizerMock = {
        registerUser: jest.fn()
    }

    const someAccount = {
        id: '',
        password: 'somePassword',
        userName: 'someUserName'
    }
    const someId = '1234';

    beforeEach(()=>{
        sut = new RegisterHandler(
            request        as IncomingMessage, 
            responseMock   as any as ServerResponse, 
            authorizerMock as any as Authorizer
        )
    })

    afterEach(()=>{
        jest.clearAllMocks();
    })

    it('should register valid accounts in requests', async ()=>{
        request.method = HTTP_METHODS.POST;
        getRequestBodyMock.mockResolvedValueOnce(someAccount);
        authorizerMock.registerUser.mockResolvedValueOnce(someId);

        await sut.handleRequest();

        expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
        expect(responseMock.writeHead).toBeCalledWith(
            HTTP_CODES.CREATED,
            { 'Content-Type': 'application/json' }
        )
        expect(responseMock.write).toBeCalledWith(
            JSON.stringify({
                userId: someId
            })
        )
    })
    it('should no register invalid accounts in request', async ()=>{
        request.method = HTTP_METHODS.POST;
        getRequestBodyMock.mockResolvedValueOnce({});

        await sut.handleRequest();

        expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
        expect(responseMock.writeHead).toBeCalledWith(
            HTTP_CODES.BAD_REQUEST,
            { 'Content-Type': 'application/json' }
        )
        expect(responseMock.write).toBeCalledWith(
            JSON.stringify('userName and password required')
        )
    })

    it('should do nothing for not supported http methods',async ()=>{
        request.method = HTTP_METHODS.GET;
        await sut.handleRequest();

        expect(responseMock.write).not.toBeCalled();
        expect(responseMock.writeHead).not.toBeCalled();
        expect(getRequestBodyMock).not.toBeCalled();
    })



})