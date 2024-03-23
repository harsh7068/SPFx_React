import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import "@pnp/sp/files";
import "@pnp/sp/site-groups";
import "@pnp/sp/site-users";
import { IPersonaProps } from "@fluentui/react/lib/Persona";

export const hideRibbon = () => {
  const ribbon = document.getElementById("SuiteNavWrapper");
  const ribbon1 = document.getElementById("workbenchCommandBar");
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

export const validateLogin = async (
  email: string,
  password: string
): Promise<boolean> => {
  await webURL();
  try {
    const items = await sp.web.lists.getByTitle("UserMaster").items.get();

    console.log(items);
    console.log(email, password);
    let found = false;
    for (let i = 0; i < items.length; i++) {
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

export const handleLogin = async (
  email: string,
  password: string,
  setLoading: (loading: boolean) => void,
  setIsLoggedIn: (loggedIn: boolean) => void
) => {
  try {
    if (!password || !email) {
      alert("Please enter both username and password!!!");
      return;
    }
    setLoading(true);
    const isValidUser = await validateLogin(email, password);
    if (isValidUser) {
      sessionStorage.setItem("LoggedInUserEmail", email);
      var storedEmail = sessionStorage.getItem("LoggedInUserEmail");
      console.log("Session wala" + storedEmail);
      setIsLoggedIn(true);
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

export const getLoggedInUserData = async(sessionData : string, validatingColumn : string) => {
  const userList = await sp.web.lists
        .getByTitle("UserMaster")
        .items.filter(`${validatingColumn} eq '${sessionData}'`)
        .get();
  return userList;
}

export const handleRegister = async (data: string[], listName: string) => {
  const [fullName, email, mobile, password, confirmPassword] = data;
  await webURL();
  console.log(fullName, email, password, confirmPassword);
  if (password !== confirmPassword) {
    console.error("Passwords do not match");
    return;
  }

  try {
    const userList = sp.web.lists.getByTitle(listName);

    const userItem = await userList.items.add({
      Title: fullName,
      Email: email,
      Password: password,
      Mobile: mobile,
    });
    alert("Registration Successful!!! You can now log in to your account ");
    console.log("User Registered:", userItem.data);
  } catch (error) {
    console.error("Registration Error:", error);
  }
};

export const handleLogOut = () => {
  sessionStorage.clear();
  console.log(
    "Session is cleared" + sessionStorage.getItem("LoggedInUserEmail")
  );
};

export const getListData = async () => {
  await webURL();

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

  return getLibraryDocument(listItems);
};

export const getLibraryDocument = async (listItems: any[]) => {
  const attachmentLibraryUrl = "/sites/CRUDD/Contact";
  const attachmentsID = await sp.web
    .getFolderByServerRelativePath(attachmentLibraryUrl)
    .files.expand("ListItemAllFields") // Expand to include the 'ListDataID'
    .select("Title", "ServerRelativeUrl", "ListItemAllFields/ListDataID")
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
  responseState: any
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
    .getByTitle("ContactResponse")
    .items.getById(itemId)
    .delete();
};

export const getBulkData = async () => {
  const response = await sp.web.lists
    .getByTitle("BulkData")
    .items.top(5000)
    .get();
  return response;
};

export const getRestBulkData = async (batchSize: number, skip: number) => {
  const response = await sp.web.lists
    .getByTitle("BulkData")
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

export const getDropDownOptions = async (listName: string) => {
  const data = await sp.web.lists.getByTitle(listName).items.get();

  const options = data.map((option) => ({
    key: option.Id.toString(),
    text: option.Title,
  }));
  return options;
};

export const getCascadingDropDownOptions = async (
  countryId: string,
  lookupColumnName: string,
  listName: string
) => {
  const states = await sp.web.lists
    .getByTitle(listName)
    .items.filter(`${lookupColumnName} eq ${countryId}`)
    .get();

  const options = states.map((state) => ({
    key: state.Id.toString(),
    text: state.Title,
  }));
  return options;
};

// Define a function to handle submission
export const handleSubmission = async (contactForm: any, setLoading: Function, setContactForm: Function, setPeoplePickerState: Function) => {
  try {
    await updateOrCreateItem(contactForm, setLoading, setContactForm, setPeoplePickerState);
  } catch (error) {
    alert("Error submitting response: " + JSON.stringify(error));
  } finally {
    setLoading(false); // Reset loading state after submission (whether success or error)
  }
};

// Define a function to update or create an item based on the contact form data
const updateOrCreateItem = async (contactForm: any, setLoading: Function, setContactForm: Function, setPeoplePickerState: Function) => {
  setLoading(true);

  const contactList = sp.web.lists.getByTitle("ContactResponse");

  if (contactForm.isEdited && contactForm.id) {
    await updateExistingItem(contactForm, contactList);
  } else {
    await addNewItem(contactForm, contactList);
  }

  // Reset form fields
  setContactForm({
    id: 0,
    name: "",
    email: "",
    message: "",
    selectedOptions: [],
    selectedFiles: [],
    selectedPersons: [],
    isEdited: false,
    selectedCountry: "",
    selectedState: "",
    selectedDistrict: "",
  });
  // Reset PeoplePicker
  setPeoplePickerState((prevState: any) => ({ ...prevState, selectedPersons: [] }));
};

// Define a function to update an existing item
const updateExistingItem = async (contactForm: any, contactList: any) => {
  const { id, selectedFiles } = contactForm;

  await contactList.items.getById(id).update({
    Title: contactForm.name,
    Email: contactForm.email,
    Message: contactForm.message,
    Interests: contactForm.selectedOptions.join(", "),
    PeopleId: contactForm.selectedPersons.key,
    CountryId: contactForm.selectedCountry,
    StateId: contactForm.selectedState,
    DistrictId: contactForm.selectedDistrict,
  });

  await uploadFiles(id, selectedFiles);
  console.log("Item updated successfully!");
};

// Define a function to add a new item
const addNewItem = async (contactForm: any, contactList: any) => {
  const contactItem = await contactList.items.add({
    Title: contactForm.name,
    Email: contactForm.email,
    Message: contactForm.message,
    Interests: contactForm.selectedOptions.join(", "),
    PeopleStringId: {
      results: contactForm.selectedPersons.map((person: { key: any }) => person.key),
    },
    CountryId: contactForm.selectedCountry,
    StateId: contactForm.selectedState,
    DistrictId: contactForm.selectedDistrict,
  });

  const newResponseId = contactItem.data.Id;
  console.log("New Response ID:", newResponseId);

  await uploadFiles(newResponseId, contactForm.selectedFiles);
  console.log("Item added successfully!");
};

// Define a function to upload files
const uploadFiles = async (listItemId: number, selectedFiles: File[]) => {
  const documentLibraryUrl = "/sites/CRUDD/Contact";

  for (const file of selectedFiles) {
    // File upload logic here
    try {
      // File name formatting logic
      const filename = generateFilename(file.name);

      // File upload to SharePoint
      const fileUploadResult = await sp.web
        .getFolderByServerRelativePath(documentLibraryUrl)
        .files.add(filename, file, true);
      
      console.log("File uploaded: " + filename);

      // Update ListDataID for the uploaded file
      const uploadedFile = fileUploadResult.file;
      await (await uploadedFile.getItem()).update({ ListDataID: listItemId });
      console.log("LISTID updated for the file:", filename);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }
};

// Define a function to generate formatted filename
const generateFilename = (originalFilename: string) => {
  const now = new Date();
  const offsetInMinutes = 330; // Offset for GMT+05:30
  const offsetInMilliseconds = offsetInMinutes * 60 * 1000;
  const istDate = new Date(now.getTime() + offsetInMilliseconds);
  const formattedTimestamp = istDate.toISOString().replace(/[:\.]/g, "-");
  return `${formattedTimestamp}_${originalFilename}`;
};
