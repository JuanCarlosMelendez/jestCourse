import { UserCredentialsDataAccess } from '../../../app/server_app/data/UserCredentialsDataAccess';
import { DataBase } from '../../../app/server_app/data/DataBase';
import { Account } from '../../../app/server_app/model/AuthModel';


// Imitamos las funciones insert y getBy con un mock de jest
// para tener total control de lo que haran dichas funciones

const insertMock = jest.fn();
const getByMock = jest.fn();

// !Explicacion:
//Como estamos llamando a un constructor de objetos deberiamos retornar tambien un objeto y que ademas tenga el mismo nombre DataBase

jest.mock('../../../app/server_app/data/DataBase', ()=>{
    return {
        DataBase: jest.fn().mockImplementation(()=>{
            return {
                insert: insertMock,
                getBy: getByMock
            }
        })
    }
})

//!EXPLICACION IMPORTANTE
//Para que inicie cada prueba con un objeto nuevo creado, cada vez que creamos esta clase en esta prueba(test) una nueva instancia(objeto) de DataBase es creada por lo que en tiempo real, tal vez una nueva conexion a la base de datos es creada, esto es algo que NO QUEREMOS 
//en nuestra prueba unitaria, asi que la evitaremos creando mocks de las funciones que se llaman necesitamos alguna forma de no llamar, para evitar instanciar una nueva base de datos y la llamada en esta dirección un objeto imitador(mock). Para ello necesitamos capturar UserCredentialsDataAccess atraves de DataBase, que posee: dos funciones a las que haremos pruebas y por lo tanto mock( insert y getBy) para ello necesitamos la url del DataBase par apoder interseptarla sut = new UserCredentialsDataAccess();
                                                        
describe('UserCredentialsDataAccess test suite', () =>{

    let sut: UserCredentialsDataAccess;

    const someAccount: Account =  {
        id: '',
        password: 'somePassword',
        userName: 'someUserName'
    }

    const someId = '1234';

    beforeEach(()=>{                                   
        sut =  new UserCredentialsDataAccess();
        expect(DataBase).toBeCalledTimes(1);
    })

    afterEach(()=>{
        jest.clearAllMocks();
    })

    it('addUser: should add user and return the id', async ()=>{
        
        //!Cada vez que llames insert en addUser retorna insertMock una vez con valor someId = '1234'
        insertMock.mockResolvedValueOnce(someId);

        //*Llamamos AddUser que a su vez llama a insert(que esta con mock = insertMock)
        const actualId = await sut.addUser(someAccount);

        expect(actualId).toBe(someId);
        expect(insertMock).toHaveBeenCalledWith(someAccount);
    });
    
    it('getUser: should get user by id', async ()=>{
        
        //!Cada vez que llames insert en addUser retorna insertMock una vez con valor someId = '1234'
        getByMock.mockResolvedValueOnce(someAccount);

        //*Llamamos AddUser que a su vez llama a insert(que esta con mock = insertMock)
        const actualUser = await sut.getUserById(someId);

        expect(actualUser).toEqual(someAccount);
        expect(getByMock).toHaveBeenCalledWith('id', someId);


    });

    it('should return a user by userName', async ()=>{

        getByMock.mockResolvedValueOnce(someAccount);

        const actualUser = await sut.getUserByUserName(someAccount.userName);

        expect(actualUser).toEqual(someAccount);
        expect(getByMock).toHaveBeenCalledWith('userName', someAccount.userName);
    })
    
})