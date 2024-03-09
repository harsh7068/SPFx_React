import * as React from "react";
import { Link } from "@fluentui/react/lib/Link";
import { IStackTokens, Stack, Text } from "@fluentui/react";
import { FontWeights } from "@fluentui/react/lib/Styling";
import "./Footer.css";

interface IFooterProps {
  // Add any necessary props here
}

const stackTokens: IStackTokens = { childrenGap: 20 };

const Footer: React.FC<IFooterProps> = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="modern-footer">
      <div className="container">
        {" "}
        {/* For layout */}
        <Stack horizontal tokens={stackTokens}>
          <Stack>
            <Text
              variant="xLargePlus"
              block
              styles={{
                root: { fontWeight: FontWeights.semibold, color: "White" },
              }}
            >
              Company Name
            </Text>
            <Text block styles={{ root: { color: "white" } }}>
              © {currentYear} All Rights Reserved
            </Text>
          </Stack>

          <Stack>
            {" "}
            {/* Navigation Links */}
            <Text variant="medium" block styles={{ root: { color: "white" } }}>
              Navigation
            </Text>
            <Link href="#">Home</Link>
            <Link href="#">About Us</Link>
            <Link href="#">Contact</Link>
          </Stack>

          <Stack>
            {" "}
            {/* Social Links */}
            <Text variant="medium" block styles={{ root: { color: "white" } }}>
              Follow Us
            </Text>
            <Link href="#" target="_blank">
              <i className="ms-Icon ms-Icon--Facebook" aria-hidden="true"></i>
            </Link>
            <Link href="#" target="_blank">
              <i className="ms-Icon ms-Icon--Twitter" aria-hidden="true"></i>
            </Link>
            {/* Add more links */}
          </Stack>
        </Stack>
      </div>
    </footer>
  );
};

export default Footer;
