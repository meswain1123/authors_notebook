
import Home from "@material-ui/icons/Home";
import Forum from "@material-ui/icons/Forum";
import HomePage from "../../views/Home";
import TemplatePage from "../../views/Template";


const menuRoutes = [
  {
    path: "/",
    name: "Home",
    icon: Home,
    component: HomePage,
  },
  {
    path: "/Forums",
    name: "Forums",
    icon: Forum,
    component: TemplatePage,
  }
];

export default menuRoutes;
