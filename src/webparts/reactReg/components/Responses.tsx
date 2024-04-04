import * as React from "react";
import {
  DataGrid,
  GridPrintGetRowsToExportParams,
  GridRowId,
  GridToolbar,
  gridFilteredSortedRowIdsSelector,
  selectedGridRowsSelector,
} from "@mui/x-data-grid";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GridColDef } from "@mui/x-data-grid";
import Contact from "./Contact";
import ReactLoading from "react-loading";
import {
  downloadAttachment,
  getLibraryDocument,
  getListData,
  handleDeleteListItem,
} from "./CommonRespositoryReact";

interface IListItem {
  PeopleStringId: string[];
  DistrictId: any;
  StateId: any;
  CountryId: any;
  District: any;
  State: any;
  Country: any;
  Email: string;
  Id: number;
  Title: string;
  Message: string;
  Interests: string;
  Attachments?: any[];
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
    selectedPersons: string[];
    selectedDistrict: string;
    selectedState: string;
    selectedCountry: string;
  } | null;
  deletingItemId: number | null;
  loading: boolean;
}

const Response: React.FC = () => {
  const [responseState, setResponseState] = React.useState<IResponseState>({
    listData: [],
    dataEdited: false,
    editedData: null,
    deletingItemId: null,
    loading: false,
  });

  React.useEffect(() => {
    loadListData();
  }, []);

  const loadListData = async () => {
    try {
      setResponseState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const expandQuery = "Country,State,District";
      const selectQuery =
        "Id,Title,Email,Message,CountryId,StateId,DistrictId,Country/Title,District/Title,State/Title,PeopleStringId,Interests,PeopleName,PeopleEmail";
      var data = await getListData(
        "ContactResponse",
        expandQuery,
        selectQuery,
        ""
      );
      console.log("DATATATATA", data);

      const processedData = await getLibraryDocument(
        data,
        "CRUDD",
        "Contact",
        "ListItemAllFields",
        "Title, ServerRelativeUrl, ListItemAllFields/ListDataID",
        ""
      );

      setResponseState((prevState) => ({
        ...prevState,
        deletingItemId: null,
        loading: false,
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

  const handleDownload = (attachment: any) => {
    downloadAttachment(attachment, fileName);
  };

  const getSelectedRowsToExport = ({
    apiRef,
  }: GridPrintGetRowsToExportParams): GridRowId[] => {
    const selectedRowIds = selectedGridRowsSelector(apiRef);
    if (selectedRowIds.size > 0) {
      return Array.from(selectedRowIds.keys());
    }

    return gridFilteredSortedRowIdsSelector(apiRef);
  };

  let fileName = "";

  const editColumn: GridColDef = {
    field: "Actions",
    headerName: "Actions",
    width: 150,
    renderCell: (params) => {
      const rowData: IListItem = params.row as IListItem;
      return (
        <div>
          <button onClick={() => handleEdit(rowData)}>Edit</button>{" "}
          <button onClick={() => handleDelete(rowData.Id)}>Delete</button>{" "}
        </div>
      );
    },
    sortable: false,
  };

  const handleDelete = async (itemId: number) => {
    try {
      setResponseState((prevState) => ({
        ...prevState,
        deletingItemId: itemId,
      }));

      await handleDeleteListItem(itemId, responseState, "ContactResponse");

      setResponseState((prevState) => ({
        ...prevState,
        deletingItemId: null,
      }));
      loadListData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
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
        selectedPersons: row.PeopleStringId,
        selectedCountry: row.CountryId.toString(),
        selectedState: row.StateId.toString(),
        selectedDistrict: row.DistrictId.toString(),
      },
    }));
  };

  const attachmentColumn: GridColDef = {
    field: "Attachments",
    headerName: "Attachments",
    minWidth: 500,
    renderCell: (params) => {
      const rowData: IListItem = params.row as IListItem; // Cast params.row to IListItem type
      const attachments = rowData.Attachments || [];
      if (attachments && attachments.length > 0) {
        return (
          <div>
            {attachments.map((attachment, index) => {
              fileName = attachment.ServerRelativeUrl.split("_").pop();
              return (
                <React.Fragment key={index}>
                  <a
                    href={attachment.ServerRelativeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {fileName}
                  </a>
                  <span>&nbsp;|&nbsp;</span>
                  <span
                    onClick={() => handleDownload(attachment)}
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon icon={faDownload} title="Download" />
                  </span>{" "}
                  {index < attachments.length - 1 && <span>&nbsp;|&nbsp;</span>}
                </React.Fragment>
              );
            })}
          </div>
        );
      } else {
        return <div>No attachments</div>;
      }
    },
    sortable: false,
  };

  const columns: GridColDef[] = [
    { field: "Id", headerName: "ID", width: 70 },
    {
      field: "Title",
      headerName: "Title",
      width: 150,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "normal",
            overflow: "visible",
            height: "auto",
            wordBreak: "break-word",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "Email",
      headerName: "Email",
      width: 150,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "normal",
            overflow: "visible",
            height: "auto",
            wordBreak: "break-word",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "Message",
      headerName: "Message",
      width: 200,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "normal",
            overflow: "visible",
            height: "auto",
            wordBreak: "break-word",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "Interests",
      headerName: "Interests",
      width: 150,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "normal",
            overflow: "visible",
            height: "auto",
            wordBreak: "break-word",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "PeopleName",
      headerName: "People Name",
      width: 150,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "normal",
            overflow: "visible",
            height: "auto",
            wordBreak: "break-word",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "PeopleEmail",
      headerName: "People Email",
      width: 200,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "normal",
            overflow: "visible",
            height: "auto",
            wordBreak: "break-word",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "Country",
      headerName: "Country",
      width: 150,
      valueGetter: (params) =>
        params.row.Country ? params.row.Country.Title : "N/A",
    },
    {
      field: "State",
      headerName: "State",
      width: 150,
      valueGetter: (params) =>
        params.row.State ? params.row.State.Title : "N/A",
    },
    {
      field: "District",
      headerName: "District",
      width: 150,
      valueGetter: (params) =>
        params.row.District ? params.row.District.Title : "N/A",
    },
    attachmentColumn,
    editColumn,
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      {responseState.dataEdited ? (
        <Contact editData={responseState.editedData || undefined} />
      ) : responseState.loading ? (
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
          <DataGrid
            rows={responseState.listData}
            autoHeight
            columns={columns}
            getRowId={(row) => row.Id}
            //checkboxSelection
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              toolbar: {
                printOptions: { getRowsToExport: getSelectedRowsToExport },
              },
            }}
          />
        </>
      ) : (
        <DataGrid
          rows={responseState.listData}
          autoHeight
          columns={columns}
          getRowId={(row) => row.Id}
          //checkboxSelection
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              printOptions: { getRowsToExport: getSelectedRowsToExport },
            },
          }}
        />
      )}
      {responseState.deletingItemId && (
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
      )}
    </div>
  );
};

export default Response;
