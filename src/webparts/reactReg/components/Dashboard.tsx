import * as React from "react";
import { Persona } from "@fluentui/react/lib/Persona";
//import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-groups";
import "@pnp/sp/site-users";
import { PersonaSize, CommandBar, DefaultButton } from "@fluentui/react";
import "./Footer.css";
import ReactReg from "./ReactReg";
import Contact from "./Contact";
import About from "./About";
import Profile from "./Profile";
import { Link } from "@fluentui/react/lib/Link";
import { IStackTokens, Stack, Text } from "@fluentui/react";
import { FontWeights } from "@fluentui/react/lib/Styling";
import Response from "./Responses";

interface IDashboardProps {
  LoggedInUserEmail: {
    loginEmail: string;
  };
}

const stackTokens: IStackTokens = { childrenGap: 20 };

const Dashboard: React.FC<IDashboardProps> = ({ LoggedInUserEmail }) => {
  const [dashboardState, setdashboardState] = React.useState<{
    isLoggedOut: boolean;
    isContactClicked: boolean;
    isAboutClicked: boolean;
    ishomeClicked: boolean;
    isProfileClicked: boolean;
    isResponseClicked: boolean;
  }>({
    isLoggedOut: false,
    isContactClicked: false,
    isAboutClicked: false,
    ishomeClicked: true,
    isProfileClicked: false,
    isResponseClicked: false,
  });

  const user = {
    displayName: sessionStorage.getItem("LoggedInUserEmail") ?? "Guest",
    imageUrl: "",
  };

  const handleLogoutClick = () => {
    sessionStorage.clear();
    console.log(
      "Session is cleared" + sessionStorage.getItem("LoggedInUserEmail"),
    );
    setdashboardState((prevState) => ({
      ...prevState,
      isLoggedOut: true,
    }));
  };

  const items = [
    {
      key: "home",
      text: "Home",
      iconProps: { iconName: "Home" },
      onClick: () =>
        setdashboardState((prevState) => ({
          ...prevState,
          isContactClicked: false,
          isAboutClicked: false,
          ishomeClicked: true,
          isProfileClicked: false,
          isResponseClicked: false,
        })),
    },
    {
      key: "about",
      text: "About",
      iconProps: { iconName: "Info" },
      onClick: () =>
        setdashboardState((prevState) => ({
          ...prevState,
          isContactClicked: false,
          isAboutClicked: true,
          ishomeClicked: false,
          isProfileClicked: false,
          isResponseClicked: false,
        })),
    },
    {
      key: "contact",
      text: "Contact",
      iconProps: { iconName: "Mail" },
      onClick: () =>
        setdashboardState((prevState) => ({
          ...prevState,
          isContactClicked: true,
          isAboutClicked: false,
          ishomeClicked: false,
          isProfileClicked: false,
          isResponseClicked: false,
        })),
    },
    {
      key: "showResponse",
      text: "Show Contact Responses",
      iconProps: { iconName: "Read" },
      onClick: () =>
        setdashboardState((prevState) => ({
          ...prevState,
          isContactClicked: false,
          isAboutClicked: false,
          ishomeClicked: false,
          isProfileClicked: false,
          isResponseClicked: true,
        })),
    },
  ];

  const farItems = [
    {
      key: "profile",
      onRender: () => (
        <Stack
          horizontal
          verticalAlign="center"
          tokens={{ childrenGap: 10 }}
          style={{ cursor: "pointer" }}
        >
          <Persona
            text={user.displayName}
            size={PersonaSize.size32}
            imageUrl={user.imageUrl}
            onClick={() =>
              setdashboardState((prevState) => ({
                ...prevState,
                isProfileClicked: true,
                isContactClicked: false,
                isAboutClicked: false,
                ishomeClicked: false,
              }))
            }
          />
          <DefaultButton
            text="Logout"
            onClick={handleLogoutClick}
            styles={{ root: { height: "32px" } }}
          />
        </Stack>
      ),
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <div>
      {dashboardState.isLoggedOut ? (
        <ReactReg hasTeamsContext={false} />
      ) : (
        <>
          <header>
            <Stack
              horizontalAlign="space-between"
              verticalAlign="center"
              tokens={{ padding: 10 }}
            >
              <Stack
                horizontal
                tokens={{ childrenGap: 20 }}
                styles={{ root: { borderBottom: "1px solid #ccc" } }}
              >
                <img
                  src={require("../assets/download.png")}
                  alt="Website Logo"
                  style={{ width: 50, height: 50 }}
                />
                <div>
                  <h2>Company Name</h2>
                </div>
              </Stack>
              <CommandBar
                items={items}
                farItems={farItems}
                styles={{ root: { marginRight: "20px" } }}
              />
            </Stack>
          </header>
          <body style={{ overflowY: "auto", height: "100vh" }}>
            {dashboardState.isContactClicked ? (
              <Contact />
            ) : dashboardState.isAboutClicked ? (
              <About />
            ) : dashboardState.isProfileClicked ? (
              <Profile />
            ) : dashboardState.isResponseClicked ? (
              <Response />
            ) : dashboardState.ishomeClicked ? (
              <>
                <h1>Jai Shree Ram!!!
                  Jai Hanuman!!!
                </h1>
              </>
            ) : (
              <>
                <div>
                  <h2>Default Page</h2>
                </div>
              </>
            )}
          </body>
          <footer className="modern-footer">
            <div className="container">
              {" "}
              {/* For layout */}
              <Stack horizontal tokens={stackTokens}>
                <Stack>
                  <Text
                    variant="xLargePlus"
                    block
                    styles={{
                      root: {
                        fontWeight: FontWeights.semibold,
                        color: "White",
                      },
                    }}
                  >
                    Company Name
                  </Text>
                  <Text block styles={{ root: { color: "white" } }}>
                    © {currentYear} All Rights Reserved
                  </Text>
                </Stack>

                <Stack>
                  {" "}
                  {/* Navigation Links */}
                  <Text
                    variant="medium"
                    block
                    styles={{ root: { color: "white" } }}
                  >
                    Navigation
                  </Text>
                  <Link
                    onClick={() =>
                      setdashboardState({
                        ishomeClicked: true,
                        isAboutClicked: false,
                        isContactClicked: false,
                        isProfileClicked: false,
                        isLoggedOut: false,
                        isResponseClicked: false,
                      })
                    }
                  >
                    Home
                  </Link>
                  <Link
                    onClick={() =>
                      setdashboardState({
                        ishomeClicked: false,
                        isAboutClicked: true,
                        isContactClicked: false,
                        isProfileClicked: false,
                        isLoggedOut: false,
                        isResponseClicked: false,
                      })
                    }
                  >
                    About Us
                  </Link>
                  <Link
                    onClick={() =>
                      setdashboardState({
                        ishomeClicked: false,
                        isAboutClicked: false,
                        isContactClicked: true,
                        isProfileClicked: false,
                        isLoggedOut: false,
                        isResponseClicked: false,
                      })
                    }
                  >
                    Contact
                  </Link>
                </Stack>

                <Stack>
                  {" "}
                  {/* Social Links */}
                  <Text
                    variant="medium"
                    block
                    styles={{ root: { color: "white" } }}
                  >
                    Follow Us
                  </Text>
                  <Link href="#" target="_blank">
                    <i
                      className="ms-Icon ms-Icon--Facebook"
                      aria-hidden="true"
                    ></i>
                  </Link>
                  <Link href="#" target="_blank">
                    <i
                      className="ms-Icon ms-Icon--Twitter"
                      aria-hidden="true"
                    ></i>
                  </Link>
                  {/* Add more links */}
                </Stack>
              </Stack>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default Dashboard;
