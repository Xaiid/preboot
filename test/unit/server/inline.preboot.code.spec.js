"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("jasmine");
var src_1 = require("../../../src");
describe('UNIT TEST inline.preboot.code', function () {
    describe('stringifyWithFunctions()', function () {
        it('should do the same thing as stringify if no functions', function () {
            var obj = { foo: 'choo', woo: 'loo', zoo: 5 };
            var expected = JSON.stringify(obj);
            var actual = src_1.stringifyWithFunctions(obj);
            expect(actual).toEqual(expected);
        });
        it('should stringify an object with functions', function () {
            var obj = {
                blah: 'foo',
                zoo: function (blah) {
                    return blah + 1;
                }
            };
            var expected = '{"blah":"foo","zoo":function (';
            var actual = src_1.stringifyWithFunctions(obj);
            expect(actual.substring(0, 30)).toEqual(expected);
        });
    });
    describe('assign()', function () {
        it('should merge two objects', function () {
            var obj1 = { val1: 'foo', val2: 'choo' };
            var obj2 = { val2: 'moo', val3: 'zoo' };
            var expected = { val1: 'foo', val2: 'moo', val3: 'zoo' };
            var actual = src_1.assign(obj1, obj2);
            expect(actual).toEqual(expected);
        });
    });
    describe('validateOptions()', function () {
        it('should throw error if nothing passed in', function () {
            expect(function () { return src_1.validateOptions({}); }).toThrowError(/appRoot is missing/);
        });
    });
    describe('getEventRecorderCode()', function () {
        it('should generate valid JavaScript by default', function () {
            var code = src_1.getEventRecorderCode();
            expect(code).toBeTruthy();
        });
    });
    describe('getInlinePrebootCode()', function () {
        it('should generate valid JavaScript minified', function () {
            var code = src_1.getInlinePrebootCode({ appRoot: 'foo' });
            expect(code).toBeTruthy();
        });
        it('should generate valid JavaScript not minified', function () {
            var code = src_1.getInlinePrebootCode({ appRoot: 'foo', minify: false });
            expect(code).toBeTruthy();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5saW5lLnByZWJvb3QuY29kZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW5saW5lLnByZWJvb3QuY29kZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNEJBQTBCO0FBQzFCLG1CQUFpQjtBQUNqQixvQ0FPc0I7QUFHdEIsUUFBUSxDQUFDLCtCQUErQixFQUFFO0lBQ3hDLFFBQVEsQ0FBQywwQkFBMEIsRUFBRTtRQUNuQyxFQUFFLENBQUMsdURBQXVELEVBQUU7WUFFMUQsSUFBTSxHQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ2hELElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDckMsSUFBTSxNQUFNLEdBQUcsNEJBQXNCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtZQUM5QyxJQUFNLEdBQUcsR0FBRztnQkFDVixJQUFJLEVBQUUsS0FBSztnQkFDWCxHQUFHLEVBQUUsVUFBUyxJQUFZO29CQUN4QixNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztnQkFDbEIsQ0FBQzthQUNGLENBQUM7WUFDRixJQUFNLFFBQVEsR0FBRyxnQ0FBZ0MsQ0FBQztZQUNsRCxJQUFNLE1BQU0sR0FBRyw0QkFBc0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxVQUFVLEVBQUU7UUFDbkIsRUFBRSxDQUFDLDBCQUEwQixFQUFFO1lBQzdCLElBQU0sSUFBSSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUM7WUFDM0MsSUFBTSxJQUFJLEdBQUcsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQztZQUN4QyxJQUFNLFFBQVEsR0FBRyxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDLENBQUM7WUFDekQsSUFBTSxNQUFNLEdBQUcsWUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsbUJBQW1CLEVBQUU7UUFDNUIsRUFBRSxDQUFDLHlDQUF5QyxFQUFFO1lBQzVDLE1BQU0sQ0FBQyxjQUFNLE9BQUEscUJBQWUsQ0FBQyxFQUEwQixDQUFDLEVBQTNDLENBQTJDLENBQUMsQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUMvRixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLHdCQUF3QixFQUFFO1FBQ2pDLEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRTtZQUNoRCxJQUFNLElBQUksR0FBRywwQkFBb0IsRUFBRSxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLHdCQUF3QixFQUFFO1FBQ2pDLEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtZQUM5QyxJQUFNLElBQUksR0FBRywwQkFBb0IsQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3RELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywrQ0FBK0MsRUFBRTtZQUNsRCxJQUFNLElBQUksR0FBRywwQkFBb0IsQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDckUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9