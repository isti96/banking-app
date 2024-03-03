import SlButton from "@shoelace-style/shoelace/dist/react/button/index";
import { useState } from "react";

const Button = () => {
  const [count, setCount] = useState(0);

  return (
    <SlButton variant="primary" onClick={() => setCount((count) => count + 1)}>
      Count is {count} shoelace
    </SlButton>
  );
};

export default Button;
