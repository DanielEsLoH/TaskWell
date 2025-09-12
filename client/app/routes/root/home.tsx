import type { Route } from "../../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TaskWell" },
    { name: "description", content: "Welcome to TaskWell!" },
  ];
}

const HomePage = () => {
  return (
    <div>HomePage</div>
  )
}

export default HomePage