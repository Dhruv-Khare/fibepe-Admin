import React from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import UiContent from "../../../Components/Common/UiContent";
import Operators from "./Operators";





const OpratorSummary = () => {
  document.title = "Fibepe - Admin";
  return (
    <React.Fragment>
      <UiContent />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Summary" pageTitle="Tables" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Operators/>
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

export default OpratorSummary;
