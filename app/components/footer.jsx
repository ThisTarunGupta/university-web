"use client";
import Link from "next/link";
import { Col, Container, Row } from "react-bootstrap";
import WebLink from "./WebLink";

const Footer = () => (
  <div className="bg-primary text-light">
    <Container className="py-3">
      <Row>
        <Col>
          Department of Computer Scirnce & IT <br />
          University of Jammu
        </Col>
        <Col className="right">
          Tawi, Jammu, Jammu and Kashmir <br />
          <WebLink href="tel:+911912222222">+91 191 222 22 22</WebLink> <br />
          <WebLink href="mailto:cscit@jammuuniversity.com">
            cscit@jammuuniversity.com
          </WebLink>
        </Col>
      </Row>
    </Container>
  </div>
);

export default Footer;
