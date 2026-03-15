import { FC } from "react";

const GREETINGS = [
  { from: 0, to: 6, text: "Que haces despierto?!" },
  { from: 6, to: 12, text: "Buenos días" },
  { from: 12, to: 18, text: "Buenas tardes" },
  { from: 18, to: 24, text: "Buenas noches" },
] as const;

const Greeting: FC = () => {
  const hour = new Date().getHours();
  const { text } = GREETINGS.find(({ from, to }) => hour >= from && hour < to)!;

  return <h1 className="text-7xl font-fusion capitalize">{text}</h1>;
};

export default Greeting;
