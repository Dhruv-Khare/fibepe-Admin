// import { co } from "@fullcalendar/core/internal-common";
import React, { useState, useEffect, useMemo, FC } from "react";
// import dotenv from "dotenv";

// dotenv.config();
// --- TYPE DEFINITIONS ---
type RechargeRecord = {
  LedgerId: number;
  FibepeId: number;
  Number: string;
  OperatorName: string;
  CircleName: string;
  ServiceType: string;
  Amount: number;
  FinalStatus: string;
  CreatedDate: string;
  OperatorRefId: string;
};

type SortDirection = "ascending" | "descending";

interface SortConfig {
  key: keyof RechargeRecord;
  direction: SortDirection;
}
interface TableHeader {
  key: keyof RechargeRecord;
  label: string;
}

// --- CONFIGURATION ---
const ITEMS_PER_PAGE = 10;
const RechargeAPI_URL =
  "https://masteradmin.fibepe.com/api/Master/RechargeDetail";

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
const RechargeDetailTable: FC = () => {
  console.log(
    "RechargeDetails component rendered at:",
    new Date().toLocaleTimeString()
  ); // <-- ADD THIS LINE

  const [records, setRecords] = useState<RechargeRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "LedgerId",
    direction: "descending",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRechargeData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!RechargeAPI_URL) {
          throw new Error("Recharge API URL is not defined.");
        }
        const response = await fetch(RechargeAPI_URL, {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        if (data.IsSuccess && data.payLoad?.AllRechargeDetail) {
          setRecords(data.payLoad.AllRechargeDetail);
        } else {
          setRecords([]);
          console.warn("API response was successful but contained no data.");
        }
      } catch (e: any) {
        setError(e.message || "An unknown error occurred while fetching data.");
        console.error("Fetch error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRechargeData();
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

  const handleSort = (key: keyof RechargeRecord) => {
    const direction: SortDirection =
      sortConfig.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };
  const totalAmount = useMemo(() => {
    return records.reduce((sum, record) => {
      // Check if the status is 'success' before adding the amount
      if (record.FinalStatus.toLowerCase() === "success") {
        return sum + record.Amount;
      }
      // Otherwise, return the current sum without adding anything
      return sum;
    }, 0); // The 0 is the initial value for the sum
  }, [records]); // This recalculates only when 'records' changes.

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <h5>Loading Recharge Details...</h5>
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
    { key: "Number", label: "Number" },
    { key: "OperatorName", label: "Operator Name" },
    { key: "CircleName", label: "Circle Name" },
    { key: "ServiceType", label: "Service Type" },
    { key: "Amount", label: "Amount" },
    { key: "FinalStatus", label: "Final Status" },
    { key: "CreatedDate", label: "Created Date" },
    { key: "OperatorRefId", label: "Operator Ref Id" },
  ];

  return (
    <div className="card-body">
      <div className="row g-4 mb-3">
        <div className="col-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            {/* Total Amount (will be on the left) */}
            <div className="d-flex align-items-center">
              <h5 style={{ fontWeight: "bold" }}>
                Total Amount:{" "}
                <span className="text-success fw-bold">
                  {totalAmount.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </span>
              </h5>
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
                  <td>{record.Number}</td>
                  <td>{record.OperatorName}</td>
                  <td>{record.CircleName}</td>
                  <td>{record.ServiceType}</td>
                  <td>₹{record.Amount}</td>
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
                  <td>{record.OperatorRefId}</td>
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

export default RechargeDetailTable;
