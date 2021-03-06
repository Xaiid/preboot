"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("jasmine");
require("zone.js");
require("zone.js/dist/long-stack-trace-zone.js");
var core_1 = require("@angular/core");
var compiler_1 = require("@angular/compiler");
var platform_server_1 = require("@angular/platform-server");
var platform_browser_1 = require("@angular/platform-browser");
var src_1 = require("../../../src");
describe('UNIT TEST server-preboot.module', function () {
    describe('recordEvents()', function () {
        it('should render on server with JIT compiler', function (done) {
            var AppComponent = /** @class */ (function () {
                function AppComponent() {
                    this.title = 'app works!';
                }
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'app-root',
                        template: "<h1>{{title}}</h1>",
                    })
                ], AppComponent);
                return AppComponent;
            }());
            var AppModule = /** @class */ (function () {
                function AppModule() {
                }
                AppModule = __decorate([
                    core_1.NgModule({
                        declarations: [AppComponent],
                        imports: [
                            platform_browser_1.BrowserModule.withServerTransition({ appId: 'my-app-id' }),
                            platform_server_1.ServerModule,
                            src_1.ServerPrebootModule.recordEvents({ appRoot: 'app-root' })
                        ],
                        bootstrap: [AppComponent]
                    })
                ], AppModule);
                return AppModule;
            }());
            // get the JIT compiler (not exposed publically, so need to inject it)
            var injector = core_1.ReflectiveInjector.resolveAndCreate([compiler_1.COMPILER_PROVIDERS]);
            var jitCompiler = injector.get(compiler_1.JitCompiler);
            // use the JIT compiler to turn our AppModule into a factory
            return jitCompiler.compileModuleAsync(AppModule)
                .then(function (factory) { return platform_server_1.renderModuleFactory(factory, {
                url: '/',
                document: "\n          <html>\n            <head>\n              <title>Preboot Test</title>\n            </head>\n            <body>\n              <app-root></app-root>\n            </body>\n          </html>\n        "
            }); })
                .then(function (html) {
                expect(html).toMatch(/prebootData/);
                expect(html).toMatch(/app works/);
                done();
            })
                .catch(done);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLXByZWJvb3QubW9kdWxlLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXJ2ZXItcHJlYm9vdC5tb2R1bGUuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLDRCQUEwQjtBQUMxQixtQkFBaUI7QUFDakIsbUJBQWlCO0FBQ2pCLGlEQUErQztBQUUvQyxzQ0FBeUY7QUFDekYsOENBQW9FO0FBQ3BFLDREQUE2RTtBQUM3RSw4REFBMEQ7QUFDMUQsb0NBQW1EO0FBRW5ELFFBQVEsQ0FBQyxpQ0FBaUMsRUFBRTtJQUMxQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsRUFBRSxDQUFDLDJDQUEyQyxFQUFFLFVBQVUsSUFBSTtZQU01RDtnQkFKQTtvQkFLRSxVQUFLLEdBQUcsWUFBWSxDQUFDO2dCQUN2QixDQUFDO2dCQUZLLFlBQVk7b0JBSmpCLGdCQUFTLENBQUM7d0JBQ1QsUUFBUSxFQUFFLFVBQVU7d0JBQ3BCLFFBQVEsRUFBRSxvQkFBb0I7cUJBQy9CLENBQUM7bUJBQ0ksWUFBWSxDQUVqQjtnQkFBRCxtQkFBQzthQUFBLEFBRkQsSUFFQztZQVdEO2dCQUFBO2dCQUFrQixDQUFDO2dCQUFiLFNBQVM7b0JBVGQsZUFBUSxDQUFDO3dCQUNSLFlBQVksRUFBRSxDQUFDLFlBQVksQ0FBQzt3QkFDNUIsT0FBTyxFQUFFOzRCQUNQLGdDQUFhLENBQUMsb0JBQW9CLENBQUMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLENBQUM7NEJBQzFELDhCQUFZOzRCQUNaLHlCQUFtQixDQUFDLFlBQVksQ0FBQyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQzt5QkFDMUQ7d0JBQ0QsU0FBUyxFQUFFLENBQUMsWUFBWSxDQUFDO3FCQUMxQixDQUFDO21CQUNJLFNBQVMsQ0FBSTtnQkFBRCxnQkFBQzthQUFBLEFBQW5CLElBQW1CO1lBRW5CLHNFQUFzRTtZQUN0RSxJQUFNLFFBQVEsR0FBRyx5QkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLDZCQUFrQixDQUFDLENBQUMsQ0FBQztZQUMzRSxJQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLHNCQUFXLENBQUMsQ0FBQztZQUU5Qyw0REFBNEQ7WUFDNUQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUM7aUJBRzdDLElBQUksQ0FBQyxVQUFDLE9BQXNDLElBQUssT0FBQSxxQ0FBbUIsQ0FBQyxPQUFPLEVBQUU7Z0JBQzdFLEdBQUcsRUFBRSxHQUFHO2dCQUNSLFFBQVEsRUFBRSxtTkFTWDthQUNBLENBQUMsRUFaZ0QsQ0FZaEQsQ0FBQztpQkFDRixJQUFJLENBQUMsVUFBQyxJQUFZO2dCQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNsQyxJQUFJLEVBQUUsQ0FBQztZQUNULENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=