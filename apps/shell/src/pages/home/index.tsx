import { Button } from "antd";
import { useEffect, useState } from "react";

const Home = (props: { test: string }) => {
  const [state, setState] = useState(0);
  useEffect(() => {
  });
  return (
    <>
      <div className="text-3xl">home: {props.test}: {state}</div>
      <Button onClick={() => setState(i => i + 1)}>递增</Button>
    </>
  )
};
export default Home;