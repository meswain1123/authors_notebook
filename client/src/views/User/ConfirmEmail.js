import React, { Component } from "react";
import { connect } from "react-redux";
import API from '../../smartAPI';


class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmEmailCode: null,
      codeValid: false,
      message: "Please wait.  Validating code."
    };
    this.api = API.getInstance();
  }

  componentDidMount = () => {
  }

  render() {
    if (this.state.confirmEmailCode === null) {
      const { id } = this.props.match.params;
      setTimeout(() => {
        this.api.confirmEmail(id).then(res => {
          if (res.error !== undefined) {
            this.setState({confirmEmailCode: id, codeValid: false, message: res.error});
          }
          else {
            this.setState({confirmEmailCode: id, codeValid: true, message: res.message});
          }
        });
      }, 500);
    }
    return (
      <div>
        <h2>Confirming Email</h2>
        {this.state.message}
      </div>
    );
  }
}

const ConfirmEmailPage = connect()(Page);
export default ConfirmEmailPage;
