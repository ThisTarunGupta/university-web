"use client";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const Header = () => (
  <Navbar bg="primary" data-bs-theme="dark" expand="lg">
    <Container>
      <Navbar.Brand href="/">Department of Computer Science & IT</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/news">News</Nav.Link>
          <Nav.Link href="/login">Login</Nav.Link>
          <Nav.Link href="/about">About</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

export default Header;
