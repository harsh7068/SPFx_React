import * as React from "react";
import { Persona, PersonaSize, Stack, Text } from "@fluentui/react";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

interface IProfileProps {
  userImageUrl?: string;
}

const Profile: React.FC<IProfileProps> = ({ userImageUrl }) => {
  const [userName, setUserName] = React.useState<string>("");
  const [userEmail, setUserEmail] = React.useState<string>("");
  const [userMobile, setUserMobile] = React.useState<number>(0);

  const loginEmail = sessionStorage.getItem("LoggedInUserEmail");

  React.useEffect(() => {
    getAllDetails();
  }, []);

  const getAllDetails = async () => {
    sp.setup({
      sp: {
        baseUrl: "https://pv3l.sharepoint.com/sites/CRUDD",
      },
    });

    try {
      const userList = await sp.web.lists
        .getByTitle("UserMaster")
        .items.filter(`Email eq '${loginEmail}'`)
        .get();

      if (userList.length > 0) {
        const userDetails = userList[0];
        setUserName(userDetails.Title);
        setUserEmail(userDetails.Email);
        setUserMobile(userDetails.Mobile);
        console.log(userDetails);
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <div>
      <Stack
        horizontalAlign="space-between"
        verticalAlign="center"
        tokens={{ padding: 10 }}
      >
        <div>
          <h2>Profile Page</h2>
        </div>
      </Stack>

      <Stack
        horizontalAlign="center"
        verticalAlign="center"
        tokens={{ childrenGap: 20 }}
      >
        <Persona
          text={userName}
          secondaryText={userEmail}
          imageUrl={userImageUrl}
          size={PersonaSize.size100}
        />
        <Text variant="xxLarge">{userName}</Text>
        <Text variant="large">{userEmail}</Text>
        <Text variant="large">{userMobile}</Text>
      </Stack>
    </div>
  );
};

export default Profile;
