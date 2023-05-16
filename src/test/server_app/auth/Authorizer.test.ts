import { Authorizer } from "../../../app/server_app/auth/Authorizer"
import { SessionTokenDataAccess } from "../../../app/server_app/data/SessionTokenDataAccess";
import { UserCredentialsDataAccess } from "../../../app/server_app/data/UserCredentialsDataAccess";

// MOCKS DE sessionTokenDataAccess
const isValidTokenMock = jest.fn();
const generateTokenMock = jest.fn();
const invalidateTokenMock = jest.fn();

jest.mock('../../../app/server_app/data/SessionTokenDataAccess', ()=>{
    return {
        SessionTokenDataAccess: jest.fn().mockImplementation(()=>{
            return {
                isValidToken: isValidTokenMock,
                generateToken: generateTokenMock,
                invalidateToken: invalidateTokenMock
            }
        })
    }
})

// !MOCKS DE userCredentialsDataAccess

const addUserMock = jest.fn();
const getUserByUserNameMock = jest.fn();

jest.mock('../../../app/server_app/data/UserCredentialsDataAccess', ()=>{
    return {
        UserCredentialsDataAccess: jest.fn().mockImplementation(()=>{
           return { 
            addUser: addUserMock,
            getUserByUserName: getUserByUserNameMock
            }
        })
    }
})

describe('Authorizer test suit', ()=>{

    let sut : Authorizer;
    const someUserName = 'someUserName';
    const somePassword = 'somePassword';


    const someId = '1234'

    beforeEach(()=>{
        sut = new Authorizer();
    })
    afterEach(()=>{
        jest.clearAllMocks();
    })

    it('should validate token',async ()=>{

        isValidTokenMock.mockResolvedValueOnce(false);

        const actual = await sut.validateToken(someId);

        expect(actual).toBe(false);

    });

    it('should return id for new registed user', async()=>{
        addUserMock.mockResolvedValueOnce(someId)

        const actual = await sut.registerUser(someUserName, somePassword);
        expect(actual).toBe(someId);
        expect(addUserMock).toBeCalledWith({
            id: '',
            password: somePassword,
            userName: someUserName
        })
    });

    it('should return a tokenId for valid credentials', async()=>{
        getUserByUserNameMock.mockResolvedValueOnce({
            password:somePassword
        });
        generateTokenMock.mockResolvedValueOnce(someId);

        const actual = await sut.login(someUserName, somePassword);

        expect(actual).toBe(someId)

    });

    // it('should return undefined for invalid credentials',()=>{});
    it('should return undefined for invalid credentials', async()=>{
        getUserByUserNameMock.mockResolvedValueOnce({
            password:somePassword
        });
        generateTokenMock.mockResolvedValueOnce(someId);

        const actual = await sut.login(someUserName, 'someOtherPassword');

        expect(actual).toBeUndefined();

    });
    it('should invalidate token on logout call',async ()=>{

        const actual = await sut.logout(someId);

        expect(invalidateTokenMock).toBeCalledWith(someId);
    });

})