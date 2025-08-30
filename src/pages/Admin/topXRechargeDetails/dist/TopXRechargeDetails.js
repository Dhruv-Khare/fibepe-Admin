"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
// import { co } from "@fullcalendar/core/internal-common";
var react_1 = require("react");
// --- CONFIGURATION ---
var POLLING_INTERVAL_MS = 5000;
var ITEMS_PER_PAGE = 10;
var RechargeAPI_URL = "https://masteradmin.fibepe.com/api/Master/TopXRechargeDetail";
// --- REUSABLE BUTTON COMPONENT ---
var Button = function (_a) {
    var _b = _a.color, color = _b === void 0 ? "secondary" : _b, _c = _a.outline, outline = _c === void 0 ? false : _c, children = _a.children, props = __rest(_a, ["color", "outline", "children"]);
    var colorClass = outline ? "btn-outline-" + color : "btn-" + color;
    var className = "btn " + colorClass;
    return (react_1["default"].createElement("button", __assign({ type: "button", className: className }, props), children));
};
// --- MAIN COMPONENT ---
var TopXRechargeDetailTable = function () {
    var _a = react_1.useState([]), records = _a[0], setRecords = _a[1];
    var _b = react_1.useState(""), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = react_1.useState({
        key: "LedgerId",
        direction: "descending"
    }), sortConfig = _c[0], setSortConfig = _c[1];
    var _d = react_1.useState(1), currentPage = _d[0], setCurrentPage = _d[1];
    var _e = react_1.useState(true), isLoading = _e[0], setIsLoading = _e[1];
    var _f = react_1.useState(null), error = _f[0], setError = _f[1];
    var _g = react_1.useState(null), fibepeId = _g[0], setFibepeId = _g[1];
    react_1.useEffect(function () {
        var userString = localStorage.getItem("authUser");
        var id = null;
        if (userString) {
            try {
                var user = JSON.parse(userString);
                id = user.FibePeID;
                setFibepeId(id);
            }
            catch (e) {
                console.error("Failed to parse user data from localStorage", e);
                setError("Invalid user data in session. Please log in again.");
                setIsLoading(false);
                return;
            }
        }
        if (!id) {
            setError("User ID not found in session. Please log in again.");
            setIsLoading(false);
            return;
        }
        // const dynamicApiUrl = `RechargeAPI_URL`;
        // Function to fetch data and update the state
        var fetchDataAndSetRecords = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, data, e_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setError(null);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch(RechargeAPI_URL, {
                                method: "POST",
                                headers: { Accept: "*/*" },
                                body: ""
                            })];
                    case 2:
                        response = _b.sent();
                        if (!response.ok)
                            throw new Error("HTTP error! Status: " + response.status);
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _b.sent();
                        if (data.IsSuccess && ((_a = data.payLoad) === null || _a === void 0 ? void 0 : _a.AllRechargeDetail)) {
                            setRecords(data.payLoad.AllRechargeDetail);
                        }
                        else {
                            setRecords([]);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _b.sent();
                        setError(e_1.message);
                        console.error("Fetch error:", e_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        // --- FIX: This is the corrected part ---
        // 1. Initial Load: Show loading spinner only once
        var initialLoad = function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setIsLoading(true);
                        return [4 /*yield*/, fetchDataAndSetRecords()];
                    case 1:
                        _a.sent();
                        setIsLoading(false);
                        return [2 /*return*/];
                }
            });
        }); };
        initialLoad();
        // 2. Polling: Set up the interval to fetch data without touching isLoading
        var intervalId = setInterval(fetchDataAndSetRecords, POLLING_INTERVAL_MS);
        // Cleanup: Clear the interval when the component unmounts
        return function () { return clearInterval(intervalId); };
    }, []);
    // STEP 1: Create a memoized list of filtered records.
    // This only recalculates when the main records or the search term changes.
    var filteredRecords = react_1.useMemo(function () {
        return records.filter(function (record) {
            return Object.values(record).some(function (value) {
                return String(value).toLowerCase().includes(searchTerm.toLowerCase());
            });
        });
    }, [records, searchTerm]);
    // STEP 2: Use the filtered list for sorting and pagination.
    // This now recalculates when the filtered list, sort config, or current page changes.
    var paginatedRecords = react_1.useMemo(function () {
        var sortedRecords = __spreadArrays(filteredRecords).sort(function (a, b) {
            var aValue = a[sortConfig.key];
            var bValue = b[sortConfig.key];
            if (aValue < bValue) {
                return sortConfig.direction === "ascending" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === "ascending" ? 1 : -1;
            }
            return 0;
        });
        var startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredRecords, sortConfig, currentPage]);
    // STEP 3: Calculate total pages from the *same* filtered list.
    var totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
    var handleSort = function (key) {
        var direction = sortConfig.key === key && sortConfig.direction === "ascending"
            ? "descending"
            : "ascending";
        setSortConfig({ key: key, direction: direction });
        setCurrentPage(1);
    };
    if (isLoading) {
        return (react_1["default"].createElement("div", { className: "text-center p-5" },
            react_1["default"].createElement("h5", null, "Loading Recharge Details..."),
            react_1["default"].createElement("div", { className: "spinner-border text-primary", role: "status" },
                react_1["default"].createElement("span", { className: "visually-hidden" }, "Loading..."))));
    }
    if (error) {
        return (react_1["default"].createElement("div", { className: "alert alert-danger mx-3" },
            react_1["default"].createElement("strong", null, "Error:"),
            " ",
            error));
    }
    // Add this array inside your RechargeDetailTable component
    var tableHeaders = [
        { key: "LedgerId", label: "Ledger Id" },
        { key: "FibepeId", label: "Fibepe Id" },
        { key: "Number", label: "Number" },
        { key: "OperatorName", label: "Operator Name" },
        { key: "CircleName", label: "Circle Name" },
        { key: "ServiceType", label: "Service Type" },
        { key: "Amount", label: "Amount" },
        { key: "FinalStatus", label: "Final Status" },
        { key: "CreatedDate", label: "Created Date" },
        { key: "OperatorRefId", label: "Operator Ref Id" },
    ];
    return (react_1["default"].createElement("div", { className: "card-body" },
        react_1["default"].createElement("div", { className: "row g-4 mb-3" },
            react_1["default"].createElement("div", { className: "col-sm" },
                react_1["default"].createElement("div", { className: "d-flex justify-content-sm-end" },
                    react_1["default"].createElement("div", { className: "search-box ms-2", style: { position: "relative" } },
                        react_1["default"].createElement("input", { id: "recharge-search", name: "recharge-search", type: "text", className: "form-control", placeholder: "Search...", value: searchTerm, onChange: function (e) {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            } }),
                        react_1["default"].createElement("i", { className: "ri-search-line search-icon", style: {
                                position: "absolute",
                                top: "50%",
                                right: "10px",
                                transform: "translateY(-50%)",
                                pointerEvents: "none"
                            } }))))),
        react_1["default"].createElement("div", { className: "table-responsive table-card mt-3 mb-1" },
            react_1["default"].createElement("table", { className: "table align-middle table-nowrap text-center", id: "rechargeTable" },
                react_1["default"].createElement("thead", { className: "table-light" },
                    react_1["default"].createElement("tr", null, tableHeaders.map(function (header) { return (react_1["default"].createElement("th", { key: header.key, style: { cursor: "pointer", verticalAlign: "middle" }, onClick: function () { return handleSort(header.key); } },
                        react_1["default"].createElement("div", { style: {
                                display: "flex",
                                alignItems: "baseline",
                                justifyContent: "center",
                                gap: "0.5rem"
                            } },
                            react_1["default"].createElement("span", null, header.label),
                            react_1["default"].createElement("span", { style: {
                                    width: "1em",
                                    visibility: sortConfig.key === header.key ? "visible" : "hidden"
                                } }, sortConfig.direction === "ascending" ? "▲" : "▼")))); }))),
                react_1["default"].createElement("tbody", { className: "list form-check-all" }, paginatedRecords.length > 0 ? (paginatedRecords.map(function (record) { return (react_1["default"].createElement("tr", { key: record.LedgerId },
                    react_1["default"].createElement("td", null, record.LedgerId),
                    react_1["default"].createElement("td", null, record.FibepeId),
                    react_1["default"].createElement("td", null, record.Number),
                    react_1["default"].createElement("td", null, record.OperatorName),
                    react_1["default"].createElement("td", null, record.CircleName),
                    react_1["default"].createElement("td", null, record.ServiceType),
                    react_1["default"].createElement("td", null,
                        "\u20B9",
                        record.Amount),
                    react_1["default"].createElement("td", null,
                        react_1["default"].createElement("span", { className: "badge " + (record.FinalStatus.toLowerCase() === "success"
                                ? "bg-success-subtle text-success"
                                : record.FinalStatus.toLowerCase() === "failed"
                                    ? "bg-danger-subtle text-danger"
                                    : "bg-warning-subtle text-warning") }, record.FinalStatus)),
                    react_1["default"].createElement("td", null, record.CreatedDate),
                    react_1["default"].createElement("td", null, record.OperatorRefId))); })) : (react_1["default"].createElement("tr", null,
                    react_1["default"].createElement("td", { colSpan: 10, className: "text-center py-5" },
                        react_1["default"].createElement("h5", null, "Sorry! No Result Found"))))))),
        react_1["default"].createElement("div", { className: "d-flex justify-content-end" },
            react_1["default"].createElement("div", { className: "pagination-wrap hstack gap-2" },
                react_1["default"].createElement(Button, { outline: true, onClick: function () { return setCurrentPage(function (p) { return Math.max(p - 1, 1); }); }, disabled: currentPage === 1 }, "Previous"),
                react_1["default"].createElement("span", { className: "p-2" },
                    "Page ",
                    currentPage,
                    " of ",
                    totalPages || 1),
                react_1["default"].createElement(Button, { outline: true, onClick: function () { return setCurrentPage(function (p) { return Math.min(p + 1, totalPages); }); }, disabled: currentPage === totalPages || totalPages === 0 }, "Next")))));
};
exports["default"] = TopXRechargeDetailTable;
