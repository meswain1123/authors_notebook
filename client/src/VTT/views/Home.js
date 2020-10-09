import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid
} from "@material-ui/core";
import {
  // notFromLogin
} from "../redux/actions/index";
// import MediaCard from "../components/Displays/MediaCard";
// import ContentEditableBox from "../components/Inputs/ContentEditableBox";

const mapStateToProps = state => {
  return {
    // fromLogin: state.app.fromLogin
  };
};
function mapDispatchToProps(dispatch) {
  return {
    // notFromLogin: () => dispatch(notFromLogin({}))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      version: "0",
      redirectTo: null
    };
  }

  componentDidMount() {}

  render() {
    if (this.props.fromLogin) {
      this.props.notFromLogin();
    }
    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else {
      return (
        <div>
          <h3>Dead Simple Virtual Table Top</h3>
          <p>
            This is a Virtual Table Top I'm making for my friends
            and I to use for D&amp;D.
          </p>
          <p>
            It will have two pages.  The DM page and the player page.
            There will be a canvas with zoom and pan capabilities.  
            The canvas will have three layers.  The bottom layer is the 
            map.  The middle layer is the token layer, and it will have 
            tokens representing anything which can be interacted with.
            The top layer is the fog layer, and it will contain the 
            fog of war as well as magical darkness.
          </p>
          <p>
            The canvas will make an X * Y grid, and the map layer 
            will fill the grid.  Each token will have a numerical 
            size representing the diameter of the object.  Small
            and Medium creatures will have a size of 1.  Large
            creatures will have a size of 2.  Etc.  If tokens are 
            added to represent other objects with other shape types
            (ladders, ropes, etc), then for now they can be represented
            using multiple tokens.
          </p>
          <p>
            The fog of war will cover everything except for what the 
            DM chooses to reveal.  It will be done by placing a 1x1 image
            over each square of the map that is covered by the fog of war.
            On the DM page these images will have 30% opacity.
          </p>
          <p>
            The player page will show whatever the DM page shows, except 
            with opaque fog of war and no controls.  
            (Later I might make it so the DM can set what the player page
            sees independantly of what they see.)
          </p>
          <p>
            The DM page will have these abilities:
            Create a map (takes an image and X and Y values).
            Open a map.
            Pan/Zoom.
            Add/Remove tokens.
            Move tokens.
            Add/Remove fog of war.
          </p>
          <p>
            <Grid container spacing={1} direction="column">
              <Grid item>
                To do:
              </Grid>
              {/* <Grid item>
                Draw the grid lines on the DM page - 
                while possible, I think it would slow the 
                render too much to be worth it.
              </Grid> */}
              <Grid item>
                Get it into AWS so everyone can join 
                on their own and I don't have to 
                share my screen.
              </Grid>
              <Grid item>
                Give each player their own credentials
                for logging in.  Associate player accounts
                with tokens.  Make it so the DM is able to
                give players control of their token, 
                as well as take it back.  In that situation it's 
                automatically in single select mode, and their 
                token is the only one not locked.
              </Grid>
              <Grid item>
                Low Priority:  
              </Grid>
              <Grid item>
                Allow for rotation of tokens.  
              </Grid>
              <Grid item>
                Do tokens for things like sphere, cone, line effects.
              </Grid>
              <Grid item></Grid>
            </Grid>
            
          </p>
        </div>
      );
    }
  }
}

const HomePage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default HomePage;
