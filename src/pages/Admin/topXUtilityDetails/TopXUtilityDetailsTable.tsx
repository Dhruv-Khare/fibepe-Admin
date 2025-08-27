import React, { useState, useEffect, useMemo, FC } from "react";

// --- TYPE DEFINITIONS ---
type UtilityRecord = {
  LedgerId: number;
  FibepeId: number;
  ConsumerNumber: string;
  CategoryName: string;
  Amount: number;

  FinalStatus: string;
  CreatedDate: string;
};

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
  const paginatedRecords = useMemo(() => {
    const filteredRecords = records.filter((record) =>
      Object.values(record).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

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
  }, [records, searchTerm, sortConfig, currentPage]);

  const totalPages = Math.ceil(
    records.filter((record) =>
      Object.values(record).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    ).length / ITEMS_PER_PAGE
  );

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

  return (
    <div className="card-body">
      {/* <div className="row g-4 mb-3">
        <div className="col-sm">
          <div className="d-flex justify-content-sm-end">
            <div className="search-box ms-2" style={{ position: "relative" }}>
              <input
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
                }}
              ></i>
            </div>
          </div>
        </div>
      </div> */}

      <div className="table-responsive table-card mt-3 mb-1">
        <table
          className="table align-middle table-nowrap text-center"
          id="rechargeTable"
        >
          <thead className="table-light">
            <tr>
              {(
                Object.keys(records[0] || {}) as Array<keyof UtilityRecord>
              ).map((key) => (
                <th
                  key={key}
                  // className="sort"
                  style={{ cursor: "pointer", verticalAlign: "middle" }}
                  onClick={() => handleSort(key)}
                >
                  {/* --- FIX IS HERE --- */}
                  {/* Flex styles are now on an inner div, not the th itself */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline", // The only change is here
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span>{key.replace(/([A-Z])/g, " $1").trim()}</span>
                    <span
                      style={{
                        width: "1em",
                        visibility:
                          sortConfig.key === key ? "visible" : "hidden",
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
                  <td>{record.CreatedDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center py-5">
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
