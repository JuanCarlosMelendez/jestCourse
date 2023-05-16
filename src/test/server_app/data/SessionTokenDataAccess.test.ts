import { DataBase } from "../../../app/server_app/data/DataBase";
import { SessionTokenDataAccess } from "../../../app/server_app/data/SessionTokenDataAccess";
import { Account } from "../../../app/server_app/model/AuthModel";
import * as IdGenerator from "../../../app/server_app/data/IdGenerator";


const insertMock =  jest.fn();
const updateMock =  jest.fn();
const getByMock  =  jest.fn();

jest.mock('../../../app/server_app/data/DataBase', ()=>{
    return {
        DataBase: jest.fn().mockImplementation(()=>{
            return {
                insert: insertMock,
                update: updateMock,
                getBy: getByMock
            }
        })
    }
})

describe('SessionTokenDataAccess test suit', ()=>{

    let sut: SessionTokenDataAccess;

    const someAccount: Account = {
        id: '',
        userName: 'someName',
        password: 'somePassword',
    }

    const someId = '1234';

    beforeEach(()=>{
        sut = new SessionTokenDataAccess();
        expect(DataBase).toBeCalledTimes(1);
        jest.spyOn(global.Date, 'now').mockReturnValue(0);
        jest.spyOn(IdGenerator, 'generateRandomId').mockReturnValueOnce(someId);
    })


    afterEach(()=>{
        jest.clearAllMocks();
    })

    it('generateToken: should create a token by id', async()=>{
        insertMock.mockResolvedValueOnce(someId);

        const actual = await sut.generateToken(someAccount);

        expect(actual).toBe(someId);
        expect(insertMock).toBeCalledWith({
            id: '',
            userName: someAccount.userName,
            valid: true,
            expirationDate: new Date(1000 * 60 * 60)
        })
    });

    it('invalidateToken: should update to invalidate token', async ()=>{
        await sut.invalidateToken(someId);

        expect(updateMock).toBeCalledWith(someId, 'valid', false);
    })

    it('isValidToken: should check validate token', async()=>{
        getByMock.mockResolvedValueOnce({ valid: true });

        const actual =  await sut.isValidToken({} as any);
        expect(actual).toBe(true);

    })

    it('isValidToken: should check invalidate  token', async()=>{
        getByMock.mockResolvedValueOnce({ valid: false });
    
        const actual =  await sut.isValidToken({} as any);
        expect(actual).toBe(false);
        })

    it('isValidToken: should check inexisted token', async()=>{
        getByMock.mockResolvedValueOnce(undefined);
    
        const actual =  await sut.isValidToken({} as any);
        expect(actual).toBe(false);
    
        })
});