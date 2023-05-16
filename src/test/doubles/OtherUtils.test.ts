import { OtherStringUtils, calculetComplexity, toUpperCaseWithCb } from "../../app/doubles/OtherUtils"


describe.skip('OtherUtils test suite',  ()=> {

    // Spies

    describe('OtherStringUtils test with spies', ()=>{

        let sut: OtherStringUtils;

        beforeEach(()=>{
            sut = new OtherStringUtils();
        })

        test('Use a spy to track calls',()=>{
            const toUpperCaseSpy =jest.spyOn(sut, 'toUpperCase');
            sut.toUpperCase('asa');
            expect(toUpperCaseSpy).toBeCalledWith('asa');
        })

        test('Use a spy to track calls to other module',()=>{
            const consoleLogSpy =jest.spyOn(console, 'log');
            sut.logString('abc');
            expect(consoleLogSpy).toBeCalledWith('abc');
        })

        test.only('Use a spy to replace the implementation of a method',()=>{
  
            jest.spyOn(sut , 'callExternalService').mockImplementationOnce(()=>{
                console.log('calling mocked implementation!!!');
            });
            sut.callExternalService();
        })
    })


    // Mocking

    describe('Tracking callbacks with Jest mocks', ()=>{

        const callBackMock = jest.fn();

        afterEach(()=>{
            jest.clearAllMocks();
        })

        it('calls callback for invalid arguments - track calls', ()=>{
            const actual =  toUpperCaseWithCb('', callBackMock)
            expect(actual).toBeUndefined();
            expect(callBackMock).toBeCalledWith('Invalid argument!')
            expect(callBackMock).toBeCalledTimes(1);
        })

        it('calls callback for valid arguments - track calls', ()=>{
            const actual =  toUpperCaseWithCb('abc', callBackMock)
            expect(actual).toBe('ABC');
            expect(callBackMock).toBeCalledWith('calls function with abc');
            expect(callBackMock).toBeCalledTimes(1);
        })

        

    });

    describe('Tracking callbacks', ()=>{

        let cbArgs = [];
        let timesCalled = 0;

        function callBackMock(arg:string){
            cbArgs.push(arg);
            timesCalled++;
        }

        afterEach(()=>{
            cbArgs = [];
            timesCalled = 0;
        })

        it('calls callback for invalid arguments - track calls', ()=>{
            const actual =  toUpperCaseWithCb('', callBackMock)
            expect(actual).toBeUndefined();
            expect(cbArgs).toContain('Invalid argument!');
            expect(timesCalled).toBe(1);
        })

        it('calls callback for valid arguments - track calls', ()=>{
            const actual =  toUpperCaseWithCb('abc', callBackMock)
            expect(actual).toBe('ABC');
            expect(cbArgs).toContain('calls function with abc');
            expect(timesCalled).toBe(1);
        })

    })


    // FAKE: implementacion simplificada que toma atajos

    it('ToUpperCase - calls callback for invalid arguments', ()=>{
       
        const actual =  toUpperCaseWithCb('', ()=>{{}})
        expect(actual).toBeUndefined();
    })

    it('ToUpperCase - calls callback for valid arguments', ()=>{
       
        const actual =  toUpperCaseWithCb('abc', ()=>{{}})
        expect(actual).toBe('ABC');
    })


    // STUBS :obejto imcompleto usado como argumento

    it('Calcula complejidad', ()=>{
        const someInfo = {
            length: 5,
            extraInfo: {
                field1: 'someInfo',
                field2: 'someOtherInfo'
            }
        }
        const actual = calculetComplexity(someInfo as any);
        expect(actual).toBe(10);
    })
})