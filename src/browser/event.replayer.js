"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../common");
var EventReplayer = /** @class */ (function () {
    function EventReplayer() {
        this.clientNodeCache = {};
        this.replayStarted = false;
    }
    /**
     * Window setting and getter to facilitate testing of window
     * in non-browser environments
     */
    EventReplayer.prototype.setWindow = function (win) {
        this.win = win;
    };
    /**
     * Window setting and getter to facilitate testing of window
     * in non-browser environments
     */
    EventReplayer.prototype.getWindow = function () {
        return (this.win || typeof window === 'undefined' ? this.win : window);
    };
    /**
     * Replay all events for all apps. this can only be run once.
     * if called multiple times, will only do something once
     */
    EventReplayer.prototype.replayAll = function () {
        var _this = this;
        if (this.replayStarted || typeof window === 'undefined') {
            return;
        }
        else {
            this.replayStarted = true;
        }
        // loop through each of the preboot apps
        var prebootData = this.getWindow().prebootData || {};
        var apps = prebootData.apps || [];
        apps.forEach(function (appData) { return _this.replayForApp(appData); });
        // once all events have been replayed and buffers switched, then we cleanup preboot
        this.cleanup(prebootData);
    };
    /**
     * Replay all events for one app (most of the time there is just one app)
     * @param appData
     * @param opts
     */
    EventReplayer.prototype.replayForApp = function (appData) {
        var _this = this;
        appData = (appData || {});
        // try catch around events b/c even if error occurs, we still move forward
        try {
            var root = (appData.root || {});
            var events = appData.events || [];
            // some client side frameworks (like Angular 1 w UI Router) will replace
            // elements, so we need to re-get client root just to be safe
            root.clientNode = this.getWindow().document.querySelector(root.clientSelector);
            // replay all the events from the server view onto the client view
            events.forEach(function (event) { return _this.replayEvent(appData, event); });
        }
        catch (ex) {
            console.error(ex);
        }
        // if we are buffering, switch the buffers
        this.switchBuffer(appData);
    };
    /**
     * Replay one particular event
     * @param appData
     * @param prebootEvent
     */
    EventReplayer.prototype.replayEvent = function (appData, prebootEvent) {
        appData = (appData || {});
        prebootEvent = (prebootEvent || {});
        var event = prebootEvent.event;
        var serverNode = prebootEvent.node || {};
        var nodeKey = prebootEvent.nodeKey;
        var clientNode = this.findClientNode({
            root: appData.root,
            node: serverNode,
            nodeKey: nodeKey
        });
        // if client node can't be found, log a warning
        if (!clientNode) {
            console.warn('Trying to dispatch event ' + event.type + ' to node ' + nodeKey + ' but could not find client node. ' + 'Server node is: ');
            console.log(serverNode);
            return;
        }
        // now dispatch events and whatnot to the client node
        clientNode.checked = serverNode.checked ? true : undefined;
        clientNode.selected = serverNode.selected ? true : undefined;
        clientNode.value = serverNode.value;
        clientNode.dispatchEvent(event);
    };
    /**
     * Switch the buffer for one particular app (i.e. display the client
     * view and destroy the server view)
     * @param appData
     */
    EventReplayer.prototype.switchBuffer = function (appData) {
        appData = (appData || {});
        var root = (appData.root || {});
        var serverView = root.serverNode;
        var clientView = root.clientNode;
        // if no client view or the server view is the body or client
        // and server view are the same, then don't do anything and return
        if (!clientView || !serverView || serverView === clientView || serverView.nodeName === 'BODY') {
            return;
        }
        // do a try-catch just in case something messed up
        try {
            // get the server view display mode
            var display = this.getWindow()
                .getComputedStyle(serverView)
                .getPropertyValue('display') || 'block';
            // first remove the server view
            serverView.remove ? serverView.remove() : (serverView.style.display = 'none');
            // now add the client view
            clientView.style.display = display;
            clientView.style.position = 'absolute';
            clientView.style.width = '100%';
        }
        catch (ex) {
            console.error(ex);
        }
    };
    /**
     * Finally, set focus, remove all the event listeners and remove
     * any freeze screen that may be there
     * @param prebootData
     */
    EventReplayer.prototype.cleanup = function (prebootData) {
        var _this = this;
        prebootData = prebootData || {};
        var listeners = prebootData.listeners || [];
        // set focus on the active node AFTER a small delay to ensure buffer
        // switched
        setTimeout(function () { return _this.setFocus(prebootData.activeNode); }, 1);
        // remove all event listeners
        for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
            var listener = listeners_1[_i];
            listener.node.removeEventListener(listener.eventName, listener.handler);
        }
        // remove the freeze overlay if it exists
        var prebootOverlay = this.getWindow().document.body.querySelector('#prebootOverlay');
        if (prebootOverlay) {
            prebootOverlay.remove ? prebootOverlay.remove() : (prebootOverlay.style.display = 'none');
        }
        // clear out the data stored for each app
        prebootData.apps = [];
        this.clientNodeCache = {};
        // sent event to documernt that signals preboot complete
        var completeEvent = new Event('PrebootComplete');
        this.getWindow().document.dispatchEvent(completeEvent);
    };
    EventReplayer.prototype.setFocus = function (activeNode) {
        // only do something if there is an active node
        if (!activeNode || !activeNode.node || !activeNode.nodeKey) {
            return;
        }
        // find the client node in the new client view
        var clientNode = this.findClientNode(activeNode);
        if (clientNode) {
            // set focus on the client node
            clientNode.focus();
            // set selection if a modern browser (i.e. IE9+, etc.)
            var selection = activeNode.selection;
            if (clientNode.setSelectionRange && selection) {
                try {
                    clientNode.setSelectionRange(selection.start, selection.end, selection.direction);
                }
                catch (ex) { }
            }
        }
    };
    /**
     * Given a node from the server rendered view, find the equivalent
     * node in the client rendered view. We do this by the following approach:
     *      1. take the name of the server node tag (ex. div or h1 or input)
     *      2. add either id (ex. div#myid) or class names (ex. div.class1.class2)
     *      3. use that value as a selector to get all the matching client nodes
     *      4. loop through all client nodes found and for each generate a key value
     *      5. compare the client key to the server key; once there is a match,
     *          we have our client node
     *
     * NOTE: this only works when the client view is almost exactly the same as
     * the server view. we will need an improvement here in the future to account
     * for situations where the client view is different in structure from the
     * server view
     */
    EventReplayer.prototype.findClientNode = function (serverNodeContext) {
        serverNodeContext = (serverNodeContext || {});
        var serverNode = serverNodeContext.node;
        var root = serverNodeContext.root;
        // if no server or client root, don't do anything
        if (!root || !root.serverNode || !root.clientNode) {
            return null;
        }
        // we use the string of the node to compare to the client node & as key in
        // cache
        var serverNodeKey = serverNodeContext.nodeKey || common_1.getNodeKeyForPreboot(serverNodeContext);
        // if client node already in cache, return it
        if (this.clientNodeCache[serverNodeKey]) {
            return this.clientNodeCache[serverNodeKey];
        }
        // get the selector for client nodes
        var className = (serverNode.className || '').replace('ng-binding', '').trim();
        var selector = serverNode.tagName;
        if (serverNode.id) {
            selector += '#' + serverNode.id;
        }
        else if (className) {
            selector += '.' + className.replace(/ /g, '.');
        }
        // select all possible client nodes and look through them to try and find a
        // match
        var rootClientNode = root.clientNode;
        var clientNodes = rootClientNode.querySelectorAll(selector) || [];
        // if nothing found, then just try the tag name as a final option
        if (!clientNodes.length) {
            console.log('nothing found for ' + selector + ' so using ' + serverNode.tagName);
            clientNodes = rootClientNode.querySelectorAll(serverNode.tagName) || [];
        }
        for (var _i = 0, clientNodes_1 = clientNodes; _i < clientNodes_1.length; _i++) {
            var clientNode = clientNodes_1[_i];
            // get the key for the client node
            var clientNodeKey = common_1.getNodeKeyForPreboot({
                root: root,
                node: clientNode
            });
            // if the client node key is exact match for the server node key, then we
            // found the client node
            if (clientNodeKey === serverNodeKey) {
                this.clientNodeCache[serverNodeKey] = clientNode;
                return clientNode;
            }
        }
        // if we get here and there is one clientNode, use it as a fallback
        if (clientNodes.length === 1) {
            this.clientNodeCache[serverNodeKey] = clientNodes[0];
            return clientNodes[0];
        }
        // if we get here it means we couldn't find the client node so give the user
        // a warning
        console.warn('No matching client node found for ' + serverNodeKey + '. You can fix this by assigning this element a unique id attribute.');
        return null;
    };
    return EventReplayer;
}());
exports.EventReplayer = EventReplayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQucmVwbGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJldmVudC5yZXBsYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9DQUE0STtBQUU1STtJQUFBO1FBQ0Usb0JBQWUsR0FBK0IsRUFBRSxDQUFDO1FBQ2pELGtCQUFhLEdBQUcsS0FBSyxDQUFDO0lBc1J4QixDQUFDO0lBblJDOzs7T0FHRztJQUNILGlDQUFTLEdBQVQsVUFBVSxHQUFXO1FBQ25CLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxpQ0FBUyxHQUFUO1FBQ0UsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQVcsQ0FBQztJQUNuRixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsaUNBQVMsR0FBVDtRQUFBLGlCQWNDO1FBYkMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sQ0FBQztRQUNULENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQzVCLENBQUM7UUFFRCx3Q0FBd0M7UUFDeEMsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUM7UUFDdkQsSUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU8sSUFBSSxPQUFBLEtBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEVBQTFCLENBQTBCLENBQUMsQ0FBQztRQUVwRCxtRkFBbUY7UUFDbkYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxX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