import { sp } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import "@pnp/sp/files";
import { IPersonaProps } from "@fluentui/react/lib/Persona";

export const hideRibbon = () => {
  const ribbon = document.getElementById("SuiteNavWrapper");
  const ribbon1 = document.getElementById("workbenchCommandBar");
  // const ribbon2 = document.getElementById("ms-webpart-chrome-title");
  // const ribbon3 = document.getElementById("suiteBarDelta");
  // const ribbon4 = document.getElementById("s4-ribbonrow");
  // const ribbon5 = document.getElementById("s4-titlerow");
  // const ribbon6 = document.getElementById("sideNavBox");
  const fullPage = document.getElementById("workbenchPageContent");

  if (ribbon && ribbon1 && fullPage) {
    ribbon.style.display = "none";
    ribbon1.style.display = "none";
    fullPage.style.maxWidth = "none";
  }
};

const webURL = async () => {
  sp.setup({
    sp: {
      baseUrl: "https://pv3l.sharepoint.com/sites/CRUDD",
    },
  });
};

const documentURL = "/sites/CRUDD/Contact";

const tenetName = "pv3l.sharepoint.com";

export const getDropDownOptions = async (
  listName: string,
  expandQuery: string,
  selectQuery: string
) => {
  await webURL();
  const data = await sp.web.lists
    .getByTitle(listName)
    .items.expand(expandQuery)
    .select(selectQuery)
    .get();

  const options = data.map((option) => ({
    key: option.Id.toString(),
    text: option.Title,
  }));
  return options;
};

export const search = async (
  listName: string,
  expandQuery: string,
  selectQuery: string
) => {
  await webURL();
  try {
    const items = await sp.web.lists
      .getByTitle(listName)
      .items.expand(expandQuery)
      .select(selectQuery)
      .get();
    return items;
  } catch (error) {
    console.error("Error occurred during search:", error);
    throw error;
  }
};

export const fnGetUserProps = async (UserID: number) => {
  await webURL();
  var Result: any[] = [];
  let data = sp.web.getUserById(UserID).get();
  Result.push(data);

  return Result;
};

// export const isMember = async (groupName: string) => {
//     try {
//         const userInGroup = await sp.web.siteGroups.getByName(groupName).users.getById(_spPageContextInfo.userId).get();

//         if (userInGroup) {
//             // User is a member of the group
//             return true;
//         } else {
//             // User is not a member of the group
//             return false;
//         }
//     } catch (error) {
//         console.error("Error checking group membership:", error);
//         throw error;
//     }
// };

export const getListData = async (
  listName: string,
  expandQuery: string,
  selectQuery: string
) => {
  await webURL();
  const listItemsPromise = await sp.web.lists
    .getByTitle(listName)
    .items.expand(expandQuery)
    .select(selectQuery)
    .get();
  return listItemsPromise;
};

export const getLibraryDocument = async (
  listItems: any[],
  siteName: string,
  libraryName: string,
  expandQuery: string,
  selectQuery: string
) => {
  await webURL();
  const attachmentLibraryUrl = `/sites/${siteName}/${libraryName}`;
  const attachmentsID = await sp.web
    .getFolderByServerRelativePath(attachmentLibraryUrl)
    .files.expand(expandQuery)
    .select(selectQuery)
    .get();

  return listItems.map((item) => {
    const matchingAttachments = attachmentsID.filter((attachment) => {
      return attachment.ListItemAllFields.ListDataID === item.Id;
    });

    return {
      ...item,
      Attachments: matchingAttachments.length > 0 ? matchingAttachments : null,
    };
  });
};

export const downloadAttachment = async (attachment: any, fileName: string) => {
  await webURL();
  const downloadLink = document.createElement("a");
  downloadLink.href = `https://${tenetName}${attachment.ServerRelativeUrl}`;
  downloadLink.download = fileName || "download";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  console.log("Download:", attachment.Title);
};

export const handleDeleteListItem = async (
  itemId: number,
  responseState: any,
  listName: string
) => {
  console.log(itemId);
  await webURL();
  const attachments =
    responseState.listData.find((item: any) => item.Id === itemId)
      ?.Attachments || [];

  if (attachments.length > 0) {
    for (const attachment of attachments) {
      const attachmentUrl = attachment.ServerRelativeUrl;

      await sp.web.getFileByServerRelativeUrl(attachmentUrl).delete();
    }
  }
  await sp.web.lists.getByTitle(listName).items.getById(itemId).delete();
};

export const getFirstBulkData = async (listName: string) => {
  await webURL();
  const response = await sp.web.lists
    .getByTitle(listName)
    .items.top(5000)
    .get();
  console.log("REPO", response);

  return response;
};

export const getRestBulkData = async (
  batchSize: number,
  skip: number,
  listName: string
) => {
  await webURL();
  const response = await sp.web.lists
    .getByTitle(listName)
    .items.top(batchSize)
    .skip(skip)
    .get();
  return response;
};

export const getSiteUsers = async () => {
  await webURL();
  const siteGroups = await sp.web.siteGroups();
  const userSuggestions: IPersonaProps[] = [];

  for (const group of siteGroups) {
    const groupInfo = await sp.web.siteGroups.getById(group.Id).users();
    userSuggestions.push(
      ...groupInfo.map((user) => ({
        key: user.Id.toString(),
        text: user.Title,
        secondaryText: user.Email,
      }))
    );
  }
  return userSuggestions;
};

export const SubmitData = async (listName: string, ArrData: any[]) => {
  await webURL();
  const contactList = sp.web.lists.getByTitle(listName);
  const contactItem = await contactList.items.add({
    ArrData,
  });

  const newResponseId = contactItem.data.Id;
  console.log("New Response ID:", newResponseId);
  console.log("Item added successfully!");

  return newResponseId;
};

export const UpdateData = async (
  listName: string,
  updateID: number,
  ArrData: any[]
) => {
  await webURL();
  const contactList = sp.web.lists.getByTitle(listName);
  await contactList.items.getById(updateID).update({
    ArrData,
  });
  console.log("Item updated successfully!");
  return updateID;
};

export const uploadFiles = async (
  listItemId: number,
  selectedFiles: File[]
) => {
  await webURL();
  const documentLibraryUrl = documentURL;

  for (const file of selectedFiles) {
    try {
      const filename = generateFilename(file.name);

      const fileUploadResult = await sp.web
        .getFolderByServerRelativePath(documentLibraryUrl)
        .files.add(filename, file, true);
      console.log("File uploaded: " + filename);

      const uploadedFile = fileUploadResult.file;
      await (await uploadedFile.getItem()).update({ ListDataID: listItemId });
      console.log("LISTID updated for the file:", filename);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }
};

const generateFilename = (originalFilename: string) => {
  const now = new Date();
  const offsetInMinutes = 330;
  const offsetInMilliseconds = offsetInMinutes * 60 * 1000;
  const istDate = new Date(now.getTime() + offsetInMilliseconds);
  const formattedTimestamp = istDate.toISOString().replace(/[:\.]/g, "-");
  return `${formattedTimestamp}_${originalFilename}`;
};
