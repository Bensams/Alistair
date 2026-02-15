import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Dashboard } from "./components/Dashboard";
import { ResidentsList } from "./components/ResidentsList";
import { AddResident } from "./components/AddResident";
import { EditResident } from "./components/EditResident";
import { ResidentProfile } from "./components/ResidentProfile";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "residents", Component: ResidentsList },
      { path: "residents/add", Component: AddResident },
      { path: "residents/:id", Component: ResidentProfile },
      { path: "residents/:id/edit", Component: EditResident },
      { path: "*", Component: NotFound },
    ],
  },
]);
