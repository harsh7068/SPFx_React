import * as React from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { sp } from "@pnp/sp";
import Contact from "./Contact";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import "@pnp/sp/files";

interface IListItem {
  DistrictId: any;
  StateId: any;
  CountryId: any;
  District: { Title: string } | null;
  State: { Title: string } | null;
  Country: { Title: string } | null;
  PeopleId: number;
  Email: string;
  Id: number;
  Title: string;
  Message: string;
  Interests: string;
  People: string;
  Attachments?: any[];
}

interface IExportedItem {
  Id: number;
  Title: string;
  Email: string;
  Message: string;
  Interests: string;
  PeopleId: number;
  Country: string | null; // Change to string | null
  State: string | null; // Change to string | null
  District: string | null; // Change to string | null
  Attachments: string[] | null; // Assuming Attachments is an array of file names
}

declare global {
  interface jsPDF {
    autoTable(options: any): void; // Adjust the 'any' type if more specific
  }
}

interface IResponseState {
  listData: IListItem[];
  dataEdited: boolean;
  editedData: {
    id: number;
    name: string;
    email: string;
    message: string;
    selectedOptions: string[];
    selectedPersons: string;
    selectedDistrict: string;
    selectedState: string;
    selectedCountry: string;
  } | null;
}

const Response: React.FC = () => {
  const [responseState, setResponseState] = React.useState<IResponseState>({
    listData: [],
    dataEdited: false,
    editedData: null,
  });

  const [searchQuery, setSearchQuery] = React.useState<string>("");

  React.useEffect(() => {
    loadListData();
  }, []);

  const loadListData = async () => {
    try {
      sp.setup({
        sp: {
          baseUrl: "https://pv3l.sharepoint.com/sites/CRUDD",
        },
      });

      const listItems = await sp.web.lists
        .getByTitle("ContactResponse")
        .items.expand("Country", "State", "District")
        .select(
          "Id",
          "Title",
          "Email",
          "Message",
          "CountryId",
          "StateId",
          "DistrictId",
          "Country/Title",
          "District/Title",
          "State/Title",
          "PeopleId",
          "Interests"
        )
        .get();

      console.log("ITEMSSSSS", listItems);

      const attachmentLibraryUrl = "/sites/CRUDD/Contact";
      const attachmentsID = await sp.web
        .getFolderByServerRelativePath(attachmentLibraryUrl)
        .files.expand("ListItemAllFields") // Expand to include the 'ListDataID'
        .select("Title", "ServerRelativeUrl", "ListItemAllFields/ListDataID")
        .get();

      console.log("Attavjn ID", attachmentsID);

      const processedData = listItems.map((item) => {
        const matchingAttachments = attachmentsID.filter((attachment) => {
          const mifd = attachment.ListItemAllFields.ListDataID === item.Id;
          console.log("JO mila", attachment.ListItemAllFields.ListDataID);

          console.log("RBERF", mifd);

          return mifd;
        });

        return {
          ...item,
          Attachments:
            matchingAttachments.length > 0 ? matchingAttachments : null,
          Country: item.Country ? item.Country.Title : null,
          State: item.State ? item.State.Title : null,
          District: item.District ? item.District.Title : null,
        };
      });
      setResponseState((prevState) => ({
        ...prevState,
        listData: processedData,
      }));
    } catch (error) {
      console.error("Error loading list data:", error);
      setResponseState((prevState) => ({
        ...prevState,
        listData: [],
        dataEdited: false,
      }));
    }
  };

  const editColumn: TableColumn<IListItem> = {
    name: "Actions",

    cell: (row) => (
      <>
        <button onClick={() => handleEdit(row)}>Edit</button>
        <button onClick={() => handleDelete(row.Id)}>Delete</button>
      </>
    ),
    sortable: false,
  };

  const handleEdit = (row: IListItem) => {
    console.log(row);

    setResponseState((prevState) => ({
      ...prevState,
      dataEdited: true,
      editedData: {
        id: row.Id,
        name: row.Title,
        email: row.Email,
        message: row.Message,
        selectedOptions: row.Interests.split(", "),
        selectedPersons: row.People,
        selectedCountry: row.CountryId.toString(),
        selectedState: row.StateId.toString(),
        selectedDistrict: row.DistrictId.toString(),
      },
    }));
  };

  const handleDelete = async (itemId: number) => {
    try {
      await sp.web.lists
        .getByTitle("ContactResponse")
        .items.getById(itemId)
        .delete();

      loadListData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleDownload = (attachment: any) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = `https://pv3l.sharepoint.com${attachment.ServerRelativeUrl}`;
    downloadLink.download = fileName || "download";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  let fileName = "";

  const handleView = (attachment: any) => {
    fileName =
      attachment.Title || attachment.ServerRelativeUrl.split("_").pop();
    console.log("FILEEE", fileName);

    try {
      window.open(
        `https://pv3l.sharepoint.com${attachment.ServerRelativeUrl}`,
        "_blank"
      );
    } catch {
      console.log("Can not open file!!!");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter the data based on the search query
  const filteredData = responseState.listData.filter(
    (item) =>
      (item.Title &&
        item.Title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.Email &&
        item.Email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const attachmentColumn: TableColumn<IListItem> = {
    name: "Attachments",
    cell: (row) => (
      <div>
        {row.Attachments
          ? row.Attachments.map(
              (attachment) => (
                (fileName = attachment.ServerRelativeUrl.split("_").pop()),
                (
                  <>
                    <span
                      onClick={() => handleView(attachment)}
                      style={{ cursor: "pointer" }}
                    >
                      {fileName}
                    </span>
                    <span>&nbsp;|&nbsp;</span>
                    <span
                      onClick={() => handleDownload(attachment)}
                      style={{ cursor: "pointer" }}
                    >
                      <FontAwesomeIcon icon={faDownload} title="Download" />
                    </span>{" "}
                    <br />
                  </>
                )
              )
            )
          : "No attachments"}
      </div>
    ),
    sortable: true,
  };

  const columns: TableColumn<IListItem>[] = [
    { name: "ID", selector: (row) => row.Id, sortable: true },
    { name: "Title", selector: (row) => row.Title, sortable: true },
    { name: "Email", selector: (row) => row.Email, sortable: true },
    { name: "Message", selector: (row) => row.Message, sortable: true },
    { name: "Interests", selector: (row) => row.Interests, sortable: true },
    {
      name: "Selected People",
      selector: (row) => row.PeopleId,
      sortable: true,
    },
    {
      name: "Country",
      selector: (row) => (row.Country ? row.Country.Title : "N/A"),
      sortable: true,
    },
    {
      name: "State",
      selector: (row) => (row.State ? row.State.Title : "N/A"),
      sortable: true,
    },
    {
      name: "District",
      selector: (row) => (row.District ? row.District.Title : "N/A"),
      sortable: true,
    },
    attachmentColumn,
    editColumn,
  ];

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const columnsForPDF = columns
      .filter((c) => c.name !== "Actions")
      .map((c) => c.name);

    //   const columnStyles: Record<string, { cellWidth?: number }> = {};
    // // Set specific widths for columns
    // columnStyles["ID"] = { cellWidth: 10 }; // Adjust the width as needed
    // columnStyles["Title"] = { cellWidth: 30 };
    // columnStyles["Message"] = { cellWidth: 40 };
    // columnStyles["Interests"] = { cellWidth: 20 };
    // columnStyles["PeopleId"] = { cellWidth: 10 };
    // columnStyles["Country"] = { cellWidth: 20 };
    // columnStyles["State"] = { cellWidth: 20 };
    // columnStyles["District"] = { cellWidth: 20 };
    // columnStyles["Attachments"] = { cellWidth: 20 };

    (doc as any).autoTable({
      head: [columnsForPDF],
      body: filteredData.map((row) => [
        row.Id,
        row.Title,
        row.Email,
        row.Message,
        row.Interests,
        row.PeopleId,
        row.Country
          ? typeof row.Country === "string"
            ? row.Country
            : row.Country.Title
          : null,
        row.State
          ? typeof row.State === "string"
            ? row.State
            : row.State.Title
          : null,
        row.District
          ? typeof row.District === "string"
            ? row.District
            : row.District.Title
          : null,
        row.Attachments
          ? row.Attachments.map(
              (attachment) => attachment.ServerRelativeUrl
            ).join("\n")
          : null,
      ]),
      orientation: "landscape",
      columnStyles: {
          ID: { cellWidth: 10 },
          Title: { cellWidth: 30 },
          Message: { cellWidth: 40 },
          Interests: { cellWidth: 20 },
          PeopleId: { cellWidth: 10 },
          Country: { cellWidth: 20 },
          State: { cellWidth: 20 },
          District: { cellWidth: 20 },
          Attachments: { cellWidth: 20 },
      },
    });

    doc.save("response_data.pdf");
  };

  const handleExportExcel = () => {
    const filteredDataTableData: IExportedItem[] = filteredData.map((row) => {
      return {
        Id: row.Id,
        Title: row.Title,
        Email: row.Email,
        Message: row.Message,
        Interests: row.Interests,
        PeopleId: row.PeopleId,
        Country: row.Country
          ? typeof row.Country === "string"
            ? row.Country
            : row.Country.Title
          : null,
        State: row.State
          ? typeof row.State === "string"
            ? row.State
            : row.State.Title
          : null,
        District: row.District
          ? typeof row.District === "string"
            ? row.District
            : row.District.Title
          : null,
        Attachments: row.Attachments
          ? row.Attachments.map((attachment) => attachment.ServerRelativeUrl)
          : null,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredDataTableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "response_data.xlsx");
  };

  return (
    <div>
      {responseState.dataEdited ? (
        <Contact editData={responseState.editedData || undefined} />
      ) : (
        <>
          <h1>List Data</h1>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <button onClick={handleExportPDF}>Export to PDF</button>
          <button onClick={handleExportExcel}>Export to Excel</button>
          <DataTable<IListItem>
            columns={columns}
            data={filteredData}
            pagination
            highlightOnHover
            striped
            responsive
          />
        </>
      )}
    </div>
  );
};

export default Response;
