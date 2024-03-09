import * as React from "react";
import { useDropzone } from "react-dropzone";
import {
  TextField,
  PrimaryButton,
  Dropdown,
  IDropdownOption,
} from "@fluentui/react";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import {
  BasePicker,
  IBasePickerSuggestionsProps,
} from "@fluentui/react/lib/Pickers";
import { IPersonaProps, Persona } from "@fluentui/react/lib/Persona";
import { sp } from "@pnp/sp";
import { IOfficeUiFabricPeoplePickerProps } from "./IOfficeUiFabricPeoplePickerProps";
import { IItem } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import "@pnp/sp/files";

interface IContactState {
  id: number;
  selectedPersons: any;
  name: string;
  email: string;
  message: string;
  selectedOptions: string[];
  selectedFiles: File[];
  isEdited: boolean;
  selectedCountry: string;
  selectedState: string;
  selectedDistrict: string;
}

interface IContactProps {
  editData?: {
    selectedDistrict: string;
    selectedState: string;
    selectedCountry: string;
    id: number;
    name: string;
    email: string;
    message: string;
    selectedOptions: string[];
    selectedPersons: any;
  };
}

const Contact: React.FC<IContactProps> = ({ editData }) => {
  const [contactForm, setContactForm] = React.useState<IContactState>({
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

  const [peoplePickerState, setPeoplePickerState] = React.useState<{
    isLoadingSuggestions: boolean;
    peoplePickerSuggestions: IPersonaProps[];
    selectedPersons: IPersonaProps[];
    isLoggedOut: boolean;
    isContactClicked: boolean;
    isAboutClicked: boolean;
    ishomeClicked: boolean;
    isProfileClicked: boolean;
  }>({
    isLoadingSuggestions: false,
    peoplePickerSuggestions: [],
    selectedPersons: [],
    isLoggedOut: false,
    isContactClicked: false,
    isAboutClicked: false,
    ishomeClicked: true,
    isProfileClicked: false,
  });

  const [countryOptions, setCountryOptions] = React.useState<IDropdownOption[]>(
    []
  );
  const [stateOptions, setStateOptions] = React.useState<IDropdownOption[]>([]);
  const [districtOptions, setDistrictOptions] = React.useState<
    IDropdownOption[]
  >([]);

  React.useEffect(() => {
    if (editData) {
      setContactForm({
        id: editData.id,
        name: editData.name,
        email: editData.email,
        message: editData.message,
        selectedOptions: editData.selectedOptions,
        selectedFiles: [],
        selectedPersons: editData.selectedPersons,
        isEdited: true,
        selectedCountry: editData.selectedCountry, // Set the country value
        selectedState: editData.selectedState, // Set the state value
        selectedDistrict: editData.selectedDistrict, // Set the district value
      });
    }
  }, [editData]);

  React.useEffect(() => {
    loadSiteUsers();
    loadCountryOptions();
  }, []);

  const loadSiteUsers = async () => {
    try {
      setPeoplePickerState((prevState) => ({
        ...prevState,
        isLoadingSuggestions: true,
      }));

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

      setPeoplePickerState((prevState) => ({
        ...prevState,
        peoplePickerSuggestions: userSuggestions,
        isLoadingSuggestions: false,
      }));
    } catch (error) {
      console.error("Error loading site users:", error);
      setPeoplePickerState((prevState) => ({
        ...prevState,
        isLoadingSuggestions: false,
      }));
    }
  };

  const onFilterChanged = (
    filterText: string,
    currentPersonas: IPersonaProps[]
  ): IPersonaProps[] => {
    return filterText
      ? peoplePickerState.peoplePickerSuggestions.filter((persona) =>
          persona.text
            ? persona.text.toLowerCase().indexOf(filterText.toLowerCase()) !==
              -1
            : false
        )
      : [];
  };

  const onItemSelected = (selectedItem?: IPersonaProps | undefined): void => {
    if (selectedItem) {
      setPeoplePickerState((prevState) => ({
        ...prevState,
        selectedPersons: [...prevState.selectedPersons, selectedItem],
      }));
    }
    console.log("YCTUVGHBKJN" + selectedItem?.key);
  };

  const onRemoveSelectedPerson = (index: number): void => {
    setPeoplePickerState((prevState) => {
      const updatedSelectedPersons = [...prevState.selectedPersons];
      updatedSelectedPersons.splice(index, 1);
      return {
        ...prevState,
        selectedPersons: updatedSelectedPersons,
      };
    });
  };

  const renderSuggestionItem = (
    props: IPersonaProps,
    renderSuggestionProps?: IBasePickerSuggestionsProps<IPersonaProps>
  ): JSX.Element => {
    return <Persona {...props} />;
  };

  const pickerSuggestionsProps = {
    suggestionsHeaderText: "Suggested People",
    noResultsFoundText: "No results found",
    isLoading: peoplePickerState.isLoadingSuggestions,
  } as IBasePickerSuggestionsProps<any>;

  const getTextFromItem = (item: IPersonaProps) => item.text || "";

  const OfficeUiFabricPeoplePickerComponent: React.FC<
    IOfficeUiFabricPeoplePickerProps
  > = () => {
    return (
      <BasePicker
        onResolveSuggestions={onFilterChanged}
        onRenderSuggestionsItem={renderSuggestionItem}
        onItemSelected={onItemSelected}
        getTextFromItem={getTextFromItem}
        pickerSuggestionsProps={pickerSuggestionsProps}
      />
    );
  };

  const handleInputChange = (fieldName: keyof IContactState, value: string) => {
    setContactForm((prevForm) => ({
      ...prevForm,
      [fieldName]: value,
    }));
  };

  const handleCheckboxChange = (value: string) => {
    const { selectedOptions } = contactForm;
    const index = selectedOptions.indexOf(value);

    if (index !== -1) {
      const updatedOptions = [...selectedOptions];
      updatedOptions.splice(index, 1);

      setContactForm((prevForm) => ({
        ...prevForm,
        selectedOptions: updatedOptions,
      }));
    } else {
      setContactForm((prevForm) => ({
        ...prevForm,
        selectedOptions: [...selectedOptions, value],
      }));
    }
  };

  const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      if (file.size > maxSizeInBytes) {
        alert(`File ${file.name} is too large. Maximum allowed size is 2 MB.`);
      } else {
        setContactForm((prevForm) => ({
          ...prevForm,
          selectedFiles: acceptedFiles,
        }));
        console.log(file);
      }
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    onDrop,
  });

  const loadCountryOptions = async () => {
    try {
      const countries = await sp.web.lists.getByTitle("Country").items.get();

      const options = countries.map((country) => ({
        key: country.Id.toString(),
        text: country.Title,
      }));

      setCountryOptions(options);
    } catch (error) {
      console.error("Error loading country options:", error);
    }
  };

  React.useEffect(() => {
    console.log("editData", editData);
    console.log("contactForm", contactForm);
  }, [editData, contactForm]);

  const fetchStateOptions = async (countryId: string) => {
    try {
      const states = await sp.web.lists
        .getByTitle("States")
        .items.filter(`ConutryID eq ${countryId}`)
        .get();

      const options = states.map((state) => ({
        key: state.Id.toString(),
        text: state.Title,
      }));

      setStateOptions(options);
    } catch (error) {
      console.error("Error fetching state options:", error);
    }
  };

  const fetchDistrictOptions = async (stateId: string) => {
    try {
      const districts = await sp.web.lists
        .getByTitle("District")
        .items.filter(`stateID eq ${stateId}`)
        .get();

      const options = districts.map((district) => ({
        key: district.Id.toString(),
        text: district.Title,
      }));

      setDistrictOptions(options);
    } catch (error) {
      console.error("Error fetching state district:", error);
    }
  };

  React.useEffect(() => {
    if (contactForm.selectedCountry) {
      fetchStateOptions(contactForm.selectedCountry);
    }
  }, [contactForm.selectedCountry]);

  React.useEffect(() => {
    if (contactForm.selectedState) {
      fetchDistrictOptions(contactForm.selectedState);
    }
  }, [contactForm.selectedState]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      sp.setup({
        sp: {
          baseUrl: "https://pv3l.sharepoint.com/sites/CRUDD",
        },
      });

      const contactList = sp.web.lists.getByTitle("ContactResponse");

      if (contactForm.isEdited && contactForm.id) {
        // If it's an edit, update the existing item
        await contactList.items.getById(contactForm.id).update({
          Title: contactForm.name,
          Email: contactForm.email,
          Message: contactForm.message,
          Interests: contactForm.selectedOptions.join(", "),
          PeopleId: contactForm.selectedPersons.key,
          CountryId: contactForm.selectedCountry,
          StateId: contactForm.selectedState,
          DistrictId: contactForm.selectedDistrict,
        });

        const existingID = contactForm.id;
        console.log("Existing ID:", existingID);

        if (existingID && contactForm.selectedFiles.length > 0) {
          const listItem: IItem = await contactList.items
            .getById(existingID)
            .get();

          if (listItem && Object.keys(listItem).length > 0) {
            const documentLibraryUrl = "/sites/CRUDD/Contact";

            for (const file of contactForm.selectedFiles) {
              const now = new Date();

              // Calculate offset for GMT+05:30 (330 minutes)
              const offsetInMinutes = 330;
              const offsetInMilliseconds = offsetInMinutes * 60 * 1000;

              // Adjust for GMT+05:30
              const istDate = new Date(now.getTime() + offsetInMilliseconds);

              // Format timestamp (replace with your preferred format)
              const formattedTimestamp = istDate
                .toISOString()
                .replace(/[:\.]/g, "-");
              const filename = `${formattedTimestamp}_${file.name}`;
              console.log("File" + filename);

              try {
                const fileUploadResult = await sp.web
                  .getFolderByServerRelativePath(documentLibraryUrl)
                  .files.add(filename, file, true);
                console.log("File uploaded: " + filename);

                const uploadedFile = fileUploadResult.file;
                await (
                  await uploadedFile.getItem()
                ).update({
                  ListDataID: existingID,
                });
                alert("Response updated Successfully!!!");
                console.log("LISTID updated for the file:", filename);
              } catch (error) {
                console.error("Error uploading file:", error);
              }
            }
          } else {
            console.error("Item does not exist in the list.");
          }
        } else {
          console.error("Invalid Response ID or no selected files.");
        }
        console.log("Item updated successfully!");
      } else {
        // If it's a new submission, add a new item
        const contactItem = await contactList.items.add({
          Title: contactForm.name,
          Email: contactForm.email,
          Message: contactForm.message,
          Interests: contactForm.selectedOptions.join(", "),
          PeopleStringId: {
            results: contactForm.selectedPersons.map(
              (person: { key: any }) => person.key
            ),
          },
          CountryId: contactForm.selectedCountry,
          StateId: contactForm.selectedState,
          DistrictId: contactForm.selectedDistrict,
        });

        const newResponseId = contactItem.data.Id;
        console.log("New Response ID:", newResponseId);

        if (newResponseId && contactForm.selectedFiles.length > 0) {
          const listItem: IItem = await contactList.items
            .getById(newResponseId)
            .get();

          if (listItem && Object.keys(listItem).length > 0) {
            const documentLibraryUrl = "/sites/CRUDD/Contact";

            for (const file of contactForm.selectedFiles) {
              const now = new Date();

              // Calculate offset for GMT+05:30 (330 minutes)
              const offsetInMinutes = 330;
              const offsetInMilliseconds = offsetInMinutes * 60 * 1000;

              // Adjust for GMT+05:30
              const istDate = new Date(now.getTime() + offsetInMilliseconds);

              // Format timestamp (replace with your preferred format)
              const formattedTimestamp = istDate
                .toISOString()
                .replace(/[:\.]/g, "-");
              const filename = `${formattedTimestamp}_${file.name}`;
              console.log("File" + filename);

              try {
                const fileUploadResult = await sp.web
                  .getFolderByServerRelativePath(documentLibraryUrl)
                  .files.add(filename, file, true);
                console.log("File uploaded: " + filename);

                const uploadedFile = fileUploadResult.file;
                await (
                  await uploadedFile.getItem()
                ).update({
                  ListDataID: newResponseId,
                });
                alert("Response Submitted Successfully!!!");
                console.log("LISTID updated for the file:", filename);
              } catch (error) {
                console.error("Error uploading file:", error);
              }
            }
          } else {
            console.error("Item does not exist in the list.");
          }
        } else {
          console.error("Invalid Response ID or no selected files.");
        }
      }

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
      setPeoplePickerState((prevState) => ({
        ...prevState,
        selectedPersons: [],
      }));
    } catch (error) {
      alert("Error submitting response!!!" + JSON.stringify(error));
    }
  };

  return (
    <div style={{ marginBottom: "50px" }}>
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <Stack tokens={{ childrenGap: 15 }}>
          <TextField
            label="Name"
            value={contactForm.name}
            onChange={(_, value) => handleInputChange("name", value || "")}
            required
          />
          <TextField
            label="Email"
            type="email"
            value={contactForm.email}
            onChange={(_, value) => handleInputChange("email", value || "")}
            required
          />
          <TextField
            label="Message"
            multiline
            rows={4}
            value={contactForm.message}
            onChange={(_, value) => handleInputChange("message", value || "")}
            required
          />
          <Dropdown
            key={contactForm.selectedCountry}
            label="Select Country"
            selectedKey={contactForm.selectedCountry}
            options={countryOptions}
            onChange={(_, option) => {
              if (option) {
                setContactForm((prevForm) => ({
                  ...prevForm,
                  selectedCountry: option.key.toString(),
                  selectedState: "",
                  selectedDistrict: "",
                }));
                fetchStateOptions(option.key.toString());
              }
            }}
          />

          {contactForm.selectedCountry && (
            <Dropdown
              label="Select State"
              selectedKey={contactForm.selectedState}
              options={stateOptions}
              onChange={(_, option) => {
                if (option) {
                  setContactForm((prevForm) => ({
                    ...prevForm,
                    selectedState: option.key.toString(),
                    selectedDistrict: "", // Reset district on state change
                  }));
                  fetchDistrictOptions(option.key.toString());
                }
              }}
            />
          )}

          {contactForm.selectedState && (
            <Dropdown
              label="Select District"
              selectedKey={contactForm.selectedDistrict}
              options={districtOptions}
              onChange={(_, option) => {
                if (option) {
                  setContactForm((prevForm) => ({
                    ...prevForm,
                    selectedDistrict: option.key.toString(),
                  }));
                }
              }}
            />
          )}

          <label style={{ fontWeight: "bold" }}>People Picker</label>
          <OfficeUiFabricPeoplePickerComponent
            typePicker={""}
            siteUrl={""}
            principalTypeUser={false}
            principalTypeSharePointGroup={false}
            principalTypeSecurityGroup={false}
            principalTypeDistributionList={false}
            numberOfItems={0}
            spHttpClient={undefined}
          />
          <div>
            {Array.isArray(peoplePickerState.selectedPersons) &&
              peoplePickerState.selectedPersons.map((persona, index) => (
                <div key={persona.key || Math.random().toString()}>
                  {persona.text}
                  <span
                    style={{
                      marginLeft: 8,
                      cursor: "pointer",
                      color: "red",
                    }}
                    onClick={() => onRemoveSelectedPerson(index)}
                  >
                    &#10006;
                  </span>
                </div>
              ))}
          </div>
          <Dropdown
            label="Select Interests"
            multiSelect
            selectedKeys={contactForm.selectedOptions}
            options={[
              { key: "C#", text: "C#" },
              { key: "JAVA", text: "JAVA" },
              { key: "C++", text: "C++" },
            ]}
            onChange={(_, option) =>
              option && handleCheckboxChange(option.key as string)
            }
          />
          <div
            {...getRootProps()}
            style={{
              border: "1px dashed gray",
              padding: "20px",
              backgroundColor: getRootProps().isDragActive
                ? "lightgray"
                : "white",
            }}
          >
            <input {...getInputProps()} />
            {getRootProps().isDragActive ? (
              <p>Drop files here ...</p>
            ) : (
              <p>Drag 'n' drop files here, or click to select files</p>
            )}
          </div>

          {contactForm.selectedFiles.map((file, index) => (
            <div key={index}>{file.name}</div>
          ))}
          <PrimaryButton type="submit" text="Submit" />
        </Stack>
      </form>
    </div>
  );
};

export default Contact;
