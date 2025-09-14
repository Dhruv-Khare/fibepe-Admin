import React, { useState, useEffect, useMemo, FC } from "react";
// Import the new card component
import { ServiceProviderCard } from "./ServiceProviderCard";
import SuccessModal from "./SuccessModal"; // <-- ADD THIS IMPORT

// --- TYPE DEFINITION ---
// Defines the structure of a single operator object from the API
type ServiceProvider = {
  OperatorName: string;
  OperatorCode: string;
  Category: string;
  ProviderCode: string;
  ConnectionType: string;
  Status: string; // API returns "True" or "False" as a string
};

// Defines the structure for our grouped data, e.g., { Mobile: [...], DTH: [...] }
type GroupedOperators = Record<string, ServiceProvider[]>;

// --- MAIN COMPONENT ---
const ServiceProviderDisplay: FC = () => {
  const [operators, setOperators] = useState<ServiceProvider[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  // ADD THESE TWO LINES
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");

  // --- DATA FETCHING FROM LIVE API ---
  useEffect(() => {
    const fetchServiceProviders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://masteradmin.fibepe.com/api/Master/ServiceProvider",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*",
            },
            body: JSON.stringify({}),
          }
        );

        if (!response.ok) {
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        if (data.IsSuccess && data.payLoad?.ServiceProvider) {
          setOperators(data.payLoad.ServiceProvider);
        } else {
          throw new Error(
            data.Message || "API response did not contain valid data."
          );
        }
      } catch (e: any) {
        setError(e.message || "An unknown error occurred while fetching data.");
        console.error("Fetch error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceProviders();
  }, []); // Empty array [] ensures this runs only once when the component mounts.

  // --- DATA PROCESSING (MODIFIED) ---
  // Memoized function to group operators by ConnectionType or DTH Category.
  const groupedOperators = useMemo<GroupedOperators>(() => {
    return operators.reduce((accumulator, operator) => {
      // THE KEY CHANGE IS HERE:
      // If the category is "DTH", use "DTH" as the key.
      // Otherwise, use the ConnectionType ("Prepaid" or "Postpaid") as the key.
      const groupKey =
        operator.Category === "DTH" ? "DTH" : operator.ConnectionType;

      // The rest of the logic remains the same.
      if (!accumulator[groupKey]) {
        accumulator[groupKey] = [];
      }
      accumulator[groupKey].push(operator);
      return accumulator;
    }, {} as GroupedOperators);
  }, [operators]);

  // --- NEW: UPDATE HANDLER ---
  // --- MODIFIED: UPDATE HANDLER ---
  const handleUpdateProviderCode = async (
    operatorCode: string,
    newProviderCode: string,
    connectionType: string
  ) => {
    // 1. Construct the URL with query parameters
    const url = new URL(
      "https://masteradmin.fibepe.com/api/Master/UpdateServiceProvider"
    );
    url.searchParams.append("newProviderCode", newProviderCode);
    url.searchParams.append("operatorCode", operatorCode);
    url.searchParams.append("connectionType", connectionType);

    try {
      // 2. Fetch using the new URL. The body is now empty.
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          Accept: "*/*",
        },
        body: JSON.stringify({}), // Sending an empty body
      });

      const result = await response.json();

      if (!response.ok || !result.IsSuccess) {
        throw new Error(result.Message || "Failed to update provider code.");
      }

      // 3. On success, update the state locally to reflect the change immediately
      const operatorName =
        operators.find((op) => op.OperatorCode === operatorCode)
          ?.OperatorName || "Operator";

      setOperators((currentOperators) =>
        currentOperators.map((op) =>
          op.OperatorCode === operatorCode &&
          op.ConnectionType === connectionType
            ? { ...op, ProviderCode: newProviderCode }
            : op
        )
      );

      // --- TRIGGER THE MODAL ---
      setModalMessage(`Successfully updated provider for ${operatorName}.`);
      setIsSuccessModalOpen(true);
    } catch (error: any) {
      console.error("Update failed:", error.message);
      // Re-throw the error so the card component knows the update failed
      throw error;
    }
  };

  // --- RENDER LOGIC ---

  // Display a loading state while fetching data
  if (isLoading) {
    return (
      <div className="text-center p-5">
        <h5>Loading Service Providers...</h5>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Display an error message if the fetch fails
  if (error) {
    return (
      <div className="alert alert-danger mx-3">
        <strong>Error:</strong> {error}
      </div>
    );
  }
  return (
    <div className="container py-4">
      <SuccessModal
        isOpen={isSuccessModalOpen}
        toggle={() => setIsSuccessModalOpen(false)}
        message={modalMessage}
      />
      {/* Map over the categories (e.g., "Mobile", "DTH") to create sections */}
      {Object.keys(groupedOperators).map((category) => (
        <section key={category} className="mb-5">
          <h2 className="border-bottom pb-2 mb-3">{category}</h2>

          {/* A responsive grid to hold the operator cards */}
          <div
            style={{
              display: "grid",
              gap: "0.5rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            }}
          >
            {/* Map over the operators within each category to create a card for each one */}
            {groupedOperators[category].map((operator) => (
              // Use the new ServiceProviderCard component
              <ServiceProviderCard
                key={`${operator.OperatorCode}-${operator.ConnectionType}`}
                operator={operator}
                onUpdate={handleUpdateProviderCode}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default ServiceProviderDisplay;
