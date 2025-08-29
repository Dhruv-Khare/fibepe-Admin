import React, { useState, FC } from "react";

// Reuse the ServiceProvider type definition
type ServiceProvider = {
  OperatorName: string;
  OperatorCode: string;
  Category: string;
  ProviderCode: string;
  ConnectionType: string;
  Status: string;
};

// Define the props our new component will accept
interface ServiceProviderCardProps {
  operator: ServiceProvider;
  // This function will be called when the user clicks "Update"
  onUpdate: (
    operatorCode: string,
    newProviderCode: string,
    connectionType: string
  ) => Promise<void>;
}

export const ServiceProviderCard: FC<ServiceProviderCardProps> = ({
  operator,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedProviderCode, setEditedProviderCode] = useState<string>(
    operator.ProviderCode
  );
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  // --- 1. NEW STATE for validation error ---
  const [validationError, setValidationError] = useState<string>("");

  const handleUpdateClick = async () => {
    // --- 2. ADD VALIDATION CHECK before sending API call ---
    if (!/^\d{4}$/.test(editedProviderCode)) {
      setValidationError("Code must be exactly 4 digits.");
      return; // Stop the function if validation fails
    }
    setIsUpdating(true);
    try {
      // Call the update function passed down from the parent
      await onUpdate(
        operator.OperatorCode,
        editedProviderCode,
        operator.ConnectionType
      );
      setIsEditing(false); // Exit edit mode on success
    } catch (error) {
      console.error("Update failed:", error);
      // Optionally, show an error message to the user here
    } finally {
      setIsUpdating(false);
    }
  };
  // --- 3. NEW INPUT HANDLER for real-time validation ---
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric input up to 4 characters
    if (/^\d*$/.test(value) && value.length <= 4) {
      setEditedProviderCode(value);
      if (value.length > 0 && value.length < 4) {
        setValidationError("Must be 4 digits.");
      } else {
        setValidationError(""); // Clear error if valid or empty
      }
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setValidationError(""); // Clear any previous errors when starting to edit
  };

  // Helper function to get badge colors (same as before)
  const getConnectionTypeBadge = (connectionType: string) => {
    switch (connectionType.toLowerCase()) {
      case "prepaid":
        return "bg-primary-subtle text-primary-emphasis";
      case "postpaid":
        return "bg-success-subtle text-success-emphasis";
      case "dth":
        return "bg-info-subtle text-info-emphasis";
      default:
        return "bg-secondary text-secondary-emphasis";
    }
  };
  // A variable to check validity for cleaner JSX
  const isCodeValid = /^\d{4}$/.test(editedProviderCode);

  return (
    <div
      className="card h-100 shadow-lg "
      style={{ border: "1px solid #f3f3f9" }}
    >
      <div className="card-body d-flex flex-column">
        {/* Card Header: Operator Name and Status */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0 me-2">{operator.OperatorName}</h5>
          <span
            className={`badge ${
              operator.Status === "True" ? "bg-success" : "bg-danger"
            }`}
          >
            {operator.Status === "True" ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Connection Type Badge */}
        <div className="mb-1">
          <span
            className={`badge rounded-pill fs-6 ${getConnectionTypeBadge(
              operator.ConnectionType
            )}`}
          >
            {operator.ConnectionType}
          </span>
        </div>

        {/* Card Footer: Codes (pushed to the bottom) */}
        <div className="mt-auto pt-3 border-top">
          <div className="d-flex justify-content-between text-muted mb-2">
            <small>Operator Code:</small>
            <small className="fw-bold">{operator.OperatorCode}</small>
          </div>

          {/* --- EDITABLE PROVIDER CODE SECTION --- */}
          <div className="d-flex justify-content-between align-items-center text-muted">
            <small>Provider Code:</small>
            {isEditing ? (
              // --- 4. UPDATED JSX for edit mode ---
              <div>
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className={`form-control form-control-sm ${
                      validationError ? "is-invalid" : ""
                    }`}
                    style={{ width: "100px" }}
                    value={editedProviderCode}
                    onChange={handleCodeChange} // Use the new handler
                    maxLength={4}
                  />
                  <button
                    className="btn btn-success btn-sm"
                    onClick={handleUpdateClick}
                    // Disable if updating OR if code is invalid
                    disabled={isUpdating || !isCodeValid}
                  >
                    {isUpdating ? "..." : "Save"}
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setIsEditing(false)}
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                </div>
                {/* Conditionally render the error message */}
                {validationError && (
                  <small className="text-danger mt-1 d-block">
                    {validationError}
                  </small>
                )}
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <small className="fw-bold">{operator.ProviderCode}</small>
                <button
                  className="btn btn-primary btn-md py-0 px-1"
                  onClick={handleEditClick} // Use new handler to clear errors
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
