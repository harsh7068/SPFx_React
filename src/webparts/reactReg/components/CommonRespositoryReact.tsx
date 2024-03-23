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

export const getDropDownOptions = async (listName: string, query: string) => {
  webURL();
  const data = await sp.web.lists.getByTitle(listName).items;
  const result = await data.filter(query).get();

  const options = result.map((option) => ({
    key: option.Id.toString(),
    text: option.Title,
  }));
  return options;
};

export const search = async (listName: string, query: string) => {
  try {
    const items = await sp.web.lists.getByTitle(listName).items;
    const result = await items.filter(query).get();
    return result;
  } catch (error) {
    console.error("Error occurred during search:", error);
    throw error;
  }
};

export const fnGetUserProps = async (UserID: number) => {
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

export const getListData = async (listName: string, query: string) => {
  await webURL();

  const listItems = await sp.web.lists.getByTitle(listName).items;
  const result = await listItems.filter(query).get();

  return result;
};

export const getLibraryDocument = async (listItems: any[], siteName:string, libraryName:string, query:string) => {
  const attachmentLibraryUrl = `/sites/${siteName}/${libraryName}`;
  const attachmentsID = await sp.web
    .getFolderByServerRelativePath(attachmentLibraryUrl)
    .files;
    const results = await attachmentsID.filter(query).get();

  return listItems.map((item) => {
    const matchingAttachments = results.filter((attachment) => {
      return attachment.ListItemAllFields.ListDataID === item.Id;
    });

    return {
      ...item,
      Attachments: matchingAttachments.length > 0 ? matchingAttachments : null,
    };
  });
};

export const downloadAttachment = async (attachment: any, fileName: string) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = `https://pv3l.sharepoint.com${attachment.ServerRelativeUrl}`;
    downloadLink.download = fileName || "download";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    console.log("Download:", attachment.Title);
  };

  export const handleDeleteListItem = async (
    itemId: number,
    responseState: any,
    listName : string
  ) => {
    console.log(itemId);
  
    const attachments =
      responseState.listData.find((item: any) => item.Id === itemId)
        ?.Attachments || [];
  
    if (attachments.length > 0) {
      for (const attachment of attachments) {
        const attachmentUrl = attachment.ServerRelativeUrl;
  
        await sp.web.getFileByServerRelativeUrl(attachmentUrl).delete();
      }
    }
    await sp.web.lists
      .getByTitle(listName)
      .items.getById(itemId)
      .delete();
  };

  export const getBulkData = async (listName : string) => {
    const response = await sp.web.lists
      .getByTitle(listName)
      .items.top(5000)
      .get();
    return response;
  };
  
  export const getRestBulkData = async (batchSize: number, skip: number, listName : string) => {
    const response = await sp.web.lists
      .getByTitle(listName)
      .items.top(batchSize)
      .skip(skip)
      .get();
    return response;
  };

  export const getSiteUsers = async () => {
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

  
