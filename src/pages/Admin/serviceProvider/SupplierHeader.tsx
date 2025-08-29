import React, { useState, useEffect, FC } from "react";
import { Card, CardBody, Col, Row, Spinner } from "reactstrap";

// Define the type for a single supplier
type Supplier = {
  SupplierCode: string;
  SupplierExtendedName: string;
};

const SupplierHeader: FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch(
          "https://masteradmin.fibepe.com/api/Master/SupplierDetail",
          {
            method: "POST",
            headers: {
              Accept: "*/*",
            },
            body: JSON.stringify({}),
          }
        );
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        const data = await response.json();
        if (data.IsSuccess && data.payLoad?.Supplier) {
          setSuppliers(data.payLoad.Supplier);
        } else {
          throw new Error("Failed to fetch supplier data.");
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  if (error) {
    return (
      <Row>
        <Col>
          <p className="text-danger">
            Could not load supplier details: {error}
          </p>
        </Col>
      </Row>
    );
  }

  return (
    <Row>
      {isLoading
        ? // Show placeholder spinners while loading
          Array.from({ length: 5 }).map((_, idx) => (
            <Col key={idx}>
              <Card>
                <CardBody className="text-center">
                  <Spinner size="sm" />
                </CardBody>
              </Card>
            </Col>
          ))
        : // Display the supplier cards once data is loaded
          suppliers.map((supplier) => (
            <Col key={supplier.SupplierCode}>
              <Card>
                <CardBody className="text-center">
                  <h5 className="mb-1">{supplier.SupplierExtendedName}</h5>
                  <p className="text-muted mb-0">{supplier.SupplierCode}</p>
                </CardBody>
              </Card>
            </Col>
          ))}
    </Row>
  );
};

export default SupplierHeader;
