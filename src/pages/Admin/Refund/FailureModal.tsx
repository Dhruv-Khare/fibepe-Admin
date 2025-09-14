// FailureModal.tsx
import React, { useEffect } from "react";
import { Modal, ModalBody } from "reactstrap";

interface FailureModalProps {
  isOpen: boolean;
  toggle: () => void;
  message: string;
}

const FailureModal: React.FC<FailureModalProps> = ({
  isOpen,
  toggle,
  message,
}) => {
  // Automatically close the modal after 5 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        toggle();
      }, 5000); // 5 seconds

      // Cleanup the timer if the component unmounts or modal is closed manually
      return () => clearTimeout(timer);
    }
  }, [isOpen, toggle]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalBody className="text-center p-5">
        <div className="mb-4">
          {/* Failure 'X' Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="72"
            height="72"
            style={{ margin: "auto" }}
          >
            <circle
              cx="12"
              cy="12"
              r="11"
              fill="#fff"
              stroke="#dc3545" // Red color for failure
              strokeWidth="1"
            />
            {/* The 'X' mark */}
            <path
              fill="#dc3545"
              d="M16.24 7.76a.75.75 0 0 0-1.06 0L12 10.94 8.82 7.76a.75.75 0 1 0-1.06 1.06L10.94 12l-3.18 3.18a.75.75 0 1 0 1.06 1.06L12 13.06l3.18 3.18a.75.75 0 0 0 1.06-1.06L13.06 12l3.18-3.18a.75.75 0 0 0 0-1.06z"
            />
          </svg>
        </div>

        <h5>{message}</h5>
        <small className="text-muted">This message will close automatically.</small>
      </ModalBody>
    </Modal>
  );
};

export default FailureModal;