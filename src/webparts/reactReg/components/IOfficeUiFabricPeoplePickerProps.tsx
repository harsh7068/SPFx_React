export interface IOfficeUiFabricPeoplePickerProps {
    // Define the properties for your People Picker component
    typePicker: string; // Add your specific properties as needed
    siteUrl: string;
    principalTypeUser: boolean;
    principalTypeSharePointGroup: boolean;
    principalTypeSecurityGroup: boolean;
    principalTypeDistributionList: boolean;
    numberOfItems: number;
    spHttpClient: any; // Replace with the appropriate type
    onChange?: (items: any[]) => void;
  }
  