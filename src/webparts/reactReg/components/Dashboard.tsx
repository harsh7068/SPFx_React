import * as React from "react";
import { Persona } from "@fluentui/react/lib/Persona";
import { PersonaSize, CommandBar, DefaultButton } from "@fluentui/react";
import "./Footer.css";
import ReactReg from "./ReactReg";
import Contact from "./Contact";
import About from "./About";
import Profile from "./Profile";
import BulkData from "./BulkData";
import { Link } from "@fluentui/react/lib/Link";
import { IStackTokens, Stack, Text } from "@fluentui/react";
import { FontWeights } from "@fluentui/react/lib/Styling";
import Response from "./Responses";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  LineController,
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import {
  Bar,
  Bubble,
  Chart,
  Doughnut,
  Line,
  Pie,
  PolarArea,
  Radar,
  Scatter,
} from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import ReactLoading from "react-loading";
//import ReactLoading from "react-loading";
//import { BarChart } from "@mui/x-charts/BarChart";

interface IDashboardProps {
  LoggedInUserEmail: {
    loginEmail: string;
  };
}

const stackTokens: IStackTokens = { childrenGap: 20 };

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  LineController,
  ArcElement,
  RadialLinearScale
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
  },
};

export const options1 = {
  indexAxis: "y" as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "right" as const,
    },
    title: {
      display: true,
      text: "Chart.js Horizontal Bar Chart",
    },
  },
};

export const options2 = {
  plugins: {
    title: {
      display: true,
      text: "Chart.js Bar Chart - Stacked",
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

export const options3 = {
  plugins: {
    title: {
      display: true,
      text: "Chart.js Bar Chart - Stacked",
    },
  },
  responsive: true,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

export const options4 = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

export const options5 = {
  responsive: true,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
      text: "Chart.js Line Chart - Multi Axis",
    },
  },
  scales: {
    y: {
      type: "linear" as const,
      display: true,
      position: "left" as const,
    },
    y1: {
      type: "linear" as const,
      display: true,
      position: "right" as const,
      grid: {
        drawOnChartArea: false,
      },
    },
  },
};

export const options6 = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export const options7 = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

export const data1 = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

export const data2 = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      backgroundColor: "rgb(255, 99, 132)",
    },
    {
      label: "Dataset 2",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      backgroundColor: "rgb(75, 192, 192)",
    },
    {
      label: "Dataset 3",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      backgroundColor: "rgb(53, 162, 235)",
    },
  ],
};

export const data3 = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      backgroundColor: "rgb(255, 99, 132)",
      stack: "Stack 0",
    },
    {
      label: "Dataset 2",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      backgroundColor: "rgb(75, 192, 192)",
      stack: "Stack 0",
    },
    {
      label: "Dataset 3",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      backgroundColor: "rgb(53, 162, 235)",
      stack: "Stack 1",
    },
  ],
};

export const data4 = {
  labels,
  datasets: [
    {
      fill: true,
      label: "Dataset 2",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

export const data5 = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      yAxisID: "y",
    },
    {
      label: "Dataset 2",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      yAxisID: "y1",
    },
  ],
};

export const data6 = {
  labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

export const data7 = {
  labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

export const data8 = {
  labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.5)",
        "rgba(54, 162, 235, 0.5)",
        "rgba(255, 206, 86, 0.5)",
        "rgba(75, 192, 192, 0.5)",
        "rgba(153, 102, 255, 0.5)",
        "rgba(255, 159, 64, 0.5)",
      ],
      borderWidth: 1,
    },
  ],
};

export const data9 = {
  labels: ["Thing 1", "Thing 2", "Thing 3", "Thing 4", "Thing 5", "Thing 6"],
  datasets: [
    {
      label: "# of Votes",
      data: [2, 9, 3, 5, 2, 3],
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
  ],
};

export const data10 = {
  datasets: [
    {
      label: "A dataset",
      data: Array.from({ length: 100 }, () => ({
        x: faker.datatype.number({ min: -100, max: 100 }),
        y: faker.datatype.number({ min: -100, max: 100 }),
      })),
      backgroundColor: "rgba(255, 99, 132, 1)",
    },
  ],
};

export const data11 = {
  datasets: [
    {
      label: "Red dataset",
      data: Array.from({ length: 50 }, () => ({
        x: faker.datatype.number({ min: -100, max: 100 }),
        y: faker.datatype.number({ min: -100, max: 100 }),
        r: faker.datatype.number({ min: 5, max: 20 }),
      })),
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Blue dataset",
      data: Array.from({ length: 50 }, () => ({
        x: faker.datatype.number({ min: -100, max: 100 }),
        y: faker.datatype.number({ min: -100, max: 100 }),
        r: faker.datatype.number({ min: 5, max: 20 }),
      })),
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

export const data12 = {
  labels,
  datasets: [
    {
      type: "line" as const,
      label: "Dataset 1",
      borderColor: "rgb(255, 99, 132)",
      borderWidth: 2,
      fill: false,
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
    },
    {
      type: "bar" as const,
      label: "Dataset 2",
      backgroundColor: "rgb(75, 192, 192)",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "white",
      borderWidth: 2,
    },
    {
      type: "bar" as const,
      label: "Dataset 3",
      backgroundColor: "rgb(53, 162, 235)",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
    },
  ],
};

const Dashboard: React.FC<IDashboardProps> = ({ LoggedInUserEmail }) => {
  const [dashboardState, setdashboardState] = React.useState<{
    isLoggedOut: boolean;
    isContactClicked: boolean;
    isAboutClicked: boolean;
    ishomeClicked: boolean;
    isProfileClicked: boolean;
    isResponseClicked: boolean;
    isBulkDataClicked: boolean;
  }>({
    isLoggedOut: false,
    isContactClicked: false,
    isAboutClicked: false,
    ishomeClicked: true,
    isProfileClicked: false,
    isResponseClicked: false,
    isBulkDataClicked: false,
  });

  const user = {
    displayName: sessionStorage.getItem("LoggedInUserEmail") ?? "Guest",
    imageUrl: "",
  };

  const handleLogoutClick = () => {
    sessionStorage.clear();
    console.log(
      "Session is cleared" + sessionStorage.getItem("LoggedInUserEmail")
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
          isBulkDataClicked: false,
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
          isBulkDataClicked: false,
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
          isBulkDataClicked: false,
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
          isBulkDataClicked: false,
        })),
    },
    {
      key: "bulkData",
      text: "Bulk Data",
      iconProps: { iconName: "Read" },
      onClick: () =>
        setdashboardState((prevState) => ({
          ...prevState,
          isContactClicked: false,
          isAboutClicked: false,
          ishomeClicked: false,
          isProfileClicked: false,
          isResponseClicked: false,
          isBulkDataClicked: true,
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
                isBulkDataClicked: false,
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
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <ReactLoading type={"spin"} color={"#000"} height={50} width={50} />
          </div>
          {dashboardState.isLoggedOut = false}
          <ReactReg hasTeamsContext={false} />
          
        </>
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
          <body style={{ overflowY: "auto", height: "100vh", widows: "100vw" }}>
            {dashboardState.isContactClicked ? (
              <Contact />
            ) : dashboardState.isAboutClicked ? (
              <About />
            ) : dashboardState.isBulkDataClicked ? (
              <BulkData />
            ) : dashboardState.isProfileClicked ? (
              <Profile />
            ) : dashboardState.isResponseClicked ? (
              <Response />
            ) : dashboardState.ishomeClicked ? (
              <>
                <h1>Home Page</h1>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    //width: "10%",
                  }}
                >
                  <div style={{ height: "15%", width: "80%" }}>
                    <h4>Bar Chart</h4>
                    <Bar options={options} data={data} />;
                    <br />
                  </div>
                  <div style={{ height: "15%", width: "80%" }}>
                    <h4>Horizontal Bar Chart</h4>
                    <Bar options={options1} data={data1} />;
                    <br />
                  </div>
                  <div style={{ height: "15%", width: "80%" }}>
                    <h4>Stacked Bar Chart</h4>
                    <Bar options={options2} data={data2} />;
                    <br />
                  </div>
                  <div style={{ height: "15%", width: "80%" }}>
                    <h4>Bar Chart</h4>
                    <Bar options={options3} data={data3} />;
                    <br />
                  </div>
                  <div style={{ height: "15%", width: "80%" }}>
                    <h4>Bar Chart</h4>
                    <Line options={options4} data={data4} />;
                    <br />
                  </div>
                  <div style={{ height: "15%", width: "80%" }}>
                    <h4>Bar Chart</h4>
                    <Line options={options5} data={data5} />;
                    <br />
                  </div>

                  <div style={{ height: "15%", width: "80%" }}>
                    <h4>Pie Chart</h4>
                    <Pie data={data6} />;
                    <br />
                  </div>

                  <div style={{ height: "15%", width: "80%" }}>
                    <h4>Doughnut Chart</h4>
                    <Doughnut data={data7} />;
                    <br />
                  </div>

                  <div style={{ height: "15%", width: "80%" }}>
                    <h4>Polar Chart</h4>
                    <PolarArea data={data8} />;
                    <br />
                  </div>

                  <div style={{ height: "15%", width: "80%" }}>
                    <h4>Radar Chart</h4>
                    <Radar data={data9} />;
                    <br />
                  </div>

                  <div style={{ height: "15%", width: "80%" }}>
                    <h4>Scatter Chart</h4>
                    <Scatter options={options6} data={data10} />;
                    <br />
                  </div>

                  <div style={{ height: "15%", width: "80%" }}>
                    <h4>Bubble Chart</h4>
                    <Bubble options={options7} data={data11} />;
                    <br />
                  </div>

                  <div style={{ height: "15%", width: "80%" }}>
                    <h4>Bar Chart</h4>
                    <Chart type="bar" data={data12} />;
                    <br />
                  </div>
                </div>

                {/* <BarChart
                  series={[
                    { data: [3, 4, 1, 6, 5], stack: "A", label: "Series A1" },
                    { data: [4, 3, 1, 5, 8], stack: "A", label: "Series A2" },
                    { data: [4, 2, 5, 4, 1], stack: "B", label: "Series B1" },
                    { data: [2, 8, 1, 3, 1], stack: "B", label: "Series B2" },
                    { data: [10, 6, 5, 8, 9], label: "Series C1" },
                  ]}
                  width={600}
                  height={350}
                /> */}
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
                        isBulkDataClicked: false,
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
                        isBulkDataClicked: false,
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
                        isBulkDataClicked: false,
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
