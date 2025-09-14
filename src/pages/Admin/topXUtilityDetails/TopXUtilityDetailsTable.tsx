import React, { useState, useEffect, useMemo, FC } from "react";

// --- TYPE DEFINITIONS ---
type UtilityRecord = {
  LedgerId: number;
  FibepeId: number;
  ConsumerNumber: string;
  CategoryName: string;
  Amount: number;
  ConfirmationNumber: string;
  FinalStatus: string;
  CreatedDate: string;
  CustomerName: string;
  OrderNumber: string;
};
interface TableHeader {
  key: keyof UtilityRecord;
  label: string;
}

type SortDirection = "ascending" | "descending";

interface SortConfig {
  key: keyof UtilityRecord;
  direction: SortDirection;
}

// --- CONFIGURATION ---
const POLLING_INTERVAL_MS = 5000;
const ITEMS_PER_PAGE = 10;
const API_URL = "https://masteradmin.fibepe.com/api/Master/TopXUtilityDetail";

// --- REUSABLE BUTTON COMPONENT ---
const Button: FC<{
  color?: string;
  outline?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ color = "secondary", outline = false, children, ...props }) => {
  const colorClass = outline ? `btn-outline-${color}` : `btn-${color}`;
  const className = `btn ${colorClass}`;
  return (
    <button type="button" className={className} {...props}>
      {children}
    </button>
  );
};

// --- MAIN COMPONENT ---
const TopXUtilityDetailTable: FC = () => {
  const [records, setRecords] = useState<UtilityRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "LedgerId",
    direction: "descending",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fibepeId, setFibepeId] = useState<string | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem("authUser");
    let id: string | null = null;
    if (userString) {
      try {
        const user = JSON.parse(userString);
        id = user.FibePeID;
        setFibepeId(id);
      } catch (e) {
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
    const fetchDataAndSetRecords = async () => {
      setError(null);
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { Accept: "*/*" },
          body: "",
        });
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (data.IsSuccess && data.payLoad?.AllUtilityDetail) {
          setRecords(data.payLoad.AllUtilityDetail);
        } else {
          setRecords([]);
        }
      } catch (e: any) {
        setError(e.message);
        console.error("Fetch error:", e);
      }
    };

    // --- FIX: This is the corrected part ---
    // 1. Initial Load: Show loading spinner only once
    const initialLoad = async () => {
      setIsLoading(true);
      await fetchDataAndSetRecords();
      setIsLoading(false);
    };

    initialLoad();

    // 2. Polling: Set up the interval to fetch data without touching isLoading
    const intervalId = setInterval(fetchDataAndSetRecords, POLLING_INTERVAL_MS);

    // Cleanup: Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
  // STEP 1: Create a memoized list of filtered records.
  // This only recalculates when the main records or the search term changes.
  const filteredRecords = useMemo(() => {
    return records.filter((record) =>
      Object.values(record).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [records, searchTerm]);

  // STEP 2: Use the filtered list for sorting and pagination.
  // This now recalculates when the filtered list, sort config, or current page changes.
  const paginatedRecords = useMemo(() => {
    const sortedRecords = [...filteredRecords].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRecords, sortConfig, currentPage]);

  // STEP 3: Calculate total pages from the *same* filtered list.
  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);

  const handleSort = (key: keyof UtilityRecord) => {
    const direction: SortDirection =
      sortConfig.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <h5>Loading Utility Details...</h5>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mx-3">
        <strong>Error:</strong> {error}
      </div>
    );
  }
  // Add this array inside your RechargeDetailTable component
  const tableHeaders: TableHeader[] = [
    { key: "LedgerId", label: "Ledger Id" },
    { key: "FibepeId", label: "Fibepe Id" },
    { key: "ConsumerNumber", label: "Number" },
    { key: "CategoryName", label: "Category Name" },
    { key: "Amount", label: "Amount" },
    { key: "FinalStatus", label: "Final Status" },
    // { key: "CreatedDate", label: "Created Date" },
    { key: "ConfirmationNumber", label: "Confirmation Number" },
    { key: "CustomerName", label: "Customer Name" },
    { key: "OrderNumber", label: "Order Number" },
  ];

  return (
    <div className="card-body">
      <div className="row g-4 mb-3">
        <div className="col-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            {/* Date (will be on the left) */}
            <div>
              <span className="text-bolder fw-bold fs-5">
                Date:{" "}
                {new Date().toLocaleDateString("en-IN", {
                  year: "numeric",

                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Search Box (will be on the right) */}
            <div className="search-box ms-2" style={{ position: "relative" }}>
              <input
                id="recharge-search"
                name="recharge-search"
                type="text"
                className="form-control"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <i
                className="ri-search-line search-icon"
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              ></i>
            </div>
          </div>
        </div>
      </div>

      <div className="table-responsive table-card mt-3 mb-1">
        <table
          className="table align-middle table-nowrap text-center"
          id="rechargeTable"
        >
          <thead className="table-light">
            <tr>
              {tableHeaders.map((header) => (
                <th
                  key={header.key}
                  style={{ cursor: "pointer", verticalAlign: "middle" }}
                  onClick={() => handleSort(header.key)}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span>{header.label}</span>
                    <span
                      style={{
                        width: "1em",
                        visibility:
                          sortConfig.key === header.key ? "visible" : "hidden",
                      }}
                    >
                      {sortConfig.direction === "ascending" ? "▲" : "▼"}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="list form-check-all">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((record) => (
                <tr key={record.LedgerId}>
                  <td>{record.LedgerId}</td>
                  <td>{record.FibepeId}</td>
                  <td>{record.ConsumerNumber}</td>
                  <td>{record.CategoryName}</td>
                  <td>{record.Amount}</td>
                  <td>
                    <span
                      className={`badge ${
                        record.FinalStatus.toLowerCase() === "success"
                          ? "bg-success-subtle text-success"
                          : record.FinalStatus.toLowerCase() === "failed"
                          ? "bg-danger-subtle text-danger"
                          : "bg-warning-subtle text-warning"
                      }`}
                    >
                      {record.FinalStatus}
                    </span>
                  </td>
                  {/* <td>{record.CreatedDate}</td> */}
                  <td>{record.ConfirmationNumber}</td>
                  <td>{record.CustomerName}</td>
                  <td>{record.OrderNumber}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-5">
                  <h5>Sorry! No Result Found</h5>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-end">
        <div className="pagination-wrap hstack gap-2">
          <Button
            outline
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="p-2">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            outline
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopXUtilityDetailTable;
