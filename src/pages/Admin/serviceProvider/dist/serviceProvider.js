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
exports.__esModule = true;
var react_1 = require("react");
// Import the new card component
var ServiceProviderCard_1 = require("./ServiceProviderCard");
var SuccessModal_1 = require("./SuccessModal"); // <-- ADD THIS IMPORT
// --- MAIN COMPONENT ---
var ServiceProviderDisplay = function () {
    var _a = react_1.useState([]), operators = _a[0], setOperators = _a[1];
    var _b = react_1.useState(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    // const [updateMessage, setUpdateMessage] = useState<string | null>(null);
    // ADD THESE TWO LINES
    var _d = react_1.useState(false), isSuccessModalOpen = _d[0], setIsSuccessModalOpen = _d[1];
    var _e = react_1.useState(""), modalMessage = _e[0], setModalMessage = _e[1];
    // --- DATA FETCHING FROM LIVE API ---
    react_1.useEffect(function () {
        var fetchServiceProviders = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, data, e_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setIsLoading(true);
                        setError(null);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, fetch("https://masteradmin.fibepe.com/api/Master/ServiceProvider", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Accept: "*/*"
                                },
                                body: JSON.stringify({})
                            })];
                    case 2:
                        response = _b.sent();
                        if (!response.ok) {
                            throw new Error("API Error: " + response.status + " " + response.statusText);
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _b.sent();
                        if (data.IsSuccess && ((_a = data.payLoad) === null || _a === void 0 ? void 0 : _a.ServiceProvider)) {
                            setOperators(data.payLoad.ServiceProvider);
                        }
                        else {
                            throw new Error(data.Message || "API response did not contain valid data.");
                        }
                        return [3 /*break*/, 6];
                    case 4:
                        e_1 = _b.sent();
                        setError(e_1.message || "An unknown error occurred while fetching data.");
                        console.error("Fetch error:", e_1);
                        return [3 /*break*/, 6];
                    case 5:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        fetchServiceProviders();
    }, []); // Empty array [] ensures this runs only once when the component mounts.
    // --- DATA PROCESSING (MODIFIED) ---
    // Memoized function to group operators by ConnectionType or DTH Category.
    var groupedOperators = react_1.useMemo(function () {
        return operators.reduce(function (accumulator, operator) {
            // THE KEY CHANGE IS HERE:
            // If the category is "DTH", use "DTH" as the key.
            // Otherwise, use the ConnectionType ("Prepaid" or "Postpaid") as the key.
            var groupKey = operator.Category === "DTH" ? "DTH" : operator.ConnectionType;
            // The rest of the logic remains the same.
            if (!accumulator[groupKey]) {
                accumulator[groupKey] = [];
            }
            accumulator[groupKey].push(operator);
            return accumulator;
        }, {});
    }, [operators]);
    // --- NEW: UPDATE HANDLER ---
    // --- MODIFIED: UPDATE HANDLER ---
    var handleUpdateProviderCode = function (operatorCode, newProviderCode, connectionType) { return __awaiter(void 0, void 0, void 0, function () {
        var url, response, result, operatorName, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    url = new URL("https://masteradmin.fibepe.com/api/Master/UpdateServiceProvider");
                    url.searchParams.append("newProviderCode", newProviderCode);
                    url.searchParams.append("operatorCode", operatorCode);
                    url.searchParams.append("connectionType", connectionType);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url.toString(), {
                            method: "POST",
                            headers: {
                                Accept: "*/*"
                            },
                            body: JSON.stringify({})
                        })];
                case 2:
                    response = _b.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _b.sent();
                    if (!response.ok || !result.IsSuccess) {
                        throw new Error(result.Message || "Failed to update provider code.");
                    }
                    operatorName = ((_a = operators.find(function (op) { return op.OperatorCode === operatorCode; })) === null || _a === void 0 ? void 0 : _a.OperatorName) || "Operator";
                    setOperators(function (currentOperators) {
                        return currentOperators.map(function (op) {
                            return op.OperatorCode === operatorCode &&
                                op.ConnectionType === connectionType
                                ? __assign(__assign({}, op), { ProviderCode: newProviderCode }) : op;
                        });
                    });
                    // --- TRIGGER THE MODAL ---
                    setModalMessage("Successfully updated provider for " + operatorName + ".");
                    setIsSuccessModalOpen(true);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    console.error("Update failed:", error_1.message);
                    // Re-throw the error so the card component knows the update failed
                    throw error_1;
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // --- RENDER LOGIC ---
    // Display a loading state while fetching data
    if (isLoading) {
        return (react_1["default"].createElement("div", { className: "text-center p-5" },
            react_1["default"].createElement("h5", null, "Loading Service Providers..."),
            react_1["default"].createElement("div", { className: "spinner-border text-primary", role: "status" },
                react_1["default"].createElement("span", { className: "visually-hidden" }, "Loading..."))));
    }
    // Display an error message if the fetch fails
    if (error) {
        return (react_1["default"].createElement("div", { className: "alert alert-danger mx-3" },
            react_1["default"].createElement("strong", null, "Error:"),
            " ",
            error));
    }
    return (react_1["default"].createElement("div", { className: "container py-4" },
        react_1["default"].createElement(SuccessModal_1["default"], { isOpen: isSuccessModalOpen, toggle: function () { return setIsSuccessModalOpen(false); }, message: modalMessage }),
        Object.keys(groupedOperators).map(function (category) { return (react_1["default"].createElement("section", { key: category, className: "mb-5" },
            react_1["default"].createElement("h2", { className: "border-bottom pb-2 mb-3" }, category),
            react_1["default"].createElement("div", { style: {
                    display: "grid",
                    gap: "0.5rem",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))"
                } }, groupedOperators[category].map(function (operator) { return (
            // Use the new ServiceProviderCard component
            react_1["default"].createElement(ServiceProviderCard_1.ServiceProviderCard, { key: operator.OperatorCode + "-" + operator.ConnectionType, operator: operator, onUpdate: handleUpdateProviderCode })); })))); })));
};
exports["default"] = ServiceProviderDisplay;
