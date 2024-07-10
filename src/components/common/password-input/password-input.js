import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { MdLockOutline } from "react-icons/md";

const PasswordInput = (props) => {
  const [type, setType] = useState("password");

  const handleType = () => {
    const newType = type === "password" ? "text" : "password";
    setType(newType);
  };

  return (
    <InputGroup className="mb-3">
      {/* Input'un içine ilgili icon'u yerleştirmek için react-bootstrap'in InputGroup.Text yapılarından birini kullanmak gerekiyor. */}
      <InputGroup.Text>
        <MdLockOutline />
      </InputGroup.Text>

      <Form.Control
        type={type}
        {...props}
      />

      <InputGroup.Text onClick={handleType}>
        {type === "password" ? <AiFillEye /> : <AiFillEyeInvisible />}
      </InputGroup.Text>

      <Form.Control.Feedback type="invalid">
        {props.error}
      </Form.Control.Feedback>
    </InputGroup>
  );
};

export default PasswordInput;
