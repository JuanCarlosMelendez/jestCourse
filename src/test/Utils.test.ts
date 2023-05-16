import { StringUtils, getStringInfo, toUpperCase } from "../app/Utils"


describe ( 'Util test suite' , () => {


    describe('StringUtils test ', () =>{

        let sut: StringUtils;

        beforeEach( ()=>{
            sut = new StringUtils();
        });

        it ('Deberia retonar error sobre argumantos invalido - funcion tradicional', () =>{
        
            function expectError() {
                const actual = sut.toUpperCase('');
            }

            expect(expectError).toThrow();
            expect(expectError).toThrowError('Argumento invalido');
        })

        it ('Deberia retonar error sobre argumantos invalido - funcion flecha', () =>{
        
            expect(()=>{
                sut.toUpperCase('');
            }).toThrowError('Argumento invalido');
        })

        it ('Deberia retonar error sobre argumantos invalido - try catch block', (done) =>{

            try {
                sut.toUpperCase('');
                done('GetStringInfo deberia arrojar un error para argumentos invalidos')
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect(error).toHaveProperty('message', 'Argumento invalido');
                done();
            }
        })
        

        it ('Deberia arrojar todo en mayusculas', () =>{
        
            //    Act (Acto)
                const actual = sut.toUpperCase( 'abc' );
            //    Assert (afirmar)
                expect(actual).toBe('ABC');
            })
        

    });







    it ('should return upperCase of valid string', () => {
       
        // Arrange:
        const sut = toUpperCase;
        const expected = 'ABC'

        // act:
        const actual = sut('abc');

        // Assert:
        expect (actual).toBe(expected)
    })

    describe('ToUpperCase examples', () =>{
        it.each([
            {input: 'abc', expected:'ABC'},
            {input: 'My-String', expected:'MY-STRING'},
            {input: 'def', expected:'DEF'},
        ])('$input toUpperCase should be $expected', ({input, expected}) =>{
            const actual = toUpperCase(input);
            expect(actual).toBe(expected);
        });
    });

    describe ('getStringInfo for arg My-String should', ()=>{
        test('return right length', ()=> {
            const actual = getStringInfo('My-String');
            expect(actual.characters).toHaveLength(9);
        });
        test('return right lower case', ()=> {
            const actual = getStringInfo('My-String');
            expect( actual.lowerCase).toBe('my-string');
        });
        test('return right upper case', ()=> {
            const actual = getStringInfo('My-String');
            expect( actual.upperCase).toBe('MY-STRING');
        });

        test('return right characters', ()=> {
            const actual = getStringInfo('My-String');
            expect (actual.characters).toEqual(['M','y','-','S','t','r','i','n','g']);
            expect( actual.characters).toContain<string>('M');
            expect (actual.characters).toEqual(
                expect.arrayContaining(['S','t','r','i','n','g','M','y','-'])
            );
        });
        test('return defined extra info', ()=> {
            const actual = getStringInfo('My-String');
            expect(actual.extraInfo).toBeDefined();
        //  expect(actual.extraInfo).not.toBe(undefined); solo de info
        //  expect(actual.extraInfo).not.toBeUndefined(); solo de info
        //  expect(actual.extraInfo).toBeDefined(); solo de info
        //  expect(actual.extraInfo).toBeTruthy(); solo de info
        });
        test('return right extra info', ()=> {
            const actual = getStringInfo('My-String');
            expect( actual.extraInfo).toEqual({})
        });
    })

});