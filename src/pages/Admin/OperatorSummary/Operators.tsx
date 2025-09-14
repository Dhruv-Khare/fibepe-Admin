// src/pages/Tables/Operators.tsx
import Summary from "pages/Tasks/TaskDetails/Summary";
import React, { useState, useEffect, useMemo, FC } from "react";
// reactstrap is now used for the UI as you requested
import { Card, CardBody, Col, Row, Spinner, Alert } from "reactstrap";

// --- TYPE DEFINITIONS ---
type ApiRecord = {
  OperatorName: string;
  Amount: number;
  FinalStatus: string;
  CategoryName?: string;
};

// The summary type now includes the optional categoryName for utility cards
export type OperatorSummary = {
  operatorName: string;
  successAmount: number;
  failedAmount: number;
  totalAmount: number;
  categoryName?: string;
};

// --- API CONFIGURATION ---
const RECHARGE_API_URL = "https://masteradmin.fibepe.com/api/Master/RechargeDetail";
const UTILITY_API_URL = "https://masteradmin.fibepe.com/api/Master/UtilityDetail";

// --- UI COMPONENT FOR DISPLAYING SUMMARY (UPDATED WITH YOUR UI) ---
interface SummaryDisplayProps {
  title: string;
  data: OperatorSummary[];
  isLoading: boolean;
}

const SummaryDisplay: FC<SummaryDisplayProps> = ({ title, data, isLoading }) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  // Loading state UI using reactstrap Spinner
  if (isLoading) {
    return (
      <div>
        <h3 className="mb-3 text-capitalize">{title}</h3>
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

  // If there's no data, render nothing
  if (!data || data.length === 0) {
    return null;
  }
  
console.log(data);
  // Main UI using your exact reactstrap Card structure
  return (
    <div>
      <h3 className="mb-3 text-capitalize">{title}</h3>
      <Row>
        {data.map((summary, index) => (
          <Col key={`${summary.operatorName}-${summary.categoryName}-${index}`} lg={3} md={6} className="mb-3">
            <Card className="h-100 shadow-sm mb-1 border-1">
              <CardBody>
                {summary.operatorName!=='Unknown' ? (
                <h5 className="mb-2 text-center text-uppercase fw-bold text-muted">
                  {summary.operatorName}
                </h5>)
                :
                
                  (<h5 className="mb-2 text-center text-uppercase fw-bold text-muted">
                  {summary.categoryName}
                </h5>
                )}
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

// --- MAIN OPERATORS COMPONENT ---
const Operators: FC = () => {
  const [rechargeRecords, setRechargeRecords] = useState<ApiRecord[]>([]);
  const [utilityRecords, setUtilityRecords] = useState<ApiRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Data fetching logic remains the same
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchData = async (url: string) => {
          const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
          if (!response.ok) throw new Error(`API Error: ${response.status}`);
          return response.json();
        };
        const [rechargeData, utilityData] = await Promise.all([
          fetchData(RECHARGE_API_URL),
          fetchData(UTILITY_API_URL),
        ]);
        if (rechargeData.IsSuccess && rechargeData.payLoad?.AllRechargeDetail) setRechargeRecords(rechargeData.payLoad.AllRechargeDetail);
        if (utilityData.IsSuccess && utilityData.payLoad?.AllUtilityDetail) setUtilityRecords(utilityData.payLoad.AllUtilityDetail);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Helper for simple summary (like recharge)
  const calculateGenericSummary = (records: ApiRecord[]): OperatorSummary[] => {
    if (!records || records.length === 0) return [];
    const summaryMap = new Map<string, Omit<OperatorSummary, "operatorName">>();
    for (const record of records) {
        const operatorName = record.OperatorName || "Unknown";
        if (!summaryMap.has(operatorName)) summaryMap.set(operatorName, { successAmount: 0, failedAmount: 0, totalAmount: 0 });
        const current = summaryMap.get(operatorName)!;
        current.totalAmount += record.Amount;
        const status = record.FinalStatus.toLowerCase();
        if (status === "success") current.successAmount += record.Amount;
        else if (status === "failed") current.failedAmount += record.Amount;
    }
    return Array.from(summaryMap.entries()).map(([operatorName, amounts]) => ({ operatorName, ...amounts }));
  };

  // Recharge summary calculation
  const rechargeSummary = useMemo(() => calculateGenericSummary(rechargeRecords), [rechargeRecords]);

  // Utility summary calculation to create a single grid
  const flatUtilitySummary = useMemo(() => {
    if (!utilityRecords || utilityRecords.length === 0) return [];
    const summaryMap = new Map<string, OperatorSummary>();
    for (const record of utilityRecords) {
        const operatorName = record.OperatorName || "Unknown";
        const categoryName = record.CategoryName || "Uncategorized";
        const uniqueKey = `${operatorName}-${categoryName}`;
        if (!summaryMap.has(uniqueKey)) summaryMap.set(uniqueKey, { operatorName, categoryName, successAmount: 0, failedAmount: 0, totalAmount: 0 });
        const current = summaryMap.get(uniqueKey)!;
        current.totalAmount += record.Amount;
        const status = record.FinalStatus.toLowerCase();
        if (status === "success") current.successAmount += record.Amount;
        else if (status === "failed") current.failedAmount += record.Amount;
    }
    return Array.from(summaryMap.values());
  }, [utilityRecords]);

  if (error) {
    return <Alert color="danger"><strong>Error:</strong> {error}</Alert>;
  }

  return (
    <div>
      <div className="mb-5">
        <SummaryDisplay title="Recharge Summary" data={rechargeSummary} isLoading={isLoading} />
      </div>
      <div>
        <SummaryDisplay title="Utility Summary" data={flatUtilitySummary} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Operators;