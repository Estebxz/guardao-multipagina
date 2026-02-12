import { FC } from "react";

const Greeting: FC = () => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  let greeting = "";
  if (currentHour >= 6 && currentHour < 12) {
    greeting = "Buenos días";
  } else if (currentHour > 12 && currentHour < 18) {
    greeting = "Buenas tardes";
  } else {
    greeting = "Buenas noches";
  }

  return <h1 className="text-7xl font-fusion capitalize">{greeting}</h1>;
};

export default Greeting;
