import { describe, test, expect } from 'bun:test';

describe("test Set object", () => {
    test("construction", () => {
        let data = new Set([10, 0, 100, 10, 50]);
        // console.log(data)
        expect(data.size).toBe(4);
        expect(data).toContain(10);
        expect(data).not.toContain(999);
    })
    test("add,delete,clear", () => {
        let data = new Set();
        data.add('壱')
            .add('弍')
            .add('参')
            .add('壱');
        expect(data.size).toBe(3)   // Set {'壱','弍','参'}
        expect(data.delete('弍')).toBeTrue()
        expect(data.delete('肆')).toBeFalse()   // シ
        data.clear()
        expect(data.size).toBe(0)
    })
    test("has", () => {
        let data = new Set(['壱', '弍', '参']);
        expect(data.has('壱')).toBeTrue()
        expect(data.has('肆')).toBeFalse()
    })
    test("forEach", () => {
        let data = new Set(['壱', '弍', '参']);
        data.forEach(function (value, key, set) {
            expect(data.has(value)).toBeTrue();
            //console.log(value);
        })
    })
    test("for...of", () => {
        let data = new Set(['壱', '弍', '参']);
        for (let value of data) {
            expect(data.has(value)).toBeTrue();
            //console.log(value);
        }
    })
})
