import React, { Component } from "react";
import { connect } from "react-redux";


class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      version: "0"
    };
  }

  componentDidMount() {
  }

  render() {
    return (
        <div>Home</div>
    );
  }
}

const HomePage = connect()(Page);
export default HomePage;
