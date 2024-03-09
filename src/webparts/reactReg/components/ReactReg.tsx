import * as React from "react";
import styles from "./ReactReg.module.scss";
import type { IReactRegProps } from "./IReactRegProps";
import { PrimaryButton, TextField, Stack } from "@fluentui/react";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import Dashboard from "./Dashboard";

export default class ReactReg extends React.Component<
  IReactRegProps,
  {
    loginEmail: string;
    loginPassword: string;
    regFullName: string;
    regEmail: string;
    regMobile: string;
    regPassword: string;
    regConfirmPassword: string;
    isLoggedIn: boolean;
  }
> {
  constructor(props: IReactRegProps) {
    super(props);

    this.state = {
      loginEmail: "",
      loginPassword: "",
      regFullName: "",
      regEmail: "",
      regMobile: "",
      regPassword: "",
      regConfirmPassword: "",
      isLoggedIn: false,
    };
  }

  componentDidMount(): void {
    console.log("Ribbon hide hona");

    this.hideRibbon();
  }

  hideRibbon() {
    const ribbon = document.getElementById("SuiteNavWrapper");
    const ribbon1 = document.getElementById("workbenchCommandBar");
    const fullPage = document.getElementById("workbenchPageContent");
    if (ribbon && ribbon1 && fullPage) {
      ribbon.style.display = "none";
      ribbon1.style.display = "none";
      fullPage.style.maxWidth = "none";
    }
  }

  handleLogin = async () => {
    const { loginEmail, loginPassword } = this.state;
    console.log(loginPassword, loginEmail);
    try {
      if (!loginPassword || !loginEmail) {
        alert("Please enter both username and password!!!");
        return;
      }
      const isValidUser = await this.validateLogin(loginEmail, loginPassword);
      if (isValidUser) {
        sessionStorage.setItem("LoggedInUserEmail", loginEmail);
        var email = sessionStorage.getItem("LoggedInUserEmail");
        console.log("Session wala" + email);

        this.setState({ isLoggedIn: true });
      }
    } catch (err) {
      console.error(err);
    }
  };

  validateLogin = async (email: string, password: string): Promise<boolean> => {
    sp.setup({
      sp: {
        baseUrl: "https://pv3l.sharepoint.com/sites/CRUDD",
      },
    });
    try {
      const items = await sp.web.lists.getByTitle("UserMaster").items.get();

      console.log(items);
      console.log(email, password);
      var found = false;
      for (var i = 0; i < items.length; i++) {
        const item = items[i];
        const userEmail = item.Email;
        const userPassword = item.Password;
        if (userEmail === email && userPassword === password) {
          found = true;
        }
      }
      return found
        ? true
        : (alert("You have entered wrong email id or password!!!"), false);
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  handleRegister = async () => {
    sp.setup({
      sp: {
        baseUrl: "https://pv3l.sharepoint.com/sites/CRUDD",
      },
    });
    const {
      regFullName,
      regEmail,
      regMobile,
      regPassword,
      regConfirmPassword,
    } = this.state;
    console.log(regFullName, regEmail, regPassword, regConfirmPassword);
    if (regPassword !== regConfirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    try {
      const userList = sp.web.lists.getByTitle("UserMaster");

      const userItem = await userList.items.add({
        Title: regFullName,
        Email: regEmail,
        Password: regPassword,
        Mobile: regMobile,
      });
      alert("Registration Successful!!! You can now log in to your account ");
      this.setState({
        regFullName: "",
        regEmail: "",
        regMobile: "",
        regPassword: "",
        regConfirmPassword: "",
        loginEmail: regEmail,
      });
      console.log("User Registered:", userItem.data);
    } catch (error) {
      console.error("Registration Error:", error);
    }
  };

  public render(): React.ReactElement<IReactRegProps> {
    const { hasTeamsContext } = this.props;

    return (
      <section
        className={`${styles.reactReg} ${hasTeamsContext ? styles.teams : ""}`}
      >
        {this.state.isLoggedIn ? (
          <Dashboard
            LoggedInUserEmail={{
              loginEmail: this.state.loginEmail,
            }}
          />
        ) : (
          <Stack horizontal tokens={{ childrenGap: 20 }}>
            <Stack style={{ width: 300 }}>
              <h2>Login</h2>
              <TextField
                label="Username"
                value={this.state.loginEmail}
                onChange={(_e, newValue) =>
                  this.setState({ loginEmail: newValue || "" })
                }
              />
              <TextField
                type="password"
                label="Password"
                value={this.state.loginPassword}
                onChange={(e, newValue) =>
                  this.setState({ loginPassword: newValue || "" })
                }
              />
              <PrimaryButton text="Login" onClick={this.handleLogin} />
            </Stack>

            <Stack style={{ width: 300 }}>
              <h2>Register</h2>
              <TextField
                label="Full Name"
                value={this.state.regFullName}
                onChange={(e, newValue) =>
                  this.setState({ regFullName: newValue || "" })
                }
              />
              <TextField
                label="Email Address"
                value={this.state.regEmail}
                onChange={(e, newValue) =>
                  this.setState({ regEmail: newValue || "" })
                }
              />
              <TextField
                label="Mobile"
                type="tel"
                value={this.state.regMobile}
                onChange={(e, newValue) =>
                  this.setState({ regMobile: newValue || "" })
                }
              />
              <TextField
                type="password"
                label="Password"
                value={this.state.regPassword}
                onChange={(e, newValue) =>
                  this.setState({ regPassword: newValue || "" })
                }
              />
              <TextField
                type="password"
                label="Confirm Password"
                value={this.state.regConfirmPassword}
                onChange={(e, newValue) =>
                  this.setState({ regConfirmPassword: newValue || "" })
                }
              />
              <PrimaryButton text="Register" onClick={this.handleRegister} />
            </Stack>
          </Stack>
        )}
      </section>
    );
  }
}
