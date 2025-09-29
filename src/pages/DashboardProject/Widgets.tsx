import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { FaRupeeSign } from "react-icons/fa";
import { Card, CardBody, CardHeader, Col, Row, Spinner } from "reactstrap"; // Import Spinner

interface ApiResponse {
  IsSuccess: boolean;
  Message: string;
  payLoad: {
    RetailerDiscount: string;
    VendorPayOut: string;
    StatusCode: string;
    StatusMessage: string;
  };
}

const Widgets = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // 1. Add loading state

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Set loading before the fetch
      try {
        const today = new Date();
        const dates = [0, 1, 2].map((d) => {
          const date = new Date();
          date.setDate(today.getDate() - d);
          return {
            day: d === 0 ? "Today" : d === 1 ? "Yesterday" : "Day Before Yesterday",
            date: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
          };
        });

        const results: any[] = [];

        for (const d of dates) {
          // Correctly pad the month to two digits (e.g., 9 -> "09", 10 -> "10")
          const formattedMonth = String(d.month).padStart(2, "0");
          const url = `https://masteradmin.fibepe.com/api/Master/DailyDiscount?date=${d.date}&month=${formattedMonth}&year=${d.year}`;
          
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "*/*" },
          });
          const json: ApiResponse = await res.json();

          if (json.IsSuccess && json.payLoad) {
            const retailer = parseFloat(json.payLoad.RetailerDiscount);
            const payout = parseFloat(json.payLoad.VendorPayOut);
            const total = (retailer ? retailer : 0) + (payout ? payout : 0);
            results.push({ label: d.day, retailer, payout, total });
          }
        }

        const maxTotal = Math.max(0, ...results.map((r) => (r.total ? r.total : 0))); // Add 0 to handle empty results

        const finalData = results.map((item) => ({
          ...item,
          badgeClass: item.total === maxTotal ? "danger" : "success",
          icon: item.total === maxTotal ? "ri-arrow-up-line" : "ri-arrow-down-line",
          percentage: item.total.toFixed(2),
        }));

        setData(finalData);
      } catch (error) {
        console.error("Failed to fetch widget data:", error);
        // Optionally, you can add an error state here to show an error message
      } finally {
        setIsLoading(false); // 2. Set loading to false after fetch is complete (or fails)
      }
    };

    fetchData();
  }, []);

  // 3. Conditional Rendering
  if (isLoading) {
    return (
      <Row className="justify-content-center align-items-center" style={{ minHeight: "200px" }}>
        <Col xs="auto">
          <Spinner color="primary" />
          <h5 className="mt-2">Loading Data...</h5>
        </Col>
      </Row>
    );
  }

  return (
    <Row>
      {data.map((item, key) => (
        <Col xl={4} key={key}>
          <Card className="card-animate">
            <CardBody >
               <CardHeader className="bg-primary text-white text-center fs-5 py-1 mb-2">
                {item.label}
              </CardHeader>
              <div className="d-flex align-items-center bg">
                <div className="avatar-sm flex-shrink-0">
                  <span className="avatar-title bg-primary-subtle text-primary rounded-2 fs-2">
                    <FaRupeeSign className="text-primary fs-4" />
                  </span>
                </div>
                <div className="flex-grow-1 overflow-hidden ms-3">
                  {/* <p className="fw-bold text-uppercase text-truncate mb-3">
                    {item.label}
                  </p> */}
                  
                  <h6 className="fw-bolder">Retailer Discount</h6>
                  <h4 className="fs-22 ff-secondary">
                    <CountUp end={item.retailer} duration={2} separator="," decimals={2} />
                  </h4>
                  
                  <h6 className="fw-bolder mt-3">Vendor Payout</h6>
                  <h4 className="fs-22 ff-secondary">
                    <CountUp end={item.payout} duration={2} separator="," decimals={2} />
                  </h4>
                </div>
                <div className="align-items-center mt-2"> {/* Align total to the top */}
                  <h6 className="fw-bold text-end mb-0">Total:</h6>
                  <span
                    className={
                      "fs-12 badge bg-" +
                      item.badgeClass +
                      "-subtle text-" +
                      item.badgeClass
                    }
                  >
                    <i className={"fs-13 align-middle me-1 " + item.icon}></i>
                    {item.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default Widgets;