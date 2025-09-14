"use strict";
exports.__esModule = true;
var react_1 = require("react");
var reactstrap_1 = require("reactstrap");
// Update the import path and filename to match the actual file location and case
var BreadCrumb_1 = require("../../../Components/Common/BreadCrumb");
var UiContent_1 = require("../../../Components/Common/UiContent");
// import { Link } from "react-router-dom";
// Import the CustomerList component you created
// import UpdateFrom from "./updateForm";
// import SelectionPage from "./SelectionPage";
var RechargeDetails_1 = require("./RechargeDetails");
// NOTE: The code below for static tables is kept for context from your template
// You can remove these if they are not needed for the code snippets feature
// import {
//   DefaultTables,
//   StrippedRow,
//   TablesColors,
//   HoverableRows,
//   CardTables,
//   ActiveTables,
//   BorderedTables,
//   TablesBorderColors,
//   TablesWithoutBorders,
//   SmallTables,
//   TableHead,
//   TableFoot,
//   Captions,
//   TableNesting,
//   Variants,
//   VerticalAlignment,
//   ResponsiveTables,
//   StripedColumnsTables,
// } from "./BasicTablesCode";
var UpdateSubscriber = function () {
    document.title = "Fibepe - Admin";
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(UiContent_1["default"], null),
        react_1["default"].createElement("div", { className: "page-content" },
            react_1["default"].createElement(reactstrap_1.Container, { fluid: true },
                react_1["default"].createElement(BreadCrumb_1["default"], { title: "Recharge Details", pageTitle: "Tables" }),
                react_1["default"].createElement(reactstrap_1.Row, null,
                    react_1["default"].createElement(reactstrap_1.Col, { lg: 12 },
                        react_1["default"].createElement(reactstrap_1.Card, null,
                            react_1["default"].createElement(reactstrap_1.CardBody, null,
                                react_1["default"].createElement(RechargeDetails_1["default"], null)))))))));
};
exports["default"] = UpdateSubscriber;
