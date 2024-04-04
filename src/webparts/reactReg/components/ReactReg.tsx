import * as React from "react";
import styles from "./ReactReg.module.scss";
import type { IReactRegProps } from "./IReactRegProps";
import { PrimaryButton, TextField, Stack } from "@fluentui/react";
import { useState } from "react";
import Dashboard from "./Dashboard";
import ReactLoading from "react-loading";
import { handleLogin, handleRegister } from "./CommonRepository";
import { hideRibbonLocalWorkbench } from "./CommonRespositoryReact";

export default function ReactReg({ hasTeamsContext }: IReactRegProps) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    console.log("Ribbon hide hona");
    hideRibbonLocalWorkbench();
  }, []);

  const handleLoginClick = async () => {
    await handleLogin(loginEmail, loginPassword, setIsLoading, setIsLoggedIn);
  };

  const handleRegisterClick = async () => {
    const registrationData = [regFullName, regEmail, regMobile, regPassword, regConfirmPassword];
    const listName = "UserMaster";
    await handleRegister(registrationData, listName);
  };
  
  return (
    <section className={`${styles.reactReg} ${hasTeamsContext ? styles.teams : ""}`}>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust opacity as needed
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999, // Ensure the loader is on top
          }}
        >
          <ReactLoading type="spin" color="black" height={50} width={50} />
        </div>
      )}
      {isLoggedIn ? (
        <Dashboard LoggedInUserEmail={{ loginEmail }} />
      ) : (
        <Stack horizontal tokens={{ childrenGap: 20 }}>
          <Stack style={{ width: 300 }}>
            <h2>Login</h2>
            <TextField
              label="Username"
              value={loginEmail}
              onChange={(_e, newValue) => setLoginEmail(newValue || "")}
            />
            <TextField
              type="password"
              label="Password"
              value={loginPassword}
              onChange={(e, newValue) => setLoginPassword(newValue || "")}
            />
            <PrimaryButton text="Login" onClick={handleLoginClick} />
          </Stack>

          <Stack style={{ width: 300 }}>
            <h2>Register</h2>
            <TextField
              label="Full Name"
              value={regFullName}
              onChange={(e, newValue) => setRegFullName(newValue || "")}
            />
            <TextField
              label="Email Address"
              value={regEmail}
              onChange={(e, newValue) => setRegEmail(newValue || "")}
            />
            <TextField
              label="Mobile"
              type="tel"
              value={regMobile}
              onChange={(e, newValue) => setRegMobile(newValue || "")}
            />
            <TextField
              type="password"
              label="Password"
              value={regPassword}
              onChange={(e, newValue) => setRegPassword(newValue || "")}
            />
            <TextField
              type="password"
              label="Confirm Password"
              value={regConfirmPassword}
              onChange={(e, newValue) => setRegConfirmPassword(newValue || "")}
            />
            <PrimaryButton text="Register" onClick={handleRegisterClick} />
          </Stack>
        </Stack>
      )}
    </section>
  );
}
