import React, { useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
// Update the import path and filename to match the actual file location and case
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import UiContent from "../../../Components/Common/UiContent";
// import { Link } from "react-router-dom";

// Import the CustomerList component you created
// import UpdateFrom from "./updateForm";
// import SelectionPage from "./SelectionPage";
import TopXRechargeDetailTable from "./TopXRechargeDetails";
import ProviderToggleBar from "./ProviderTogglebar";


// NOTE: The code below for static tables is kept for context from your template
// You can remove these if they are not needed for the code snippets feature
// import {
//   DefaultTables,
//   StrippedRow,
//   TablesColors,
//   HoverableRows,
//   CardTables,
//   ActiveTables,
//   BorderedTables,
//   TablesBorderColors,
//   TablesWithoutBorders,
//   SmallTables,
//   TableHead,
//   TableFoot,
//   Captions,
//   TableNesting,
//   Variants,
//   VerticalAlignment,
//   ResponsiveTables,
//   StripedColumnsTables,
// } from "./BasicTablesCode";

const RechargeDetailsPage = () => {
  document.title = "Fibepe - Admin";
  // document.title = "Basic Tables | Velzon - React Admin & Dashboard Template";
   const [tableKey, setTableKey] = useState<number>(0);

    // 2. Create a handler function that updates the key.
    // This will be passed to the ProviderToggleBar.
    const handleProviderUpdate = () => {
        console.log("A provider was updated. Refreshing the data table...");
        setTableKey(prevKey => prevKey + 1); // Incrementing the key
    };
  return (
    <React.Fragment>
      <UiContent />
      <div className="page-content">
        <Container fluid>
           <BreadCrumb title="Go Live With:" pageTitle="Tables">
                        <ProviderToggleBar onProviderUpdate={handleProviderUpdate} />
          </BreadCrumb>

          {/* ================================================================== */}
          {/* == YOUR NEW DYNAMIC CUSTOMER LIST TABLE IS ADDED HERE == */}
          {/* ================================================================== */}
          <Row>
            <Col lg={12}>
              <Card>
                {/* <PreviewCardHeader title="Dynamic Customer List (With Search, Sort & Pagination)" /> */}
                <CardBody>
                  {/* The component is placed directly here */}
                  {/* <UpdateFrom isOpen={true} toggle={() => {}} /> */}
                  <TopXRechargeDetailTable />
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

export default RechargeDetailsPage;
