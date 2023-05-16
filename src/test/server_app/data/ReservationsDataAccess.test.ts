import { DataBase } from "../../../app/server_app/data/DataBase";
import * as IdGenerator from "../../../app/server_app/data/IdGenerator";
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess"
import { Reservation } from "../../../app/server_app/model/ReservationModel";

// Creando Mocks
const insertMock = jest.fn();
const updateMock =  jest.fn();
const deleteMock = jest.fn();
const getByMock = jest.fn();
const getAllElementsMock = jest.fn();

jest.mock('../../../app/server_app/data/DataBase', ()=>{
    return {
        DataBase: jest.fn().mockImplementation(()=>{
            return {
                insert: insertMock,
                update: updateMock,
                delete: deleteMock,
                getBy : getByMock,
                getAllElements: getAllElementsMock
            }
        })
    }
})

describe('ReservationsDataAccess test suit', ()=>{

    let sut: ReservationsDataAccess;

    const someReservation: Reservation = {
        id: '',
        room: 'someRoom',
        user: 'someUser',
        startDate: 'someStarDate',
        endDate: 'someEndDate'
    }

    const someId = '1234';

    beforeEach(()=>{
        sut = new ReservationsDataAccess();
        expect(DataBase).toBeCalledTimes(1);
    })

    afterEach(()=>{
        jest.clearAllMocks();

    })

    it('should create a reservation and return id', async()=>{
        insertMock.mockResolvedValueOnce(someId);

        const actual = await sut.createReservation(someReservation);

        expect(actual).toBe(someId);
        expect(insertMock).toHaveBeenCalledWith(someReservation)
    })

    it('update: should update a reservation and return id', async()=>{
        await sut.updateReservation(
            someId,
            'endDate',
            'someOtherEndDate'
        )

        expect(updateMock).toBeCalledWith(
            someId,
            'endDate',
            'someOtherEndDate'
        )
    });

    it('should delete a reservation', async()=>{

        await sut.deleteReservation(someId);

        expect(deleteMock).toBeCalledWith(someId);
    });

    it('should return a reservation by id', async()=>{
        getByMock.mockResolvedValueOnce(someReservation);

        const actual = await sut.getReservation(someId);

        expect(actual).toEqual(someReservation);
        expect(getByMock).toHaveBeenCalledWith('id', someId)
    })

    it('should get all reservations', async() =>{
        getAllElementsMock.mockResolvedValueOnce([someReservation,someReservation,someReservation]);

        const actual = await sut.getAllReservations();

        expect(actual).toEqual([someReservation,someReservation,someReservation]);
        expect(getAllElementsMock).toBeCalledTimes(1);

    })

})