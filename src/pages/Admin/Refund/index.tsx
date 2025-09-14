import React from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
// Update the import path and filename to match the actual file location and case
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import UiContent from "../../../Components/Common/UiContent";

import RefundForm from "./refundForm";

const UpdateSubscriber = () => {
  document.title = "Fibepe - Admin";
  return (
    <React.Fragment>
      <UiContent />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Process Refund" pageTitle="Tables" />

          {/* ================================================================== */}
          {/* == YOUR NEW DYNAMIC CUSTOMER LIST TABLE IS ADDED HERE == */}
          {/* ================================================================== */}
          <Row>
            <Col lg={12}>
              
                {/* <PreviewCardHeader title="Dynamic Customer List (With Search, Sort & Pagination)" /> */}
              
                  <RefundForm />
                
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

export default UpdateSubscriber;
