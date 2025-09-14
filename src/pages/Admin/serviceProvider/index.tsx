import React from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
// Update the import path and filename to match the actual file location and case
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import UiContent from "../../../Components/Common/UiContent";
import UtilityDetailTable from "./serviceProvider";
import SupplierHeader from "./SupplierHeader";

const ServiceProviderPage = () => {
  document.title = "Fibepe - Admin";
  return (
    <React.Fragment>
      <UiContent />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Service Providers " pageTitle="Tables" />
          <div
            style={{
              position: "sticky",
              top: 70,
              zIndex: 1,
              backdropFilter: "blur(10px)",
              paddingBottom: "5px",
            }}
          >
            <Row>
              <Col xs={12}>
                <SupplierHeader />
              </Col>
            </Row>
          </div>
          {/* ================================================================== */}
          {/* == YOUR NEW DYNAMIC CUSTOMER LIST TABLE IS ADDED HERE == */}
          {/* ================================================================== */}
          <Row>
            <Col lg={12}>
              <Card>
                {/* <PreviewCardHeader title="Dynamic Customer List (With Search, Sort & Pagination)" /> */}
                <CardBody>
                  <UtilityDetailTable />
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* ================================================================== */}
          {/* == ALL THE STATIC TABLE EXAMPLES FROM YOUR TEMPLATE ARE BELOW == */}
          {/* ================================================================== */}

          {/* ... (the rest of your static table examples remain unchanged) ... */}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ServiceProviderPage;
