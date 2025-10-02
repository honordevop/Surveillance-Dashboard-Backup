"use client";
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import { useSession } from "next-auth/react";
import SignUpForm from "./SignUpForm";

const RegisterFormComponent = () => {
  const session = useSession();

  // console.log(session.status);

  const [showSignUp, setShowSignUp] = useState(false);

  const handleShowSignUpForm = () => {
    setShowSignUp(true);
  };

  const handleHideSignUpForm = () => {
    setShowSignUp(false);
  };
  return (
    <div className="w-full">
      <SignUpForm handleHideSignUpForm={handleHideSignUpForm} />
    </div>
  );
};

export default RegisterFormComponent;
