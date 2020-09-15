
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import ANBApp from "./ANB/App";
import ANBstore from "./ANB/redux/store/index";
import VTTApp from "./VTT/App";
import VTTstore from "./VTT/redux/store/index";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";

if (window.location.href.includes("/vtt")) {
  ReactDOM.render(
    <Provider store={VTTstore}>
      <VTTApp />
    </Provider>,
    document.getElementById("root")
  );
} else {
  ReactDOM.render(
    <Provider store={ANBstore}>
      <ANBApp />
    </Provider>,
    document.getElementById("root")
  );
}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

