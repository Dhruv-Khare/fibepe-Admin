// RefundForm.tsx
import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  // Modal, ModalHeader, ModalBody, Alert are no longer needed for the failure modal
} from "reactstrap";

// <-- Import both reusable modals -->
import SuccessModal from "./SuccessModal";
import FailureModal from "./FailureModal"; // <-- NEW

// It's a good practice to store API URLs in constants
const API_BASE_URL = "https://adminmanagement.fibepe.com/api/User/Admin";
const SIMPLE_REFUND_URL = `${API_BASE_URL}/Refund`;
const UTILITY_REFUND_URL = `${API_BASE_URL}/RefundUtility`;

// Define a type for the refund options for better type safety
type RefundType = "simple" | "utility";

// Define interfaces for expected API responses
interface ApiSuccessResponse {
  RevertLedgerId: string;
   message: string;
  IsSuccess:boolean
}

interface ApiErrorResponse {
  message: string;
  IsSuccess:boolean
}

const RefundForm: React.FC = () => {
  // State for form inputs with explicit types
  const [ledgerId, setLedgerId] = useState<string>("");
  const [fibepeId, setFibepeId] = useState<string>("");
  const [refundType, setRefundType] = useState<RefundType>("simple");

  // State for UI control
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showFailureModal, setShowFailureModal] = useState<boolean>(false);

  // State for API response data
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // <-- The useEffect for the failure modal is no longer needed here,
  // as the FailureModal component handles its own timer. -->

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ledgerId || !fibepeId) {
      setErrorMessage("Ledger ID and FibePe ID cannot be empty.");
      setShowFailureModal(true);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const url =
      refundType === "simple" ? SIMPLE_REFUND_URL : UTILITY_REFUND_URL;
    const params = new URLSearchParams({
      ledgerId: ledgerId,
      fibepeId: fibepeId
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": "*/*",
        },
      });

      const data: ApiSuccessResponse | ApiErrorResponse = await response.json();

      // 1. First, check if the HTTP response itself failed.
    if (!response.ok) {
      // Handle HTTP errors like 404, 500 etc.
      setErrorMessage(
        data.message || `An error occurred: ${response.statusText}`
      );
      setShowFailureModal(true);
      return; // Stop execution here
    }

    // 2. If the HTTP response is OK, now check the business logic flag from the API.
    if (data.IsSuccess) {
      // API confirms the operation was successful
      const revertId = (data as ApiSuccessResponse).RevertLedgerId || "N/A";
      setSuccessMessage(`Refund processed! Reverted Ledger ID: ${revertId}`);
      setShowSuccessModal(true);
    } else {
      // API says the operation failed (e.g., invalid ledger ID)
      setErrorMessage(
        (data as ApiErrorResponse).message || "The request was denied by the server."
      );
      setShowFailureModal(true);
    }
  } catch (error) {
    // This catches network failures (e.g., no internet connection)
    setErrorMessage(
      "Failed to connect to the server. Please check your connection."
    );
    setShowFailureModal(true);
  } finally {
    setIsLoading(false);
    setFibepeId("");
    setLedgerId("");
    setRefundType('simple');
  }

  };

  // Toggle handlers for modals
  const toggleSuccessModal = () => setShowSuccessModal(!showSuccessModal);
  const toggleFailureModal = () => setShowFailureModal(!showFailureModal);

  return (
    <Container className="m-1">
      <Row className="justify-content-center">
        <Col md="8" lg="6">
          <Card className="shadow-sm">
            <CardHeader className="bg-primary text-white text-center fs-4 py-3">
              Process Refund
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
                {/* Form Groups remain the same */}
                <FormGroup>
                  <Label for="ledgerId">Ledger ID</Label>
                  <Input
                    type="text"
                    name="ledgerId"
                    id="ledgerId"
                    placeholder="Enter Ledger ID"
                    value={ledgerId}
                    onChange={(e) => setLedgerId(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="fibepeId">FibePe ID</Label>
                  <Input
                    type="text"
                    name="fibepeId"
                    id="fibepeId"
                    placeholder="Enter FibePe ID"
                    value={fibepeId}
                    onChange={(e) => setFibepeId(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="refundType">Refund Type</Label>
                  <Input
                    type="select"
                    name="refundType"
                    id="refundType"
                    value={refundType}
                    onChange={(e) =>
                      setRefundType(e.target.value as RefundType)
                    }
                  >
                    <option value="simple">Simple Refund</option>
                    <option value="utility">Utility Refund</option>
                  </Input>
                </FormGroup>
                <Button
                  color="primary"
                  block
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner size="sm" /> : "Submit Refund"}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Reusable Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        toggle={toggleSuccessModal}
        message={successMessage}
      />

      {/* <-- REPLACED: Use your new custom FailureModal component --> */}
      <FailureModal
        isOpen={showFailureModal}
        toggle={toggleFailureModal}
        message={errorMessage || "Something went wrong. Please try again."}
      />
    </Container>
  );
};

export default RefundForm;
