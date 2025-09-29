import React, { useState, FC, useCallback, useEffect } from "react";
import CountUp from "react-countup";

// --- API Endpoint ---
const MONTHLY_DISCOUNT_API = "https://masteradmin.fibepe.com/api/Master/MonthlyDiscount";

// --- TYPE DEFINITIONS ---
interface DiscountData {
  RetailerDiscount: string;
  VendorPayOut: string;
}

interface MonthlyRecord extends DiscountData {
  label: string; // To store labels like "This Month", "Last Month", etc.
  hasData: boolean;
}


// --- MAIN COMPONENT ---
const DiscountPage: FC = () => {
  // --- STATE MANAGEMENT ---
  const [monthlyData, setMonthlyData] = useState<MonthlyRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading immediately
  const [error, setError] = useState<string | null>(null);

  // --- DATA FETCHING ---
  const fetchThreeMonthsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // 1. Calculate the three months to fetch
    const today = new Date();
    const datesToFetch = [0, 1, 2].map(offset => {
      const date = new Date();
      date.setMonth(today.getMonth() - offset);
      
      let label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      // if (offset === 0) label = "This Month";
      // if (offset === 1) label = "Last Month";

      return {
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        label: label,
      };
    });

    // 2. Create a fetch request for each month
    const fetchPromises = datesToFetch.map(async (dateInfo) => {
      const formattedMonth = String(dateInfo.month).padStart(2, "0");
      const apiUrl = `${MONTHLY_DISCOUNT_API}?month=${formattedMonth}&year=${dateInfo.year}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { Accept: "*/*", "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`API call failed for ${dateInfo.label}`);
      }
      
      const data = await response.json();

      // 3. Process the response for each month
      if (data.IsSuccess && data.payLoad) {
        return {
          ...data.payLoad,
          label: dateInfo.label,
          hasData: true,
        };
      } else {
        // Return a default object if no data is found for a month
        return {
          RetailerDiscount: "0",
          VendorPayOut: "0",
          label: dateInfo.label,
          hasData: false,
        };
      }
    });

    // 4. Execute all requests and update state
    try {
      const results = await Promise.all(fetchPromises);
      setMonthlyData(results);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred while fetching data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data when the component mounts
  useEffect(() => {
    fetchThreeMonthsData();
  }, [fetchThreeMonthsData]);


  // --- RENDER ---
  return (
    <div className="card-body">
    

      {/* --- Loading State --- */}
      {isLoading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Fetching data for the last three months...</p>
        </div>
      )}

      {/* --- Error Display --- */}
      {error && (
        <div className="alert alert-danger mt-3">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* --- Results Display --- */}
      {!isLoading && !error && (
        <div className="row g-4">
          {monthlyData.map((data, index) => {
            const totalAmount = parseFloat(data.RetailerDiscount) + parseFloat(data.VendorPayOut);
            return (
              <div className="col-md-4" key={index}>
                <div className="card shadow-sm h-100">
                  <div className="card-header bg-light">
                    <h5 className="card-title mb-0 text-center">{data.label}</h5>
                  </div>
                  <div className="card-body">
                    {data.hasData ? (
                      <>
                        <div className="row mb-2 align-items-center">
                          <div className="col-6 text-dark fw-bold">Retailer Discount:</div>
                          <div className="col-6 text-end fs-6">
                            <CountUp end={parseFloat(data.RetailerDiscount)} duration={1.5} separator="," prefix="₹" decimals={2} />
                          </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                          <div className="col-6 text-dark fw-bold">Vendor Payout:</div>
                          <div className="col-6 text-end fs-6">
                            <CountUp end={parseFloat(data.VendorPayOut)} duration={1.5} separator="," prefix="₹" decimals={2} />
                          </div>
                        </div>
                        <hr className="my-3"/>
                        <div className="row align-items-center">
                          <div className="col-6 text-dark fw-bold ">Total</div>
                          <div className="col-6 text-end text-primary fw-bolder fs-5">
                            <CountUp end={totalAmount} duration={1.5} separator="," prefix="₹" decimals={2} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-muted p-4 d-flex align-items-center justify-content-center h-100">
                        <p>No data available for this period.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DiscountPage;