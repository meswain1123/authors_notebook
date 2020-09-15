
import Home from "@material-ui/icons/Home";
import Forum from "@material-ui/icons/Forum";
import HomePage from "../../views/Home";
import GeneralDiscussionPage from "../../views/Discussion/GeneralDiscussion";


const menuRoutes = [
  {
    path: "/",
    name: "Home",
    icon: Home,
    component: HomePage,
  },
  {
    path: "/discussion",
    name: "Discussion",
    icon: Forum,
    component: GeneralDiscussionPage,
  }
];

export default menuRoutes;
