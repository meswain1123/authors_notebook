import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  selectPage,
  updateSelectedType,
  addType,
  updateType
} from "../../redux/actions/index";
// import Button from "@material-ui/core/Button";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Add from "@material-ui/icons/Add";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
// import { NavLink } from "react-router-dom";
import Button from "@material-ui/core/Button";
// import FormControl from '@material-ui/core/FormControl';
// import OutlinedInput from '@material-ui/core/OutlinedInput';
// import InputLabel from '@material-ui/core/InputLabel';
// import FormHelperText from '@material-ui/core/FormHelperText';
// import AttributesControl from "./AttributesControl";
// import SupersControl from "./SupersControl";
// import styled from 'styled-components';
import API from "../../api";
import Grid from "@material-ui/core/Grid";

// const Label = styled('label')`
//   padding: 0 0 4px;
//   line-height: 1.5;
//   display: block;
// `;

/* 
  This component will take the main portion of the page and is used for
  creating or editing a Type.  It will allow the use of Template Types
  and Super Types to make the process faster.
*/

const mapStateToProps = state => {
  // console.log(state);
  const type = state.app.selectedType;
  const subTypes =
    type === null
      ? []
      : state.app.types.filter(t => t.SuperIDs.includes(type._id));
  const things =
    type === null
      ? []
      : state.app.things.filter(t => t.TypeIDs.includes(type._id));
  return {
    selectedPage: state.app.selectedPage,
    selectedType: type,
    selectedWorld: state.app.selectedWorld,
    selectedWorldID: state.app.selectedWorldID,
    types: state.app.types,
    subTypes: subTypes,
    instances: things
  };
};
function mapDispatchToProps(dispatch) {
  return {
    selectPage: page => dispatch(selectPage(page)),
    updateSelectedType: type => dispatch(updateSelectedType(type)),
    addType: type => dispatch(addType(type)),
    updateType: type => dispatch(updateType(type))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: null,
      Name: "",
      Description: "",
      Supers: [],
      Major: false,
      Attributes: [],
      fieldValidation: {
        Name: { valid: true, message: "" },
        AttributesArr: { valid: true, message: "" }
      },
      formValid: false,
      message: "",
      redirectTo: null
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
    setTimeout(() => {
      const { id } = this.props.match.params;
      if (id !== undefined) { // When I move to storing more in session, this is the kind of place where I'll check.
        this.api.getType(this.props.selectedWorldID, id).then(res => {
          const supers = this.props.types.filter(type =>
            res.SuperIDs.includes(type._id)
          );
          this.setState({
            Name: res.Name,
            Description: res.Description,
            _id: id,
            Supers: supers,
            Major: res.Major
          });
          this.props.updateSelectedType(res);
        });
      } else {
        this.props.updateSelectedType({
          _id: null,
          Name: "",
          Description: "",
          Supers: [],
          AttributesArr: [],
          Major: false
        });
      }
    }, 500);
  }

  render() { 
    // Can I remove this?  It's a duplicate from what's in componentDidMount.  I think so
    const { id } = this.props.match.params;
    if (
      this.props.selectedType !== null &&
      this.props.selectedType._id !== id
    ) {
      // setTimeout(() => {
      if (id !== undefined) {
        this.api.getType(this.props.selectedWorldID, id).then(res => {
          const supers = this.props.types.filter(type =>
            res.SuperIDs.includes(type._id)
          );
          this.setState({
            Name: res.Name,
            Description: res.Description,
            _id: id,
            Supers: supers,
            Major: res.Major
          });
          this.props.updateSelectedType(res);
        });
      } else {
        this.props.updateSelectedType({
          _id: null,
          Name: "",
          Description: "",
          Supers: [],
          AttributesArr: [],
          Major: false
        });
      }
      // }, 500);
    }
    // const types = this.props.types === undefined || this.state._id === null ? this.props.types : this.props.types.filter(type => type._id !== this.state._id);

    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else {
      return (
        <Grid item xs={12} container spacing={0} direction="column">
          <Grid item container spacing={0} direction="row">
            <Grid item xs={7}>
              <h2>{this.state.Name}</h2>
            </Grid>
            <Grid item xs={2}>
              <h3>{this.state.Major ? "Major Type" : ""}</h3>
            </Grid>
            <Grid item xs={3}>
              <List>
                <ListItem>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    href={`/thing/create/type_id_${this.state._id}`}
                  >
                    <Add /><ListItemText primary={`Create New ${this.state.Name}`}/>
                  </Button>
                </ListItem>
                <ListItem>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    href={`/type/edit/${this.state._id}`}
                  >
                    <Edit />
                  </Button>
                </ListItem>
                <ListItem>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    href={`/type/delete/${this.state._id}`}
                  >
                    <Delete />
                  </Button>
                </ListItem>
              </List>
            </Grid>
          </Grid>
          <Grid item container spacing={0} direction="row">
            <Grid item xs={9} container spacing={0} direction="column">
              <Grid item>{this.state.Description}</Grid>
              <Grid item>
                Attributes
                <List>
                  {this.props.selectedType === null ||
                  this.props.selectedType === undefined
                    ? ""
                    : this.props.selectedType.AttributesArr.map(
                        (attribute, i) => {
                          return (
                            <ListItem key={i}>
                              <ListItemText>
                                {attribute.Name}
                                {attribute.Type === "Options" ? (
                                  <span>
                                    Options:
                                    {attribute.Options.map((option, j) => {
                                      return (
                                        <span key={j}>
                                          {j === 0 ? " " : ", "}
                                          {option}
                                        </span>
                                      );
                                    })}
                                  </span>
                                ) : attribute.Type === "Type" ? (
                                  "Type"
                                ) : (
                                  ""
                                )}
                              </ListItemText>
                            </ListItem>
                          );
                        }
                      )}
                </List>
              </Grid>
            </Grid>
            <Grid item xs={3} container spacing={0} direction="column">
              {this.state.Supers.length === 0 ? (
                ""
              ) : (
                <Grid item>
                  <List>
                    <ListItem>
                      <ListItemText primary={"Super Types"} />
                    </ListItem>
                    {this.state.Supers.map((superType, i) => {
                      return (
                        <ListItem key={i}>
                          <Button fullWidth
                            variant="contained"
                            color="primary"
                            href={`/type/details/${superType._id}`}
                          >
                            <ListItemText primary={superType.Name} />
                          </Button>
                        </ListItem>
                      );
                    })}
                  </List>
                </Grid>
              )}
              {this.props.subTypes.length === 0 ? (
                ""
              ) : (
                <Grid item>
                  <List>
                    <ListItem>
                      <ListItemText primary={"Sub Types"} />
                    </ListItem>
                    {this.props.subTypes.map((sub, i) => {
                      return (
                        <ListItem key={i}>
                          <Button fullWidth
                            variant="contained"
                            color="primary"
                            href={`/type/details/${sub._id}`}
                          >
                            <ListItemText primary={sub.Name} />
                          </Button>
                        </ListItem>
                      );
                    })}
                  </List>
                </Grid>
              )}
              {this.props.instances.length === 0 ? (
                ""
              ) : (
                <Grid item>
                  <List>
                    <ListItem>
                      <ListItemText primary={"Instances"} />
                    </ListItem>
                    {this.props.instances.map((thing, i) => {
                      return (
                        <ListItem key={i}>
                          <Button fullWidth
                            variant="contained"
                            color="primary"
                            href={`/thing/details/${thing._id}`}
                          >
                            <ListItemText primary={thing.Name} />
                          </Button>
                        </ListItem>
                      );
                    })}
                  </List>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        // <div className="col-sm-12">
        //   <div className="row">
        //     <div className="col-sm-12">
        //       <div className="row">
        //         <div className="col-sm-9">
        //           <div className="row">
        //             <div className="col-sm-12">
        //               <h2>{this.state.Name}</h2>
        //               <NavLink
        //                 to={`/type/edit/${this.state._id}`}
        //                 className="blue blackFont"
        //                 activeClassName="active"
        //               >
        //                 <Edit/>
        //               </NavLink>
        //               <NavLink
        //                 to={`/type/delete/${this.state._id}`}
        //                 className="blue blackFont"
        //                 activeClassName="active"
        //               >
        //                 <Delete/>
        //               </NavLink>
        //             </div>
        //           </div>
        //           <div className="row">
        //             <div className="col-sm-12">
        //               {this.state.Description}
        //             </div>
        //           </div>
        //         </div>
        //         <div className="col-sm-3">
        //           <List>
        //             <ListItem>
        //               <ListItemText primary={"Super Types"} />
        //             </ListItem>
        //             {this.state.Supers.map((superType, i) => {
        //               return (
        //                 <NavLink key={i}
        //                   to={`/type/details/${superType._id}`}
        //                   className="blue blackFont"
        //                   activeClassName="active"
        //                 >
        //                   <ListItem button className="curvedButton">
        //                     <ListItemText primary={superType.Name} />
        //                   </ListItem>
        //                 </NavLink>
        //               );
        //             })}
        //           </List>
        //         </div>
        //       </div>
        //       <div className="row">
        //         <div className="col-sm-12 margined">
        //           <div className="Attributes">
        //             Attributes
        //             { this.props.selectedType === null || this.props.selectedType === undefined ? "" :
        //               this.props.selectedType.AttributesArr.map((attribute,i) => {
        //                 return (
        //                   <div key={i} className="row bottomMargin">
        //                     <div className="col-sm-6">
        //                       {attribute.Name}
        //                     </div>
        //                     {/* <div className="col-sm-4">
        //                       Type: {attribute.Type}
        //                     </div> */}
        //                     { attribute.Type === "Options" ?
        //                       <div className="col-sm-6">
        //                           Options:
        //                           {
        //                             attribute.Options.map((option,j) => {
        //                               return (<span key={j}>{j===0?" ":", "}{option}</span>);
        //                             })
        //                           }

        //                       </div>
        //                       : (attribute.Type === "Type" ?
        //                       <div className="col-sm-4">
        //                         Type
        //                       </div>
        //                       : ""
        //                       )
        //                     }
        //                   </div>
        //                 );
        //               })
        //             }
        //           </div>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // </div>
      );
    }
  }
}

const TypeDetails = connect(mapStateToProps, mapDispatchToProps)(Page);
export default TypeDetails;
