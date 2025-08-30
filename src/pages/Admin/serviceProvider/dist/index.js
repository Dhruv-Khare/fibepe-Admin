"use strict";
exports.__esModule = true;
var react_1 = require("react");
var reactstrap_1 = require("reactstrap");
// Update the import path and filename to match the actual file location and case
var BreadCrumb_1 = require("../../../Components/Common/BreadCrumb");
var UiContent_1 = require("../../../Components/Common/UiContent");
var serviceProvider_1 = require("./serviceProvider");
var SupplierHeader_1 = require("./SupplierHeader");
var ServiceProviderPage = function () {
    document.title = "Fibepe-Admin";
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(UiContent_1["default"], null),
        react_1["default"].createElement("div", { className: "page-content" },
            react_1["default"].createElement(reactstrap_1.Container, { fluid: true },
                react_1["default"].createElement(BreadCrumb_1["default"], { title: "Service Providers ", pageTitle: "Tables" }),
                react_1["default"].createElement("div", { style: {
                        position: "sticky",
                        top: 70,
                        zIndex: 1,
                        backdropFilter: "blur(10px)",
                        paddingBottom: "5px"
                    } },
                    react_1["default"].createElement(reactstrap_1.Row, null,
                        react_1["default"].createElement(reactstrap_1.Col, { xs: 12 },
                            react_1["default"].createElement(SupplierHeader_1["default"], null)))),
                react_1["default"].createElement(reactstrap_1.Row, null,
                    react_1["default"].createElement(reactstrap_1.Col, { lg: 12 },
                        react_1["default"].createElement(reactstrap_1.Card, null,
                            react_1["default"].createElement(reactstrap_1.CardBody, null,
                                react_1["default"].createElement(serviceProvider_1["default"], null)))))))));
};
exports["default"] = ServiceProviderPage;
