import { PasswordChecker, PasswordErrors } from "../../app/pass_checker/PasswordChecker"


describe('PasswordChecker test suite', ()=>{

    let sut: PasswordChecker //sut es system under test

    beforeEach(() => {
        sut = new PasswordChecker(); // antes de cada test, nuestro suit es un nuevo password checker
                                    //  esto para garantizar que cada test sea independiente del anterior.
    })

    it('Password con menos de 8 caracteres es invalido', ()=>{
        const actual = sut.checkPassword('1234567');
        expect(actual.valid).toBe(false);
        expect(actual.reasons).toContain(PasswordErrors.SHORT)
    })

    it('Password con mas de 8 caracteres es O.K', ()=>{
        const actual = sut.checkPassword('12345678Aa');
        expect(actual.reasons).not.toContain(PasswordErrors.SHORT)
    })

    // Listo

    it('Password sin al menos una mayuscula es invalida', ()=>{
        const actual = sut.checkPassword('abcd');
        expect(actual.valid).toBe(false);
        expect(actual.reasons).toContain(PasswordErrors.NO_UPPER_CASE);
    })

    it('Password con al menos una mayuscula es valida', ()=>{
        const actual = sut.checkPassword('abcdA');
        expect(actual.reasons).not.toContain(PasswordErrors.NO_UPPER_CASE);
    })

    it('Password sin al menos una minuscula es invalida', ()=>{
        const actual = sut.checkPassword('ABCD');
        expect(actual.valid).toBe(false);
        expect(actual.reasons).toContain(PasswordErrors.NO_LOWER_CASE);
    })

    it('Password con al menos una minuscula es valida', ()=>{
        const actual = sut.checkPassword('ABCDa');
        expect(actual.reasons).not.toContain(PasswordErrors.NO_LOWER_CASE);
    })
    it('Password compleja es valida', ()=>{
        const actual = sut.checkPassword('1234abcD');
        expect(actual.reasons).toHaveLength(0);
        expect(actual.valid).toBe(true);
    })

    it('Admin password with no number is invalid', ()=>{
        const actual = sut.checkAdminPassword('ascdABCD');
        expect(actual.reasons).toContain(PasswordErrors.NO_NUMBER);
        expect(actual.valid).toBe(false);
    })

    it('Admin password with number is valid', ()=>{
        const actual = sut.checkAdminPassword('ascdABCD7');
        expect(actual.reasons).not.toContain(PasswordErrors.NO_NUMBER);
    })



})



