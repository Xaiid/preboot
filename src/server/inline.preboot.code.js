"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../common");
var eventRecorder = require("./event.recorder");
// exporting default options in case developer wants to use these + custom on
// top
exports.defaultOptions = {
    buffer: true,
    minify: true,
    // these are the default events are are listening for an transfering from
    // server view to client view
    eventSelectors: [
        // for recording changes in form elements
        {
            selector: 'input,textarea',
            events: ['keypress', 'keyup', 'keydown', 'input', 'change']
        },
        { selector: 'select,option', events: ['change'] },
        // when user hits return button in an input box
        {
            selector: 'input',
            events: ['keyup'],
            preventDefault: true,
            keyCodes: [13],
            freeze: true
        },
        // when user submit form (press enter, click on button/input[type="submit"])
        {
            selector: 'form',
            events: ['submit'],
            preventDefault: true,
            freeze: true
        },
        // for tracking focus (no need to replay)
        {
            selector: 'input,textarea',
            events: ['focusin', 'focusout', 'mousedown', 'mouseup'],
            noReplay: true
        },
        // user clicks on a button
        {
            selector: 'button',
            events: ['click'],
            preventDefault: true,
            freeze: true
        }
    ]
};
/**
 * Get the event recorder code based on all functions in event.recorder.ts
 * and the getNodeKeyForPreboot function.
 */
function getEventRecorderCode() {
    var eventRecorderFunctions = [];
    for (var funcName in eventRecorder) {
        if (eventRecorder.hasOwnProperty && eventRecorder.hasOwnProperty(funcName)) {
            var fn = eventRecorder[funcName].toString();
            var fnCleaned = fn.replace('common_1.', '');
            eventRecorderFunctions.push(fnCleaned);
        }
    }
    // this is common function used to get the node key
    eventRecorderFunctions.push(common_1.getNodeKeyForPreboot.toString());
    // add new line characters for readability
    return '\n\n' + eventRecorderFunctions.join('\n\n') + '\n\n';
}
exports.getEventRecorderCode = getEventRecorderCode;
/**
 * Used by the server side version of preboot. The main purpose
 * is to get the inline code that can be inserted into the server view.
 *
 * @param customOptions PrebootRecordOptions that override the defaults
 * @returns {string} Generated inline preboot code is returned
 */
function getInlinePrebootCode(customOptions) {
    var opts = assign({}, exports.defaultOptions, customOptions);
    // safety check to make sure options passed in are valid
    validateOptions(opts);
    var optsStr = stringifyWithFunctions(opts);
    var eventRecorderFn = opts.minify ? require('./node_modules/preboot/dist/preboot.min.js') : require('./node_modules/preboot/dist/preboot.js');
    // remove the function() {} wrapper so we have the bare functions
    var eventRecorderFnStr = eventRecorderFn.toString();
    var openSquiggle = eventRecorderFnStr.indexOf('{');
    var eventRecorderCode = eventRecorderFnStr.substring(openSquiggle + 1);
    eventRecorderCode = eventRecorderCode.substring(0, eventRecorderCode.length - 1);
    // wrap inline preboot code with a self executing function in order to create scope
    return "(function(){" + eventRecorderCode + "init(" + optsStr + ")})()";
}
exports.getInlinePrebootCode = getInlinePrebootCode;
/**
 * Throw an error if issues with any options
 * @param opts
 */
function validateOptions(opts) {
    if (!opts.appRoot || !opts.appRoot.length) {
        throw new Error('The appRoot is missing from preboot options. ' +
            'This is needed to find the root of your application. ' +
            'Set this value in the preboot options to be a selector for the root element of your app.');
    }
}
exports.validateOptions = validateOptions;
/**
 * Object.assign() is not fully supporting in TypeScript, so
 * this is just a simple implementation of it
 *
 * @param target The target object
 * @param optionSets Any number of addition objects that are added on top of the
 * target
 * @returns {Object} A new object that contains all the merged values
 */
function assign(target) {
    var optionSets = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionSets[_i - 1] = arguments[_i];
    }
    if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }
    var output = Object(target);
    for (var index = 0; index < optionSets.length; index++) {
        var source = optionSets[index];
        if (source !== undefined && source !== null) {
            for (var nextKey in source) {
                if (source.hasOwnProperty && source.hasOwnProperty(nextKey)) {
                    output[nextKey] = source[nextKey];
                }
            }
        }
    }
    return output;
}
exports.assign = assign;
/**
 * Stringify an object and include functions. This is needed since we are
 * letting users pass in options that include custom functions for things like
 * the freeze handler or action when an event occurs
 *
 * @param obj This is the object you want to stringify that includes some
 * functions
 * @returns {string} The stringified version of an object
 */
function stringifyWithFunctions(obj) {
    var FUNC_START = 'START_FUNCTION_HERE';
    var FUNC_STOP = 'STOP_FUNCTION_HERE';
    // first stringify except mark off functions with markers
    var str = JSON.stringify(obj, function (_key, value) {
        // if the value is a function, we want to wrap it with markers
        if (!!(value && value.constructor && value.call && value.apply)) {
            return FUNC_START + value.toString() + FUNC_STOP;
        }
        else {
            return value;
        }
    });
    // now we use the markers to replace function strings with actual functions
    var startFuncIdx = str.indexOf(FUNC_START);
    var stopFuncIdx;
    var fn;
    while (startFuncIdx >= 0) {
        stopFuncIdx = str.indexOf(FUNC_STOP);
        // pull string out
        fn = str.substring(startFuncIdx + FUNC_START.length, stopFuncIdx);
        fn = fn.replace(/\\n/g, '\n');
        str = str.substring(0, startFuncIdx - 1) + fn + str.substring(stopFuncIdx + FUNC_STOP.length + 1);
        startFuncIdx = str.indexOf(FUNC_START);
    }
    return str;
}
exports.stringifyWithFunctions = stringifyWithFunctions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5saW5lLnByZWJvb3QuY29kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImlubGluZS5wcmVib290LmNvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvQ0FBdUU7QUFDdkUsZ0RBQWtEO0FBSWxELDZFQUE2RTtBQUM3RSxNQUFNO0FBQ08sUUFBQSxjQUFjLEdBQXlCO0lBQ2xELE1BQU0sRUFBRSxJQUFJO0lBQ1osTUFBTSxFQUFFLElBQUk7SUFFWix5RUFBeUU7SUFDekUsNkJBQTZCO0lBQzdCLGNBQWMsRUFBRTtRQUNkLHlDQUF5QztRQUN6QztZQUNFLFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsTUFBTSxFQUFFLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQztTQUM1RDtRQUNELEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUVqRCwrQ0FBK0M7UUFDL0M7WUFDRSxRQUFRLEVBQUUsT0FBTztZQUNqQixNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUM7WUFDakIsY0FBYyxFQUFFLElBQUk7WUFDcEIsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ2QsTUFBTSxFQUFFLElBQUk7U0FDYjtRQUVELDRFQUE0RTtRQUM1RTtZQUNFLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQztZQUNsQixjQUFjLEVBQUUsSUFBSTtZQUNwQixNQUFNLEVBQUUsSUFBSTtTQUNiO1FBRUQseUNBQXlDO1FBQ3pDO1lBQ0UsUUFBUSxFQUFFLGdCQUFnQjtZQUMxQixNQUFNLEVBQUUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxTQUFTLENBQUM7WUFDdkQsUUFBUSxFQUFFLElBQUk7U0FDZjtRQUVELDBCQUEwQjtRQUMxQjtZQUNFLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLE1BQU0sRUFBRSxDQUFD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