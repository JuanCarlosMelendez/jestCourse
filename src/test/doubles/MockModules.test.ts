jest.mock('../../app/doubles/OtherUtils', ()=>({
    ...jest.requireActual('../../app/doubles/OtherUtils'),
    calculetComplexity: ()=>{return 10}
}));

jest.mock('uuid', ()=>({
    v4: ()=>'123'
}))

// Esta funcion va a imitar todas las funciones del ardchivo OtherUtils

import * as OtherUtils from '../../app/doubles/OtherUtils';
import { calculetComplexity } from '../../app/doubles/OtherUtils';

describe('module test', ()=>{


    test('calculate complexity', ()=>{
        const result  = OtherUtils.calculetComplexity({} as any);
        expect(result).toBe(10);
    })

    test('keep other functions', ()=>{
        const result  = OtherUtils.toUpperCase('abc');
        expect(result).toBe('ABC');
    })

    test('string with id', ()=>{
        const result  = OtherUtils.toLowerCaseWithId('ABC')
        expect(result).toBe('abc123');
    })
})