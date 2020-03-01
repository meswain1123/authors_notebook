import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import API from "../../api";
import Grid from "@material-ui/core/Grid";

const mapStateToProps = state => {
  return {
    user: state.app.user,
    things: state.app.things
  };
};
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: null,
      Name: "",
      redirectTo: null
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
    setTimeout(() => {
      const { id } = this.props.match.params;
      if (id !== undefined) {
        this.api.getThing(this.props.selectedWorldID, id).then(res => {
          this.setState({
            Name: res.Name,
            _id: id
          });
        });
      }
    }, 500);
  }

  delete = e => {
  }

  render() {
    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else {
      return (
        <Grid item xs={12}>
          Are you sure you want to delete {this.state.Name}?
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={this.delete}
          >
            Yes
          </Button>
          <Button
            fullWidth
            variant="contained"
            href={`/thing/details/${this.state._id}`}
          >
            Cancel
          </Button>
        </Grid>
      );
    }
  }
}

const ThingDelete = connect(mapStateToProps)(Page);
export default ThingDelete;
