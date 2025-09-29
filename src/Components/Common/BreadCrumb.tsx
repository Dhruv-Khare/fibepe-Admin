import React from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";

interface BreadCrumbProps {
  title: string;
  pageTitle: string;
  children?: React.ReactNode;
}

const BreadCrumb = (props: BreadCrumbProps) => {
  const { title, pageTitle } = props;
  return (
    <React.Fragment>
      <Row>
        <Col xs={12}>
          <div className="page-title-box d-sm-flex align-items-center justify-content-start">
            <h4 className="mb-sm-0 me-2">{title}</h4>
            {props.children}
            
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default BreadCrumb;
