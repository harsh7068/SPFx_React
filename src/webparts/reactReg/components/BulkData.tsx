import * as React from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import ReactLoading from "react-loading";
import { getFirstBulkData, getRestBulkData } from "./CommonRespositoryReact";

interface IListItem {
  Listing_x0020_Status: string;
  Complaint_x0020_Status: string;
  Review_x0020_Date: string;
  Seller: string;
  Platform: string;
  Group: string;
  Channel: string;
  Country: string;
  Brand: string;
  State: string;
  Title: string;
  Id: number;
}

const BulkData: React.FC = () => {
  const [data, setData] = React.useState<IListItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [loadingData, setLoadingData] = React.useState<boolean>(false);
  const [loadingLabel, setLoadingLabel] = React.useState<string>(
    "Still Loading Some Data..."
  );
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  React.useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const initialBatch = await getFirstBulkData("BulkData");
      setData(initialBatch);
      setLoading(false);
      loadRemainingData(5000);
    } catch (error) {
      console.log("Error", error);
      setLoading(false);
    }
  };

  const loadRemainingData = async (skip: number) => {
    try {
      setLoadingData(true);
      console.time("Data loading time");
      const batchSize = 5000;
      const batch = await getRestBulkData(batchSize, skip, "BulkData");

      if (batch.length > 0) {
        setData((prevData) => [...prevData, ...batch]);
        loadRemainingData(skip + batchSize);
      } else {
        console.log("All data loaded");
        console.timeEnd("Data loading time");
        setLoadingLabel("All Data Loaded");
        setLoadingData(false);
      }
    } catch (error) {
      console.log("Error fetching remaining data", error);
    }
  };

  const columns: TableColumn<IListItem>[] = [
    { name: "ID", selector: (row) => row.Id.toString(), sortable: true },
    { name: "State", selector: (row) => row.State, sortable: true },
    { name: "Brand", selector: (row) => row.Brand, sortable: true },
    { name: "Channel", selector: (row) => row.Channel, sortable: true },
    { name: "Product Name", selector: (row) => row.Title, sortable: true },
    {
      name: "Product Category",
      selector: (row) => row.Country,
      sortable: true,
    },
    { name: "Price", selector: (row) => row.Group, sortable: true },
    {
      name: "Infringement Type",
      selector: (row) => row.Platform,
      sortable: true,
    },
    {
      name: "Infringement Reason",
      selector: (row) => row.Seller,
      sortable: true,
    },
    {
      name: "Review Data",
      selector: (row) => row.Review_x0020_Date,
      sortable: true,
    },
    {
      name: "Complaint Status",
      selector: (row) => row.Complaint_x0020_Status,
      sortable: true,
    },
    {
      name: "Listing Status",
      selector: (row) => row.Listing_x0020_Status,
      sortable: true,
    },
  ];

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = React.useMemo(() => {
    return data.filter(
      (item) =>
        item.Brand &&
        item.Brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  return (
    <div>
      {loading ? (
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
            //zIndex: 9999,
          }}
        >
          <ReactLoading type={"spin"} color={"#000"} height={50} width={50} />
        </div>
      ) : loadingData ? (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              height: "20px",
            }}
          >
            <ReactLoading type="spin" color="black" height={20} width={20} />
            <p style={{ color: "black", marginLeft: "5px" }}>{loadingLabel}</p>
          </div>
          <DataTable<IListItem>
            title="Bulk Data"
            columns={columns}
            data={filteredData}
            pagination
            highlightOnHover
            striped
            responsive
            fixedHeader
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
              />
            }
          />
        </>
      ) : (
        <>
          <DataTable<IListItem>
            title="Bulk Data"
            columns={columns}
            data={filteredData}
            pagination
            paginationPerPage={10} // Adjust as needed
            paginationRowsPerPageOptions={[10, 20, 30]}
            highlightOnHover
            striped
            responsive
            fixedHeader
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
              />
            }
          />
        </>
      )}
    </div>
  );
};

export default BulkData;
