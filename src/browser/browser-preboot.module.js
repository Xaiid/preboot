"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("rxjs/add/operator/filter");
require("rxjs/add/operator/first");
var core_1 = require("@angular/core");
var event_replayer_1 = require("./event.replayer");
function eventReplayerFactory(appRef, replayer, opts) {
    return function () {
        // if noReplay it means user is going to call replayAll() manually
        if (!opts.noReplay) {
            // we will wait until the application is stable, then replay
            appRef.isStable
                .filter(function (stable) { return stable; })
                .first()
                .subscribe(function () {
                replayer.replayAll();
            });
        }
    };
}
exports.eventReplayerFactory = eventReplayerFactory;
exports.PREBOOT_REPLAY_OPTIONS = new core_1.InjectionToken('PrebootReplayOptions');
// only thing this does is replay events
var BrowserPrebootModule = /** @class */ (function () {
    function BrowserPrebootModule() {
    }
    BrowserPrebootModule_1 = BrowserPrebootModule;
    // user can override the default preboot options by passing them in here
    BrowserPrebootModule.replayEvents = function (opts) {
        if (opts === void 0) { opts = {}; }
        return {
            ngModule: BrowserPrebootModule_1,
            providers: [
                event_replayer_1.EventReplayer,
                { provide: exports.PREBOOT_REPLAY_OPTIONS, useValue: opts },
                {
                    // run this once the app as bootstrapped
                    provide: core_1.APP_BOOTSTRAP_LISTENER,
                    // generate the inline preboot code and inject it into the document
                    useFactory: eventReplayerFactory,
                    multi: true,
                    // we need access to the document and renderer
                    deps: [core_1.ApplicationRef, event_replayer_1.EventReplayer, exports.PREBOOT_REPLAY_OPTIONS]
                }
            ]
        };
    };
    BrowserPrebootModule = BrowserPrebootModule_1 = __decorate([
        core_1.NgModule()
    ], BrowserPrebootModule);
    return BrowserPrebootModule;
    var BrowserPrebootModule_1;
}());
exports.BrowserPrebootModule = BrowserPrebootModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlci1wcmVib290Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJyb3dzZXItcHJlYm9vdC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxvQ0FBa0M7QUFDbEMsbUNBQWlDO0FBQ2pDLHNDQUFzSDtBQUV0SCxtREFBaUQ7QUFFakQsOEJBQXFDLE1BQXNCLEVBQUUsUUFBdUIsRUFBRSxJQUEwQjtJQUM5RyxNQUFNLENBQUM7UUFDTCxrRUFBa0U7UUFDbEUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNuQiw0REFBNEQ7WUFDNUQsTUFBTSxDQUFDLFFBQVE7aUJBQ1osTUFBTSxDQUFDLFVBQUEsTUFBTSxJQUFJLE9BQUEsTUFBTSxFQUFOLENBQU0sQ0FBQztpQkFDeEIsS0FBSyxFQUFFO2lCQUNQLFNBQVMsQ0FBQztnQkFDVCxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDdkIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0gsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQWJELG9EQWFDO0FBRVksUUFBQSxzQkFBc0IsR0FBRyxJQUFJLHFCQUFjLENBQXVCLHNCQUFzQixDQUFDLENBQUM7QUFFdkcsd0NBQXdDO0FBRXhDO0lBQUE7SUF1QkEsQ0FBQzs2QkF2Qlksb0JBQW9CO0lBQy9CLHdFQUF3RTtJQUNqRSxpQ0FBWSxHQUFuQixVQUFvQixJQUErQjtRQUEvQixxQkFBQSxFQUFBLFNBQStCO1FBQ2pELE1BQU0sQ0FBQztZQUNMLFFBQVEsRUFBRSxzQkFBb0I7WUFDOUIsU0FBUyxFQUFFO2dCQUNULDhCQUFhO2dCQUNiLEVBQUUsT0FBTyxFQUFFLDhCQUFzQixFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQ25EO29CQUNFLHdDQUF3QztvQkFDeEMsT0FBTyxFQUFFLDZCQUFzQjtvQkFFL0IsbUVBQW1FO29CQUNuRSxVQUFVLEVBQUUsb0JBQW9CO29CQUVoQyxLQUFLLEVBQUUsSUFBSTtvQkFFWCw4Q0FBOEM7b0JBQzlDLElBQUksRUFBRSxDQUFDLHFCQUFjLEVBQUUsOEJBQWEsRUFBRSw4QkFBc0IsQ0FBQztpQkFDOUQ7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDO0lBdEJVLG9CQUFvQjtRQURoQyxlQUFRLEVBQUU7T0FDRSxvQkFBb0IsQ0F1QmhDO0lBQUQsMkJBQUM7O0NBQUEsQUF2QkQsSUF1QkM7QUF2Qlksb0RBQW9CIn0=