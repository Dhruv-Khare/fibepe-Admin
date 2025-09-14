"use strict";
exports.__esModule = true;
var react_1 = require("react");
var reactstrap_1 = require("reactstrap");
var BreadCrumb_1 = require("../../Components/Common/BreadCrumb");
var ActiveProjects_1 = require("./ActiveProjects");
var Chat_1 = require("./Chat");
var MyTasks_1 = require("./MyTasks");
var ProjectsOverview_1 = require("./ProjectsOverview");
var ProjectsStatus_1 = require("./ProjectsStatus");
var TeamMembers_1 = require("./TeamMembers");
var UpcomingSchedules_1 = require("./UpcomingSchedules");
var Widgets_1 = require("./Widgets");
var DashboardProject = function () {
    document.title = "Fibepe - Admin";
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: "page-content" },
            react_1["default"].createElement(reactstrap_1.Container, { fluid: true },
                react_1["default"].createElement(BreadCrumb_1["default"], { title: "Projects", pageTitle: "Dashboards" }),
                react_1["default"].createElement(reactstrap_1.Row, { className: "project-wrapper" },
                    react_1["default"].createElement(reactstrap_1.Col, { xxl: 8 },
                        react_1["default"].createElement(Widgets_1["default"], null),
                        react_1["default"].createElement(ProjectsOverview_1["default"], null)),
                    react_1["default"].createElement(UpcomingSchedules_1["default"], null)),
                react_1["default"].createElement(reactstrap_1.Row, null,
                    react_1["default"].createElement(ActiveProjects_1["default"], null),
                    react_1["default"].createElement(MyTasks_1["default"], null)),
                react_1["default"].createElement(reactstrap_1.Row, null,
                    react_1["default"].createElement(TeamMembers_1["default"], null),
                    react_1["default"].createElement(Chat_1["default"], null),
                    react_1["default"].createElement(ProjectsStatus_1["default"], null))))));
};
exports["default"] = DashboardProject;
