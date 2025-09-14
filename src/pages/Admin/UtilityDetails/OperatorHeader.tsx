import React, { FC } from "react";
import { Card, CardBody, Col, Row, Spinner } from "reactstrap";

// Define the type for the summary data it will receive
export type OperatorSummary = {
  operatorName: string;
  successAmount: number;
  failedAmount: number;
  totalAmount: number;
};

// Define the component's props interface
interface OperatorHeaderProps {
  data: OperatorSummary[];
  isLoading: boolean;
}

const OperatorHeader: FC<OperatorHeaderProps> = ({ data, isLoading }) => {
  // Helper to format numbers as Indian Rupees (₹)
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  // Show placeholder spinners while the parent component is loading data
  if (isLoading) {
    return (
      <div>
        <h3 className="mb-3 text-capitalize ">Operators Summary</h3>
        <Row>
          {Array.from({ length: 4 }).map((_, idx) => (
            <Col key={idx} lg={3} md={6} className="mb-3">
              <Card className="h-100">
                <CardBody className="d-flex justify-content-center align-items-center">
                  <Spinner size="sm" />
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  // If loading is finished but there's no data, render nothing
  if (!data || data.length === 0) {
    return null;
  }

  // Render the summary cards once data is available
  return (
    <div>
      {/* --- HEADING ADDED HERE --- */}
      <h4 className="mb-3 text-capitalize">Operators Summary</h4>

      <Row>
        {data.map((summary) => (
          <Col key={summary.operatorName} lg={3} md={6} className="mb-3">
            <Card className="h-100 shadow-sm mb-1 border-1">
              <CardBody>
                <h5 className="mb-3 text-center text-uppercase fw-bold text-muted">
                  {summary.operatorName}
                </h5>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-medium text-success">Success:</span>
                  <span className="fw-bold text-success">
                    {formatCurrency(summary.successAmount)}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-medium text-danger">Failed:</span>
                  <span className="fw-bold text-danger">
                    {formatCurrency(summary.failedAmount)}
                  </span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-medium text-primary">Total:</span>
                  <span className="fw-bold text-primary">
                    {formatCurrency(summary.totalAmount)}
                  </span>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default OperatorHeader;