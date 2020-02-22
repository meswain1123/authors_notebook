
import Home from "@material-ui/icons/Home";
import Forum from "@material-ui/icons/Forum";
// import LibraryBooks from "@material-ui/icons/LibraryBooks";
// import BubbleChart from "@material-ui/icons/BubbleChart";
// import LocationOn from "@material-ui/icons/LocationOn";
// import Notifications from "@material-ui/icons/Notifications";
// import Unarchive from "@material-ui/icons/Unarchive";
// import Language from "@material-ui/icons/Language";
import HomePage from "../../views/Home";
import TemplatePage from "../../views/Template";
// import LoginPage from "../../views/User/Login";


const menuRoutes = [
  {
    path: "/",
    name: "Home",
    // rtlName: "لوحة القيادة",
    icon: Home,
    component: HomePage,
    // layout: "/admin"
  },
  {
    path: "/Forums",
    name: "Forums",
    // rtlName: "لوحة القيادة",
    icon: Forum,
    component: TemplatePage,
    // layout: "/admin"
  }
];

export default menuRoutes;
