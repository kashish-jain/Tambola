"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var react_1 = require("react");
var react_2 = require("react");
require("../css/App.css");
var socket_io_client_1 = require("socket.io-client");
var EnterName_1 = require("./EnterName");
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        var url = process.env.REACT_APP_BACKEND_URL || ""; // TODO: THROW ERROR IF URL EMPTY
        _this.state = {
            socket: socket_io_client_1["default"](url)
        };
        return _this;
    }
    App.prototype.render = function () {
        return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("div", { className: "App" },
                react_1["default"].createElement(EnterName_1["default"], { socket: this.state.socket }))));
    };
    return App;
}(react_2.Component));
exports["default"] = App;
