import * as React from "react";
import { Text, Stack } from "@fluentui/react";

const About: React.FC = () => {
  return (
    <Stack>
      <Text variant="xxLarge">About Us</Text>
      <p>
        Welcome to our website! We are a company dedicated to providing
        high-quality services and solutions for our clients. Our team is
        passionate about delivering excellence and meeting the unique needs of
        each customer.
        <br />
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatibus
        sint iusto, accusamus blanditiis voluptates omnis aspernatur. Sit, nobis
        odio commodi, maiores nam amet expedita exercitationem dolorem hic
        eligendi, consequuntur est! Lorem ipsum dolor sit, amet consectetur
        adipisicing elit. Doloribus, odio. Reiciendis quisquam cupiditate odit
        voluptate voluptatem officiis dolore facere doloremque! Deleniti magnam
        asperiores dolorum accusantium, voluptatibus tempora reprehenderit optio
        hic.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet
        dapibus lectus. Proin auctor sapien nec ligula cursus, at feugiat justo
        finibus. Duis id turpis ac tortor congue sodales id non erat. Quisque
        quis ligula odio. Nullam eu diam quis purus viverra sollicitudin eget in
        urna. Nam malesuada eros at ultricies tincidunt. Nulla facilisi.
      </p>
      {/* Add more content as needed */}
    </Stack>
  );
};

export default About;
