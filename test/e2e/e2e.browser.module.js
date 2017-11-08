"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("zone.js");
require("zone.js/dist/long-stack-trace-zone.js");
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var browser_1 = require("../../src/browser");
var e2e_app_1 = require("./e2e.app");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [e2e_app_1.AppComponent],
            imports: [
                platform_browser_1.BrowserModule,
                browser_1.BrowserPrebootModule.replayEvents()
            ],
            providers: [
                { provide: e2e_app_1.CURRENT_PLATFORM, useValue: 'client view' }
            ],
            bootstrap: [e2e_app_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZTJlLmJyb3dzZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZTJlLmJyb3dzZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsNEJBQTBCO0FBQzFCLG1CQUFpQjtBQUNqQixpREFBK0M7QUFFL0Msc0NBQXlDO0FBQ3pDLDhEQUEwRDtBQUMxRCw2Q0FBeUQ7QUFDekQscUNBQTJEO0FBYTNEO0lBQUE7SUFBeUIsQ0FBQztJQUFiLFNBQVM7UUFYckIsZUFBUSxDQUFDO1lBQ1IsWUFBWSxFQUFFLENBQUMsc0JBQVksQ0FBQztZQUM1QixPQUFPLEVBQUU7Z0JBQ1AsZ0NBQWE7Z0JBQ2IsOEJBQW9CLENBQUMsWUFBWSxFQUFFO2FBQ3BDO1lBQ0QsU0FBUyxFQUFFO2dCQUNULEVBQUUsT0FBTyxFQUFFLDBCQUFnQixFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUU7YUFDdkQ7WUFDRCxTQUFTLEVBQUUsQ0FBQyxzQkFBWSxDQUFDO1NBQzFCLENBQUM7T0FDVyxTQUFTLENBQUk7SUFBRCxnQkFBQztDQUFBLEFBQTFCLElBQTBCO0FBQWIsOEJBQVMifQ==