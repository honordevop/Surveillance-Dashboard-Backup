"use client";
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import { useSession } from "next-auth/react";

const LoginFormComponent = () => {
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
      <LoginForm handleShowSignUpForm={handleShowSignUpForm} />
    </div>
  );
};

export default LoginFormComponent;
