"use strict";
exports.__esModule = true;
var react_1 = require("react");
require("bootstrap/dist/css/bootstrap.min.css");
//import Scss
require("./assets/scss/themes.scss");
//imoprt Route
var react_router_dom_1 = require("react-router-dom");
// Import Redux hooks
var react_redux_1 = require("react-redux");
var reactstrap_1 = require("reactstrap");
// Import actions and helpers
var reducer_1 = require("./slices/auth/login/reducer"); // Adjust the import path as per your project structure
var api_helper_1 = require("./helpers/api_helper"); // Adjust the import path
//import components
var CoverSignIn_1 = require("./pages/AuthenticationInner/Login/CoverSignIn");
// import DashboardJobs from "./pages/DashboardJob/index";
var index_1 = require("pages/DashboardProject/index");
var AuthProtected_1 = require("./Routes/AuthProtected");
var PublicRoutes_1 = require("./Routes/PublicRoutes");
var index_2 = require("../src/Layouts/index");
var index_3 = require("pages/Admin/RechargeDetails/index");
var index_4 = require("pages/Admin/UtilityDetails/index");
var index_5 = require("pages/Admin/topXRechargeDetails/index");
var index_6 = require("pages/Admin/topXUtilityDetails/index");
var index_7 = require("pages/Admin/serviceProvider/index");
// Fake Backend (if you are using it)
var fakeBackend_1 = require("./helpers/AuthType/fakeBackend");
fakeBackend_1["default"]();
function App() {
    var dispatch = react_redux_1.useDispatch();
    // 1. Add a loading state
    var _a = react_1.useState(true), loading = _a[0], setLoading = _a[1];
    // 2. Add useEffect to check for auth token on initial load
    react_1.useEffect(function () {
        try {
            var authUser = localStorage.getItem("authUser");
            if (authUser) {
                var userData = JSON.parse(authUser);
                // Restore the session in Redux
                dispatch(reducer_1.loginSuccess(userData));
                // Set the authorization token for API calls
                if (userData.token) {
                    api_helper_1.setAuthorization(userData.token);
                }
            }
        }
        catch (error) {
            console.error("Failed to initialize auth from localStorage:", error);
        }
        finally {
            // Finish loading, whether token was found or not
            setLoading(false);
        }
    }, [dispatch]);
    // 3. Render a loading indicator while checking for the token
    if (loading) {
        return (react_1["default"].createElement("div", { style: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh"
            } },
            react_1["default"].createElement(reactstrap_1.Spinner, { color: "primary" }, "Loading...")));
    }
    // 4. Once loading is false, render the routes
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(react_router_dom_1.Routes, null,
            react_1["default"].createElement(react_router_dom_1.Route, { path: "/login", element: react_1["default"].createElement(PublicRoutes_1["default"], null,
                    react_1["default"].createElement(CoverSignIn_1["default"], null)) }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: "/dashboard", element: react_1["default"].createElement(AuthProtected_1["default"], null,
                    react_1["default"].createElement(index_2["default"], null,
                        react_1["default"].createElement(index_1["default"], null))) }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: "/recharge-details", element: react_1["default"].createElement(AuthProtected_1["default"], null,
                    react_1["default"].createElement(index_2["default"], null,
                        react_1["default"].createElement(index_3["default"], null))) }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: "/utility-details", element: react_1["default"].createElement(AuthProtected_1["default"], null,
                    react_1["default"].createElement(index_2["default"], null,
                        react_1["default"].createElement(index_4["default"], null))) }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: "/topX-recharge-details", element: react_1["default"].createElement(AuthProtected_1["default"], null,
                    react_1["default"].createElement(index_2["default"], null,
                        react_1["default"].createElement(index_5["default"], null))) }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: "/topX-utility-details", element: react_1["default"].createElement(AuthProtected_1["default"], null,
                    react_1["default"].createElement(index_2["default"], null,
                        react_1["default"].createElement(index_6["default"], null))) }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: "/service-provider", element: react_1["default"].createElement(AuthProtected_1["default"], null,
                    react_1["default"].createElement(index_2["default"], null,
                        react_1["default"].createElement(index_7["default"], null))) }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: "*", element: react_1["default"].createElement(PublicRoutes_1["default"], null,
                    react_1["default"].createElement(CoverSignIn_1["default"], null)) }))));
}
exports["default"] = App;
