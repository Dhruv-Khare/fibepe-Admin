import React, { useState, useEffect, useCallback, FC } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Table,
  Button,
  Spinner,
  Alert,
} from "reactstrap";
import SuccessModal from "./SuccessModal";
import FailureModal from "./FailureModal";

// --- TYPE DEFINITIONS ---
type FundRequest = {
  ReceiptNumber: string;
  BankName: string;
  Amount: string;
  RefNumber: string;
  FinalStatus: string;
  FibepeId: number;
  Date: string;
};

// --- API CONFIGURATION ---
const GET_REQUESTS_API = "https://masteradmin.fibepe.com/api/Master/GetVendorFundRequest";
const UPDATE_REQUEST_API = "https://masteradmin.fibepe.com/api/Master/FundRequestApprovalProcess";

// --- MAIN COMPONENT ---
const VendorFundRequest: FC = () => {
  // --- STATE MANAGEMENT ---
  const [requests, setRequests] = useState<FundRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [updatingRequest, setUpdatingRequest] = useState<{id: string, action: 'approve' | 'reject'} | null>(null);
  
  // This state now drives both SuccessModal and FailureModal
  const [modal, setModal] = useState<{isOpen: boolean, title: 'Success' | 'Failure' | '', message: string}>({
    isOpen: false,
    title: '',
    message: ''
  });

  // --- DATA FETCHING ---
  const fetchFundRequests = useCallback(async () => {
    if (requests.length === 0) setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(GET_REQUESTS_API, { method: "POST" });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
      if (data.IsSuccess && data.payLoad?.FundRequestResponse) {
        setRequests(data.payLoad.FundRequestResponse);
      } else {
         throw new Error(data.Message || "Failed to fetch fund requests.");
      }
    } catch (e: any) {
      setError(e.message);
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  }, [requests.length]);

  useEffect(() => {
    fetchFundRequests();
  }, [fetchFundRequests]);

  // --- EVENT HANDLERS ---
  const toggleModal = () => setModal(prev => ({ ...prev, isOpen: !prev.isOpen }));

  const handleUpdateRequest = async (request: FundRequest, isApproved: boolean) => {
    const { ReceiptNumber, FibepeId } = request;
    const action = isApproved ? 'approve' : 'reject';

    setUpdatingRequest({ id: ReceiptNumber, action });
    setError(null);
    
    try {
      const apiUrl = `${UPDATE_REQUEST_API}?fibepeId=${FibepeId}&receiptId=${ReceiptNumber}&approved=${isApproved}`;
      const response = await fetch(apiUrl, { method: "POST" });
      
      if (!response.ok) throw new Error("Failed to submit the update.");
      const result = await response.json();
      if (!result.IsSuccess) throw new Error(result.Message || `The ${action} process failed.`);
      
      await fetchFundRequests(); 

      // Show the SuccessModal
      setModal({
          isOpen: true,
          title: "Success",
          message: `Request ${ReceiptNumber} has been successfully ${isApproved ? 'Approved' : 'Rejected'}.`
      });

    } catch (e: any) {
      // MODIFIED: Show the FailureModal on error
      setModal({
        isOpen: true,
        title: "Failure",
        message: e.message || "An unexpected error occurred."
      });
    } finally {
      setUpdatingRequest(null);
    }
  };

  // --- RENDER ---
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center p-5">
          <Spinner color="primary">Loading...</Spinner>
          <p className="mt-2">Fetching Fund Requests...</p>
        </div>
      );
    }

    if (requests.length === 0) {
      return <p className="text-center p-4">No pending fund requests found.</p>;
    }

    return (
      <Table bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th>Receipt #</th>
            <th>Bank</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th className="text-center">Approve</th>
            <th className="text-center">Reject</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => {
            const isUpdating = updatingRequest?.id === req.ReceiptNumber;
            const isApproving = isUpdating && updatingRequest?.action === 'approve';
            const isRejecting = isUpdating && updatingRequest?.action === 'reject';
            return (
              <tr key={req.ReceiptNumber}>
                <td>{req.ReceiptNumber}</td>
                <td>{req.BankName}</td>
                <td>{"₹" + parseFloat(req.Amount).toFixed(2)}</td>
                <td>
                  <span className={`badge ${req.FinalStatus.toLowerCase() === 'pending' ? 'bg-warning' : 'bg-success'}`}>
                      {req.FinalStatus}
                  </span>
                </td>
                <td>{new Date(req.Date).toLocaleString()}</td>
                <td className="text-center">
                  <Button
                    color="success"
                    size="sm"
                    onClick={() => handleUpdateRequest(req, true)}
                    disabled={isUpdating}
                  >
                    {isApproving ? <Spinner size="sm" /> : "Approve"}
                  </Button>
                </td>
                <td className="text-center">
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleUpdateRequest(req, false)}
                    disabled={isUpdating}
                  >
                    {isRejecting ? <Spinner size="sm" /> : "Reject"}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  };
  
  return (
    <>
      <Card>
        <CardBody>
          {error && <Alert color="danger" className="mt-3"><strong>Initial Load Error:</strong> {error}</Alert>}
          {renderContent()}
        </CardBody>
      </Card>

       {/* Your custom modals are now fully integrated */}
       <SuccessModal
        isOpen={modal.isOpen && modal.title === "Success"}
        toggle={toggleModal}
        message={modal.message}
        />
       <FailureModal
        isOpen={modal.isOpen && modal.title === "Failure"}
        toggle={toggleModal}
        message={modal.message}
        />
    </>
  );
};

export default VendorFundRequest;