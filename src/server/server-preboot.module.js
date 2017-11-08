"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_server_1 = require("@angular/platform-server");
var inline_preboot_code_1 = require("./inline.preboot.code");
function loadPrebootFactory(state, rendererFactory, opts, nonceOp) {
    return function () {
        var doc = state.getDocument();
        var inlinePrebootCode = inline_preboot_code_1.getInlinePrebootCode(opts);
        addInlineCodeToDocument(inlinePrebootCode, doc, rendererFactory, nonceOp.nonce);
    };
}
exports.loadPrebootFactory = loadPrebootFactory;
var NonceOp = /** @class */ (function () {
    function NonceOp(nonce) {
        this.nonce = nonce;
    }
    NonceOp = __decorate([
        __param(0, core_1.Optional()), __param(0, core_1.Inject(core_1.forwardRef(function () { return exports.PREBOOT_NONCE; }))),
        __metadata("design:paramtypes", [String])
    ], NonceOp);
    return NonceOp;
}());
exports.NonceOp = NonceOp;
exports.PREBOOT_NONCE = new core_1.InjectionToken('PrebootNonce');
exports.PREBOOT_RECORD_OPTIONS = new core_1.InjectionToken('PrebootRecordOptions');
// only thing this does is modify the document
var ServerPrebootModule = /** @class */ (function () {
    function ServerPrebootModule() {
    }
    ServerPrebootModule_1 = ServerPrebootModule;
    // user can override the default preboot options by passing them in here
    ServerPrebootModule.recordEvents = function (opts) {
        if (opts === void 0) { opts = { appRoot: 'app-root' }; }
        return {
            ngModule: ServerPrebootModule_1,
            providers: [
                { provide: exports.PREBOOT_RECORD_OPTIONS, useValue: opts },
                { provide: NonceOp, useClass: NonceOp },
                {
                    // this likely will never be injected but need something to run the
                    // factory function
                    provide: core_1.APP_BOOTSTRAP_LISTENER,
                    // generate the inline preboot code and inject it into the document
                    useFactory: loadPrebootFactory,
                    multi: true,
                    // we need access to the document and renderer
                    deps: [platform_server_1.PlatformState, core_1.RendererFactory2, exports.PREBOOT_RECORD_OPTIONS, NonceOp]
                }
            ]
        };
    };
    ServerPrebootModule = ServerPrebootModule_1 = __decorate([
        core_1.NgModule()
    ], ServerPrebootModule);
    return ServerPrebootModule;
    var ServerPrebootModule_1;
}());
exports.ServerPrebootModule = ServerPrebootModule;
function addInlineCodeToDocument(inlineCode, doc, rendererFactory, nonce) {
    var renderType = { id: '-1', encapsulation: core_1.ViewEncapsulation.None, styles: [], data: {} };
    var renderer = rendererFactory.createRenderer(doc, renderType);
    var script = renderer.createElement('script');
    if (nonce) {
        renderer.setProperty(script, 'nonce', nonce);
    }
    renderer.setValue(script, inlineCode);
    renderer.insertBefore(doc.head, script, doc.head.firstChild);
}
exports.addInlineCodeToDocument = addInlineCodeToDocument;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLXByZWJvb3QubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VydmVyLXByZWJvb3QubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0NBV3VCO0FBQ3ZCLDREQUF5RDtBQUV6RCw2REFBNkQ7QUFFN0QsNEJBQW1DLEtBQW9CLEVBQUUsZUFBaUMsRUFBRSxJQUEwQixFQUFFLE9BQWdCO0lBQ3RJLE1BQU0sQ0FBQztRQUNMLElBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNoQyxJQUFNLGlCQUFpQixHQUFHLDBDQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JELHVCQUF1QixDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxlQUFlLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xGLENBQUMsQ0FBQztBQUNKLENBQUM7QUFORCxnREFNQztBQUVEO0lBQ0UsaUJBQXdFLEtBQWE7UUFBYixVQUFLLEdBQUwsS0FBSyxDQUFRO0lBQUksQ0FBQztJQUQvRSxPQUFPO1FBQ0wsV0FBQSxlQUFRLEVBQUUsQ0FBQSxFQUFFLFdBQUEsYUFBTSxDQUFDLGlCQUFVLENBQUMsY0FBTSxPQUFBLHFCQUFhLEVBQWIsQ0FBYSxDQUFDLENBQUMsQ0FBQTs7T0FEckQsT0FBTyxDQUVuQjtJQUFELGNBQUM7Q0FBQSxBQUZELElBRUM7QUFGWSwwQkFBTztBQUlQLFFBQUEsYUFBYSxHQUFHLElBQUkscUJBQWMsQ0FBUyxjQUFjLENBQUMsQ0FBQztBQUMzRCxRQUFBLHNCQUFzQixHQUFHLElBQUkscUJBQWMsQ0FBdUIsc0JBQXNCLENBQUMsQ0FBQztBQUV2Ryw4Q0FBOEM7QUFFOUM7SUFBQTtJQXdCQSxDQUFDOzRCQXhCWSxtQkFBbUI7SUFDOUIsd0VBQXdFO0lBQ2pFLGdDQUFZLEdBQW5CLFVBQW9CLElBQW9EO1FBQXBELHFCQUFBLEVBQUEsU0FBK0IsT0FBTyxFQUFFLFVBQVUsRUFBRTtRQUN0RSxNQUFNLENBQUM7WUFDTCxRQUFRLEVBQUUscUJBQW1CO1lBQzdCLFNBQVMsRUFBRTtnQkFDVCxFQUFFLE9BQU8sRUFBRSw4QkFBc0IsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUNuRCxFQUFFLE9BQU8sRUFBRyxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRTtnQkFDeEM7b0JBQ0UsbUVBQW1FO29CQUNuRSxtQkFBbUI7b0JBQ25CLE9BQU8sRUFBRSw2QkFBc0I7b0JBRS9CLG1FQUFtRTtvQkFDbkUsVUFBVSxFQUFFLGtCQUFrQjtvQkFFOUIsS0FBSyxFQUFFLElBQUk7b0JBRVgsOENBQThDO29CQUM5QyxJQUFJLEVBQUUsQ0FBQywrQkFBYSxFQUFFLHVCQUFnQixFQUFFLDhCQUFzQixFQUFFLE9BQU8sQ0FBQztpQkFDekU7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDO0lBdkJVLG1CQUFtQjtRQUQvQixlQUFRLEVBQUU7T0FDRSxtQkFBbUIsQ0F3Qi9CO0lBQUQsMEJBQUM7O0NBQUEsQUF4QkQsSUF3QkM7QUF4Qlksa0RBQW1CO0FBMEJoQyxpQ0FBd0MsVUFBa0IsRUFBRSxHQUFhLEVBQUUsZUFBaUMsRUFBRSxLQUFhO0lBQ3pILElBQU0sVUFBVSxHQUFrQixFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLHdCQUFpQixDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUM1RyxJQUFNLFFBQVEsR0FBRyxlQUFlLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNqRSxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2hELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDUixRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUNELFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3RDLFFBQVEsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMvRCxDQUFDO0FBVEQsMERBU0MifQ==