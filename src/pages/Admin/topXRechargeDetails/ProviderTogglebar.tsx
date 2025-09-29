import React, { useState, useEffect, FC } from "react";
import { Spinner, Alert, FormGroup, Input, Label } from "reactstrap";

// Define the structure of a provider object
type ServiceProvider = {
    OperatorName: string;
    OperatorCode: string;
    Category: string;
    ProviderCode: string;
    ConnectionType: string;
};

// Define the props for our component
interface ProviderToggleBarProps {
    onProviderUpdate: () => void;
}

const ProviderToggleBar: FC<ProviderToggleBarProps> = ({ onProviderUpdate }) => {
    const [allProviders, setAllProviders] = useState<ServiceProvider[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingStates, setUpdatingStates] = useState<Record<string, boolean>>({});
    const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchServiceProviders = async () => {
            // ... (fetch logic is the same) ...
            try {
                const response = await fetch("https://masteradmin.fibepe.com/api/Master/ServiceProvider", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Accept: "*/*" },
                    body: JSON.stringify({}),
                });
                if (!response.ok) throw new Error(`API Error: ${response.status}`);
                const data = await response.json();
                if (data.IsSuccess && data.payLoad?.ServiceProvider) {
                    const providers: ServiceProvider[] = data.payLoad.ServiceProvider;
                    setAllProviders(providers);

                    // CHANGE 1: Create the initial state using a UNIQUE key
                    const initialToggles = providers.reduce((acc: Record<string, boolean>, p: ServiceProvider) => {
                        const uniqueKey = `${p.OperatorCode}-${p.ConnectionType}`;
                        acc[uniqueKey] = p.ProviderCode === "6786";
                        return acc;
                    }, {});
                    setToggleStates(initialToggles);
                } else {
                    throw new Error(data.Message || "API response did not contain valid data.");
                }
            } catch (e: any) {
                setError(e.message || "An unknown error occurred.");
            } finally {
                setLoading(false);
            }
        };
        fetchServiceProviders();
    }, []);

    const handleToggleUpdate = async (operatorCode: string, connectionType: string, isToggledOn: boolean) => {
        // CHANGE 2: Use the UNIQUE key to update the loading and toggle states
        const uniqueKey = `${operatorCode}-${connectionType}`;
        setUpdatingStates(prev => ({ ...prev, [uniqueKey]: true }));
        
        // ... (API call logic is the same) ...
        let newProviderCode = isToggledOn ? "6786" : (connectionType.toLowerCase() === 'dth' ? "1223" : "2345");
        const url = new URL("https://masteradmin.fibepe.com/api/Master/UpdateServiceProvider");
        url.searchParams.append("newProviderCode", newProviderCode);
        url.searchParams.append("operatorCode", operatorCode);
        url.searchParams.append("connectionType", connectionType);

        try {
            const response = await fetch(url.toString(), { method: "POST" });
            const result = await response.json();
            if (!response.ok || !result.IsSuccess) {
                throw new Error(result.Message || "Failed to update provider.");
            }
            setToggleStates(prev => ({ ...prev, [uniqueKey]: isToggledOn }));
            onProviderUpdate();
        } catch (error: any) {
            alert(`Failed to update ${operatorCode}: ${error.message}`);
        } finally {
            setUpdatingStates(prev => ({ ...prev, [uniqueKey]: false }));
        }
    };

    const providersToShow = allProviders.filter(p =>
        (p.ConnectionType === "Prepaid" && (p.OperatorName === "Airtel" || p.OperatorName === "Reliance Jio"|| p.OperatorName === "BSNL"|| p.OperatorName === "Vodafone")) ||
        (p.Category === "DTH" && (p.OperatorName === "TATAPLAY" || p.OperatorName === "AIRTELTV"))
    );

    return (
        <div className="d-flex flex-wrap align-items-center gap-3">
            {loading && <Spinner size="sm">Loading...</Spinner>}
            {error && <span className="text-danger small">{error}</span>}
            
            {!loading && !error && providersToShow.map((provider) => {
                // CHANGE 3: Look up the state using the UNIQUE key
                const uniqueKey = `${provider.OperatorCode}-${provider.ConnectionType}`;
                const isUpdating = updatingStates[uniqueKey] || false;
                const isToggled = toggleStates[uniqueKey] || false;

                return (
                    <div key={uniqueKey} className="d-flex align-items-center bg-light border border-primary border-2  rounded px-3 py-1">
                        {/* {isUpdating ? (
                            <Spinner size="sm" className="me-2" />
                        ) : ( */}
                            <FormGroup switch className="m-0 d-flex align-items-center ">
                                <Input
                                    type="switch"
                                    role="switch"
                                    id={`toggle-${uniqueKey}`}
                                    checked={isToggled}
                                    onChange={(e) => handleToggleUpdate(provider.OperatorCode, provider.ConnectionType, e.target.checked)}
                                    disabled={isUpdating}
                                />
                                <Label check htmlFor={`toggle-${uniqueKey}`} className="mb-0 ms-2" style={{ whiteSpace: "nowrap" }}>
                                    {provider.OperatorName}
                                </Label>
                            </FormGroup>
                        {/* )} */}
                    </div>
                );
            })}
        </div>
    );
};

export default ProviderToggleBar;