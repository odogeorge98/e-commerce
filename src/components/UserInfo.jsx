// UserInfo.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useUser } from "../UserContext";

const UserInfo = () => {
  const { user } = useUser();

  return (
    <Container>
      <h1 className="mt-5 mb-4">User Information</h1>
      <Row>
        <Col xs={12}>
          <p>Name: {user.firstName} {user.lastName}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.isAdmin ? "Admin" : "User"}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default UserInfo;
