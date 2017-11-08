"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var platform_server_1 = require("@angular/platform-server");
var server_1 = require("../../src/server");
var e2e_app_1 = require("./e2e.app");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [e2e_app_1.AppComponent],
            imports: [
                platform_browser_1.BrowserModule.withServerTransition({ appId: 'foo' }),
                platform_server_1.ServerModule,
                server_1.ServerPrebootModule.recordEvents({ appRoot: 'app-root', minify: false })
            ],
            providers: [
                { provide: e2e_app_1.CURRENT_PLATFORM, useValue: 'server view' }
            ],
            bootstrap: [e2e_app_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZTJlLnNlcnZlci5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlMmUuc2VydmVyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLHNDQUF5QztBQUN6Qyw4REFBMEQ7QUFDMUQsNERBQXdEO0FBQ3hELDJDQUF1RDtBQUN2RCxxQ0FBMkQ7QUFjM0Q7SUFBQTtJQUF5QixDQUFDO0lBQWIsU0FBUztRQVpyQixlQUFRLENBQUM7WUFDUixZQUFZLEVBQUUsQ0FBQyxzQkFBWSxDQUFDO1lBQzVCLE9BQU8sRUFBRTtnQkFDUCxnQ0FBYSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDO2dCQUNwRCw4QkFBWTtnQkFDWiw0QkFBbUIsQ0FBQyxZQUFZLENBQUMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQzthQUN6RTtZQUNELFNBQVMsRUFBRTtnQkFDVCxFQUFFLE9BQU8sRUFBRSwwQkFBZ0IsRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFO2FBQ3ZEO1lBQ0QsU0FBUyxFQUFFLENBQUMsc0JBQVksQ0FBQztTQUMxQixDQUFDO09BQ1csU0FBUyxDQUFJO0lBQUQsZ0JBQUM7Q0FBQSxBQUExQixJQUEwQjtBQUFiLDhCQUFTIn0=