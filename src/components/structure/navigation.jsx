import urls from "../../utils/urls";
import Homepage from "../pages/homepage";

export const nav = [
  {
    id: "1",
    path: urls.client.homepage,
    name: "Strona główna",
    element: <Homepage />,
    isMenu: true,
    isPrivate: false,
  },
];
