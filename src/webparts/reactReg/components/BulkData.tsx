import * as React from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import "@pnp/sp/files";
import ReactLoading from "react-loading";

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

  React.useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      sp.setup({
        sp: {
          baseUrl: "https://pv3l.sharepoint.com/sites/CRUDD",
        },
      });

      const initialBatch = await sp.web.lists
        .getByTitle("BulkData")
        .items.top(1000)
        .get();
      setData(initialBatch);
      setLoading(false);
      loadRemainingData(1000);
    } catch (error) {
      console.log("Error", error);
      setLoading(false);
    }
  };

  const loadRemainingData = async (skip: number) => {
    try {
        console.time("Data loading time");
      const batchSize = 5000; // Adjust as needed
      const batch = await sp.web.lists
        .getByTitle("BulkData")
        .items.top(batchSize)
        .skip(skip)
        .get();

      if (batch.length > 0) {
        setData((prevData) => [...prevData, ...batch]);
        loadRemainingData(skip + batchSize); // Recursive call for the next batch
      } else {
        // All data has been fetched
        console.log("All data loaded");
        console.timeEnd("Data loading time");
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
          <ReactLoading type="spinningBubbles" color="green" height={40} width={40} />
        </div>
      ) : (
        <DataTable<IListItem>
          title="Bulk Data"
          columns={columns}
          data={data}
          pagination
          highlightOnHover
          striped
          responsive
          fixedHeader
        />
      )}
    </div>
  );
};

export default BulkData;
