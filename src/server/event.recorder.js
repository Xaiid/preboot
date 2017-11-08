"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../common");
/**
 * Called right away to initialize preboot
 *
 * @param opts All the preboot options
 */
function init(opts, win) {
    var theWindow = (win || window);
    // add the preboot options to the preboot data and then add the data to
    // the window so it can be used later by the client
    var data = (theWindow.prebootData = {
        opts: opts,
        listening: true,
        apps: [],
        listeners: []
    });
    // start up preboot listening as soon as the DOM is ready
    waitUntilReady(data);
}
exports.init = init;
/**
 * We want to attach event handlers as soon as possible. Unfortunately this
 * means before DOMContentLoaded fires, so we need to look for document.body to
 * exist instead.
 * @param data
 */
function waitUntilReady(data, win) {
    var theWindow = (win || window);
    var document = (theWindow.document || {});
    if (document.body) {
        start(data);
    }
    else {
        setTimeout(function () {
            waitUntilReady(data);
        }, 10);
    }
}
exports.waitUntilReady = waitUntilReady;
/**
 * Start up preboot by going through each app and assigning the appropriate
 * handlers. Normally this wouldn't be called directly, but we have set it up so
 * that it can for older versions of Universal.
 *
 * @param prebootData Global preboot data object that contains options and will
 * have events
 * @param win Optional param to pass in mock window for testing purposes
 */
function start(prebootData, win) {
    var theWindow = (win || window);
    // only start once
    if (theWindow.prebootStarted) {
        return;
    }
    else {
        theWindow.prebootStarted = true;
    }
    var document = (theWindow.document || {});
    var opts = prebootData.opts || {};
    var eventSelectors = opts.eventSelectors || [];
    // create an overlay that can be used later if a freeze event occurs
    prebootData.overlay = createOverlay(document);
    // get an array of all the root info
    var appRoots = getAppRoots(document, prebootData.opts);
    // for each app root
    appRoots.forEach(function (root) {
        // we track all events for each app in the prebootData object which is on
        // the global scope
        var appData = { root: root, events: [] };
        prebootData.apps.push(appData);
        // loop through all the eventSelectors and create event handlers
        eventSelectors.forEach(function (eventSelector) { return handleEvents(prebootData, appData, eventSelector); });
    });
}
exports.start = start;
/**
 * Create an overlay div and add it to the DOM so it can be used
 * if a freeze event occurs
 *
 * @param document The global document object (passed in for testing purposes)
 * @returns Element The overlay node is returned
 */
function createOverlay(document) {
    var overlay = document.createElement('div');
    overlay.setAttribute('id', 'prebootOverlay');
    overlay.setAttribute('style', 'display:none;position:absolute;left:0;' + 'top:0;width:100%;height:100%;z-index:999999;background:black;opacity:.3');
    document.body.appendChild(overlay);
    return overlay;
}
exports.createOverlay = createOverlay;
/**
 * Get references to all app root nodes based on input options. Users can
 * initialize preboot either by specifying appRoot which is just one or more
 * selectors for apps. This section option is useful for people that are doing their own
 * buffering (i.e. they have their own client and server view)
 *
 * @param document The global document object passed in for testing purposes
 * @param opts Options passed in by the user to init()
 * @returns ServerClientRoot[] An array of root info for each app
 */
function getAppRoots(document, opts) {
    var roots = [];
    // loop through any appRoot selectors to add them to the list of roots
    if (opts.appRoot && opts.appRoot.length) {
        var appRootSelectors = [].concat(opts.appRoot);
        appRootSelectors.forEach(function (selector) { return roots.push({ serverSelector: selector }); });
    }
    // now loop through the roots to get the nodes for each root
    roots.forEach(function (root) {
        root.serverNode = document.querySelector(root.serverSelector);
        root.clientSelector = root.clientSelector || root.serverSelector;
        if (root.clientSelector !== root.serverSelector) {
            // if diff selectors, then just get the client node
            root.clientNode = document.querySelector(root.clientSelector);
        }
        else if (opts.buffer) {
            // if we are doing buffering, we need to create the buffer for the client
            root.clientNode = createBuffer(root);
        }
        else {
            // else the client root is the same as the server
            root.clientNode = root.serverNode;
        }
        // if no server node found, log error
        if (!root.serverNode) {
            console.log('No server node found for selector: ' + root.serverSelector);
        }
    });
    return roots;
}
exports.getAppRoots = getAppRoots;
/**
 * Under given server root, for given selector, record events
 *
 * @param prebootData
 * @param appData
 * @param eventSelector
 */
function handleEvents(prebootData, appData, eventSelector) {
    var serverRoot = appData.root.serverNode;
    // don't do anything if no server root
    if (!serverRoot) {
        return;
    }
    // get all nodes under the server root that match the given selector
    var nodes = serverRoot.querySelectorAll(eventSelector.selector);
    // don't do anything if no nodes found
    if (!nodes) {
        return;
    }
    var _loop_1 = function (node) {
        eventSelector.events.forEach(function (eventName) {
            // get the appropriate handler and add it as an event listener
            var handler = createListenHandler(prebootData, eventSelector, appData, node);
            node.addEventListener(eventName, handler);
            // need to keep track of listeners so we can do node.removeEventListener()
            // when preboot done
            prebootData.listeners.push({ node: node, eventName: eventName, handler: handler });
        });
    };
    // we want to add an event listener for each node and each event
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var node = nodes_1[_i];
        _loop_1(node);
    }
}
exports.handleEvents = handleEvents;
/**
 * Create handler for events that we will record
 */
function createListenHandler(prebootData, eventSelector, appData, node) {
    var CARET_EVENTS = ['keyup', 'keydown', 'focusin', 'mouseup', 'mousedown'];
    var CARET_NODES = ['INPUT', 'TEXTAREA'];
    return function (event) {
        var root = appData.root;
        var eventName = event.type;
        // if no node or no event name or not listening, just return
        if (!node || !eventName) {
            return;
        }
        // if key codes set for eventSelector, then don't do anything if event
        // doesn't include key
        var keyCodes = eventSelector.keyCodes;
        if (keyCodes && keyCodes.length) {
            var matchingKeyCodes = keyCodes.filter(function (keyCode) { return event.which === keyCode; });
            // if there are not matches (i.e. key entered NOT one of the key codes)
            // then don't do anything
            if (!matchingKeyCodes.length) {
                return;
            }
        }
        // if for a given set of events we are preventing default, do that
        if (eventSelector.preventDefault) {
            event.preventDefault();
        }
        // if an action handler passed in, use that
        if (eventSelector.action) {
            eventSelector.action(node, event);
        }
        // get the node key for a given node
        var nodeKey = common_1.getNodeKeyForPreboot({ root: root, node: node });
        // if event on input or text area, record active node
        if (CARET_EVENTS.indexOf(eventName) >= 0 && CARET_NODES.indexOf(node.tagName) >= 0) {
            prebootData.activeNode = {
                root: root,
                node: node,
                nodeKey: nodeKey,
                selection: getSelection(node)
            };
        }
        else if (eventName !== 'change' && eventName !== 'focusout') {
            prebootData.activeNode = null;
        }
        // if we are freezing the UI
        if (eventSelector.freeze) {
            var overlay_1 = prebootData.overlay;
            // show the overlay
            overlay_1.style.display = 'block';
            // hide the overlay after 10 seconds just in case preboot.complete() never
            // called
            setTimeout(function () {
                overlay_1.style.display = 'none';
            }, 10000);
        }
        // we will record events for later replay unless explicitly marked as
        // doNotReplay
        if (!eventSelector.noReplay) {
            appData.events.push({ node: node, nodeKey: nodeKey, event: event, name: eventName });
        }
    };
}
exports.createListenHandler = createListenHandler;
/**
 * Get the selection data that is later used to set the cursor after client view
 * is active
 */
function getSelection(node) {
    node = node || {};
    var nodeValue = node.value || '';
    var selection = {
        start: nodeValue.length,
        end: nodeValue.length,
        direction: 'forward'
    };
    // if browser support selectionStart on node (Chrome, FireFox, IE9+)
    try {
        if (node.selectionStart || node.selectionStart === 0) {
            selection.start = node.selectionStart;
            selection.end = node.selectionEnd;
            selection.direction = node.selectionDirection;
        }
    }
    catch (ex) { }
    return selection;
}
exports.getSelection = getSelection;
/**
 * Create buffer for a given node
 *
 * @param root All the data related to a particular app
 * @returns {Element} Returns the root client node.
 */
function createBuffer(root) {
    var serverNode = root.serverNode;
    // if no rootServerNode OR the selector is on the entire html doc or the body
    // OR no parentNode, don't buffer
    if (!serverNode || !serverNode.parentNode || root.serverSelector === 'html' || root.serverSelector === 'body') {
        return serverNode;
    }
    // create shallow clone of server root
    var rootClientNode = serverNode.cloneNode(false);
    if (rootClientNode) {
        // we want the client to write to a hidden div until the time for switching
        // the buffers
        rootClientNode.style.display = 'none';
        rootClientNode.style.position = 'absolute';
        // insert the client float before the server and return it
        serverNode.parentNode.insertBefore(rootClientNode, serverNode);
    }
    // return the rootClientNode
    return rootClientNode;
}
exports.createBuffer = createBuffer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQucmVjb3JkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJldmVudC5yZWNvcmRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9DQVltQjtBQUVuQjs7OztHQUlHO0FBQ0gsY0FBcUIsSUFBMEIsRUFBRSxHQUFZO0lBQzNELElBQU0sU0FBUyxHQUFXLENBQUMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDO0lBRTFDLHVFQUF1RTtJQUN2RSxtREFBbUQ7SUFDbkQsSUFBTSxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFnQjtRQUNqRCxJQUFJLEVBQUUsSUFBSTtRQUNWLFNBQVMsRUFBRSxJQUFJO1FBQ2YsSUFBSSxFQUFFLEVBQUU7UUFDUixTQUFTLEVBQUUsRUFBRTtLQUNkLENBQUMsQ0FBQztJQUVILHlEQUF5RDtJQUN6RCxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsQ0FBQztBQWRELG9CQWNDO0FBRUQ7Ozs7O0dBS0c7QUFDSCx3QkFBK0IsSUFBaUIsRUFBRSxHQUFZO0lBQzVELElBQU0sU0FBUyxHQUFXLENBQUMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDO0lBQzFDLElBQU0sUUFBUSxHQUFhLENBQUMsU0FBUyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUV0RCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNsQixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDZCxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixVQUFVLENBQUM7WUFDVCxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ1QsQ0FBQztBQUNILENBQUM7QUFYRCx3Q0FXQztBQUVEOzs7Ozs7OztHQVFHO0FBQ0gsZUFBc0IsV0FBd0IsRUFBRSxHQUFZO0lBQzFELElBQU0sU0FBUyxHQUFXLENBQUMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDO0lBRTFDLGtCQUFrQjtJQUNsQixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUM3QixNQUFNLENBQUM7SUFDVCxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixTQUFTLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztJQUNsQyxDQUFDO0lBRUQsSUFBTSxRQUFRLEdBQWEsQ0FBQyxTQUFTLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3RELElBQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxJQUFJLElBQUssRUFBMkIsQ0FBQztJQUM5RCxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxJQUFJLEVBQUUsQ0FBQztJQUVqRCxvRUFBb0U7SUFDcEUsV0FBVyxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFOUMsb0NBQW9DO0lBQ3BDLElBQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXpELG9CQUFvQjtJQUNwQixRQUFRLENBQUMsT0FBTyxDQUFDLFVBQVMsSUFBSTtRQUM1Qix5RUFBeUU7UUFDekUsbUJBQW1CO1FBQ25CLElBQU0sT0FBTyxHQUFtQixFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBQzNELFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRS9CLGdFQUFnRTtRQUNoRSxjQUFjLENBQUMsT0FBTyxDQUFDLFVBQUEsYUFBYSxJQUFJLE9BQUEsWUFBWSxDQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUUsYUFBYSxDQUFDLEVBQWpELENBQWlELENBQUMsQ0FBQztJQUM3RixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUE5QkQsc0JBOEJDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsdUJBQThCLFFBQWtCO0lBQzlDLElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUM3QyxPQUFPLENBQUMsWUFBWSxDQUNsQixPQUFPLEVBQ1Asd0NBQXdDLEdBQUcseUVBQXlFLENBQ3JILENBQUM7SUFDRixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuQyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQ2pCLENBQUM7QUFURCxzQ0FTQztBQUVEOzs7Ozs7Ozs7R0FTRztBQUNILHFCQUE0QixRQUFrQixFQUFFLElBQTBCO0lBQ3hFLElBQU0sS0FBSyxHQUF1QixFQUFFLENBQUM7SUFFckMsc0VBQXNFO0lBQ3RFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLElBQU0sZ0JBQWdCLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakQsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUF4QyxDQUF3QyxDQUFDLENBQUM7SUFDakYsQ0FBQztJQUVELDREQUE0RDtJQUM1RCxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVMsSUFBSTtRQUN6QixJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDO1FBRWpFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLEtBQUssSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsbURBQW1EO1lBQ25ELElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDaEUsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN2Qix5RUFBeUU7WUFDekUsSUFBSSxDQUFDLFVBQVUsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04saURBQWlEO1lBQ2pELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNwQyxDQUFDO1FBRUQscUNBQXFDO1FBQ3JDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDckIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDM0UsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNmLENBQUM7QUFoQ0Qsa0NBZ0NDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsc0JBQTZCLFdBQXdCLEVBQUUsT0FBdUIsRUFBRSxhQUE0QjtJQUMxRyxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUUzQyxzQ0FBc0M7SUFDdEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sQ0FBQztJQUNULENBQUM7SUFFRCxvRUFBb0U7SUFDcEUsSUFBTSxLQUFLLEdBQWMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUU3RSxzQ0FBc0M7SUFDdEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ1gsTUFBTSxDQUFDO0lBQ1QsQ0FBQzs0QkFHVSxJQUFJO1FBQ2IsYUFBYSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBUyxTQUFpQjtZQUNyRCw4REFBOEQ7WUFDOUQsSUFBTSxPQUFPLEdBQUcsbUJBQW1CLENBQUMsV0FBVyxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDL0UsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUUxQywwRUFBMEU7WUFDMUUsb0JBQW9CO1lBQ3BCLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ3JGLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQVhELGdFQUFnRTtJQUNoRSxHQUFHLENBQUMsQ0FBZSxVQUFLLEVBQUwsZUFBSyxFQUFMLG1CQUFLLEVBQUwsSUFBSztRQUFuQixJQUFNLElBQUksY0FBQTtnQkFBSixJQUFJO0tBVWQ7QUFDSCxDQUFDO0FBNUJELG9DQTRCQztBQUVEOztHQUVHO0FBQ0gsNkJBQ0UsV0FBd0IsRUFDeEIsYUFBNEIsRUFDNUIsT0FBdUIsRUFDdkIsSUFBYTtJQUViLElBQU0sWUFBWSxHQUFHLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQzdFLElBQU0sV0FBVyxHQUFHLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBRTFDLE1BQU0sQ0FBQyxVQUFTLEtBQWU7UUFDN0IsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUMxQixJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBRTdCLDREQUE0RDtRQUM1RCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELHNFQUFzRTtRQUN0RSxzQkFBc0I7UUFDdEIsSUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQztRQUN4QyxFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDaEMsSUFBTSxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUEsT0FBTyxJQUFJLE9BQUEsS0FBSyxDQUFDLEtBQUssS0FBSyxPQUFPLEVBQXZCLENBQXVCLENBQUMsQ0FBQztZQUU3RSx1RUFBdUU7WUFDdkUseUJBQXlCO1lBQ3pCLEVBQUUsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDN0IsTUFBTSxDQUFDO1lBQ1QsQ0FBQztRQUNILENBQUM7UUFFRCxrRUFBa0U7UUFDbEUsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDakMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3pCLENBQUM7UUFFRCwyQ0FBMkM7UUFDM0MsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDekIsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUVELG9DQUFvQztRQUNwQyxJQUFNLE9BQU8sR0FBRyw2QkFBb0IsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFFakUscURBQXFEO1FBQ3JELEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkYsV0FBVyxDQUFDLFVBQVUsR0FBRztnQkFDdkIsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsT0FBTyxFQUFFLE9BQU87Z0JBQ2hCLFNBQVMsRUFBRSxZQUFZLENBQUMsSUFBSSxDQUFDO2FBQzlCLENBQUM7UUFDSixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsS0FBSyxRQUFRLElBQUksU0FBUyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDOUQsV0FBVyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDaEMsQ0FBQztRQUVELDRCQUE0QjtRQUM1QixFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFNLFNBQU8sR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDO1lBRXBDLG1CQUFtQjtZQUNuQixTQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7WUFFaEMsMEVBQTBFO1lBQzFFLFNBQVM7WUFDVCxVQUFVLENBQUM7Z0JBQ1QsU0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBQ2pDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNaLENBQUM7UUFFRCxxRUFBcUU7UUFDckUsY0FBYztRQUNkLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDNUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUN2RixDQUFDO0lBQ0gsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQTVFRCxrREE0RUM7QUFFRDs7O0dBR0c7QUFDSCxzQkFBNkIsSUFBYTtJQUN4QyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUVsQixJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztJQUNuQyxJQUFNLFNBQVMsR0FBYztRQUMzQixLQUFLLEVBQUUsU0FBUyxDQUFDLE1BQU07UUFDdkIsR0FBRyxFQUFFLFNBQVMsQ0FBQyxNQUFNO1FBQ3JCLFNBQVMsRUFBRSxTQUFTO0tBQ3JCLENBQUM7SUFFRixvRUFBb0U7SUFDcEUsSUFBSSxDQUFDO1FBQ0gsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckQsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1lBQ3RDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUNsQyxTQUFTLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztRQUNoRCxDQUFDO0lBQ0gsQ0FBQztJQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFDO0lBRWYsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBcEJELG9DQW9CQztBQUVEOzs7OztHQUtHO0FBQ0gsc0JBQTZCLElBQXNCO0lBQ2pELElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7SUFFbkMsNkVBQTZFO0lBQzdFLGlDQUFpQztJQUNqQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzlHLE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUVELHNDQUFzQztJQUN0QyxJQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25ELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDbkIsMkVBQTJFO1FBQzNFLGNBQWM7UUFDZCxjQUFjLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEMsY0FBYyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO1FBRTNDLDBEQUEwRDtRQUMxRCxVQUFVLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELDRCQUE0QjtJQUM1QixNQUFNLENBQUMsY0FBYyxDQUFDO0FBQ3hCLENBQUM7QUF2QkQsb0NBdUJDIn0=