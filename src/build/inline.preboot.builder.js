"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var uglify_js_1 = require("uglify-js");
var server_1 = require("../server");
var fs = require("fs");
var path = require("path");
var distDir = path.join(__dirname, '../../dist');
var filePath = path.join(distDir, 'preboot.js');
var fileMinPath = path.join(distDir, 'preboot.min.js');
var eventRecorderCode = server_1.getEventRecorderCode();
var eventRecorderModule = "module.exports = function () {\n  " + eventRecorderCode + "\n};\n";
var eventRecorderCodeMin = uglify_js_1.minify(eventRecorderCode).code;
var eventRecorderModuleMin = "module.exports = function(){" + eventRecorderCodeMin + "}";
fs.writeFileSync(filePath, eventRecorderModule);
fs.writeFileSync(fileMinPath, eventRecorderModuleMin);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5saW5lLnByZWJvb3QuYnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImlubGluZS5wcmVib290LmJ1aWxkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0QkFBMEI7QUFDMUIsdUNBQW1DO0FBQ25DLG9DQUFpRDtBQUNqRCx1QkFBMEI7QUFDMUIsMkJBQThCO0FBRTlCLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ25ELElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ2xELElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGdCQUFnQixDQUFDLENBQUM7QUFDekQsSUFBTSxpQkFBaUIsR0FBRyw2QkFBb0IsRUFBRSxDQUFDO0FBQ2pELElBQU0sbUJBQW1CLEdBQUcsdUNBQ3hCLGlCQUFpQixXQUVwQixDQUFDO0FBQ0YsSUFBTSxvQkFBb0IsR0FBRyxrQkFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDO0FBQzVELElBQU0sc0JBQXNCLEdBQUcsaUNBQStCLG9CQUFvQixNQUFHLENBQUM7QUFFdEYsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUNoRCxFQUFFLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDIn0=