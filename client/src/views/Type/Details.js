import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  updateSelectedType,
  addType,
  updateType,
  setTypes,
  setAttributes,
  setThings,
  setAllUsers,
  notFromLogin,
  toggleLogin,
  logout,
} from "../../redux/actions/index";
import { Edit, Delete, Add, ArrowBack } from "@material-ui/icons";
import {
  Fab,
  Modal,
  Grid,
  Button,
  Tooltip,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { Helmet } from "react-helmet";
import API from "../../smartAPI";
import CommentsControl from "../../components/Inputs/CommentsControl";
// import ReactQuill from '../../components/Inputs/ReactQuill';
// import '../../assets/css/quill.read-only.css';


/* 
  This component will take the main portion of the page and is used for
  creating or editing a Type.  It will allow the use of Super Types 
  to make the process faster.
*/

const mapStateToProps = (state) => {
  const type = state.app.selectedType;
  const subTypes =
    type === null
      ? []
      : state.app.types.filter((t) => t.SuperIDs.includes(type._id));
  const things =
    type === null
      ? []
      : state.app.things.filter((t) => t.TypeIDs.includes(type._id));
  return {
    selectedPage: state.app.selectedPage,
    selectedType: type,
    selectedWorld: state.app.selectedWorld,
    selectedWorldID: state.app.selectedWorldID,
    types: state.app.types,
    subTypes: subTypes,
    instances: things,
    user: state.app.user,
    things: state.app.things,
    attributesByID: state.app.attributesByID,
    attributesByName: state.app.attributesByName,
    fromLogin: state.app.fromLogin,
    allUsers: state.app.allUsers,
    typeSuggestions: state.app.typeSuggestions,
    thingSuggestions: state.app.thingSuggestions
  };
};
function mapDispatchToProps(dispatch) {
  return {
    updateSelectedType: (type) => dispatch(updateSelectedType(type)),
    addType: (type) => dispatch(addType(type)),
    updateType: (type) => dispatch(updateType(type)),
    setTypes: (types) => dispatch(setTypes(types)),
    setAttributes: (attributes) => dispatch(setAttributes(attributes)),
    setAllUsers: allUsers => dispatch(setAllUsers(allUsers)),
    setThings: (things) => dispatch(setThings(things)),
    notFromLogin: () => dispatch(notFromLogin({})),
    toggleLogin: () => dispatch(toggleLogin({})),
    logout: () => dispatch(logout({})),
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: null,
      fieldValidation: {
        Name: { valid: true, message: "" },
      },
      formValid: false,
      message: "",
      redirectTo: null,
      modalOpen: false,
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
    // load();
  }

  getModalStyle = () => {
    const top = Math.round(window.innerHeight / 2) - 50;
    const left = Math.round(window.innerWidth / 2) - 200;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(${left}px, ${top}px)`,
    };
  };

  delete = (e) => {
    this.api
      .deleteType(this.props.selectedWorldID, this.state._id)
      .then((res) => {
        if (res.error === undefined) {
          this.api.getWorld(this.props.selectedWorldID, true).then((res2) => {
            this.props.setAttributes(res2.attributes);
            this.props.setTypes(res2.types);
            this.props.setThings(res2.things);

            this.setState({
              redirectTo: `/world/details/${this.props.selectedWorldID}`,
            });
          });
          // this.getWorld().then(res2 => {
          //   this.setState({redirectTo: `/world/details/${this.props.selectedWorldID}`});
          // });
        } else {
          this.setState({ waiting: false, message: res.error }, () => {
            this.props.logout();
          });
        }
      });
  };

  load = (id) => {
    // const { id } = this.props.match.params;
    setTimeout(() => {
      this.setState(
        {
          _id: id,
          redirectTo: null,
          loaded: false
        },
        this.finishLoading
      );
    }, 500);
  };

  finishLoading = () => {
    if (this.props.fromLogin) {
      this.props.notFromLogin();
    }
    const id = this.state._id;
    if (id !== undefined) {
      this.api.getWorld(this.props.selectedWorldID).then((res) => {
        this.props.setAttributes(res.attributes);
        this.props.setTypes(res.types);
        this.props.setThings(res.things);

        if (id !== null) {
          let type = res.types.filter((t) => t._id === id);
          if (type.length > 0) {
            type = type[0];

            this.props.updateSelectedType(type);
            this.setState({ loaded: true });
          } else {
            this.setState({ message: "Invalid ID", loaded: true });
          }
        } else {
          this.props.updateSelectedType({
            _id: null,
            Name: "",
            Description: "",
            Supers: [],
            SuperIDs: [],
            AttributesArr: [],
            Attributes: [],
            Major: false,
            DefaultsHash: {},
          });
        }
      });
    } else {
      this.props.updateSelectedType({
        _id: null,
        Name: "",
        Description: "",
        Supers: [],
        AttributesArr: [],
        Attributes: [],
        Major: false,
      });
    }
  };

  redirectToNext = () => {
    // Find the next type
    let index = 0;
    while (this.props.types[index]._id !== this.props.selectedType._id) index++;
    index++;
    if (index === this.props.types.length) index = 0;
    this.setState({
      redirectTo: `/type/details/${this.props.types[index]._id}`,
    });
  };

  render() {
    const { id } = this.props.match.params;
    if (this.state._id !== id) {
      this.load(id);
      return (<span>Loading</span>);
    } else if (!this.state.loaded) {
      return (<span>Loading</span>);
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else if (
      this.props.selectedWorld !== null &&
      !this.props.selectedWorld.Public &&
      this.props.user === null
    ) {
      setTimeout(() => {
        this.props.toggleLogin();
      }, 500);
      return <span>Requires Login</span>;
    } else if (
      this.props.selectedWorld !== null &&
      !this.props.selectedWorld.Public &&
      this.props.selectedWorld.Owner !== this.props.user._id &&
      this.props.selectedWorld.Collaborators.filter(
        (c) => c.userID === this.props.user._id && c.type === "collab"
      ).length === 0
    ) {
      return <Redirect to="/" />;
    } else if (
      this.props.selectedType === undefined ||
      this.props.selectedType === null
    ) {
      return <span>Loading</span>;
    // } else if (this.props.allUsers.length === 0) {
    //   setTimeout(() => {
    //     this.api.getAllUsers().then(res => {
    //       this.props.setAllUsers(res);
    //     });
    //   }, 500);
    //   return (<span>Loading</span>);
    } else {
      const references = this.props.types.filter(
        (t) =>
          t.ReferenceIDs !== undefined &&
          t.ReferenceIDs.includes(this.state._id)
      );
      const inheritedAttributes = [];
      this.props.selectedType.Supers.forEach((superType) => {
        superType.AttributesArr.forEach((attribute) => {
          if (
            inheritedAttributes.filter((a) => a.attrID === attribute.attrID)
              .length === 0
          ) {
            inheritedAttributes.push(attribute);
          }
        });
      });
      const suggestions = [...this.props.typeSuggestions, ...this.props.thingSuggestions];
      return (
        <Grid item xs={12} container spacing={0} direction="column">
          {this.props.selectedWorld !== null && 
            <div>
              <Helmet>
                <title>{`Author's Notebook: ${this.props.selectedWorld.Name}`}</title>
              </Helmet>
              <Grid item container spacing={0} direction="row">
                <Grid item xs={12} sm={8} container spacing={0} direction="column">
                  <Grid item container spacing={0} direction="row">
                    <Grid item xs={1}>
                      <Tooltip
                        title={`Back to ${this.props.selectedWorld.Name}`}
                      >
                        <Fab
                          size="small"
                          color="primary"
                          onClick={(_) => {
                            this.setState({
                              redirectTo: `/world/details/${this.props.selectedWorldID}`,
                            });
                          }}
                        >
                          <ArrowBack />
                        </Fab>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={11}>
                      <h2>{this.props.selectedType.Name}</h2>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <h3>{this.props.selectedType.Major ? "Major Type" : ""}</h3>
                  </Grid>
                  <Grid item>
                    <div  dangerouslySetInnerHTML={{__html: this.props.selectedType.Description}} />
                    {/* {this.props.selectedType.Description} */}
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <List>
                    {this.props.user !== null &&
                      this.props.selectedWorld !== null &&
                      (this.props.selectedWorld.Owner === this.props.user._id ||
                        this.props.selectedWorld.Collaborators.filter(
                          (c) =>
                            c.userID === this.props.user._id &&
                            c.type === "collab" &&
                            c.editPermission
                        ).length > 0) && (
                        <ListItem>
                          <Grid container spacing={1} direction="row">
                            <Grid item xs={4} sm={12}>
                              <Tooltip title={`Create New ${this.props.selectedType.Name}`}>
                                <Fab
                                  size="small" color="primary"
                                  onClick={(_) => {
                                    this.setState({
                                      redirectTo: `/thing/create/type_id_${this.state._id}`,
                                    });
                                  }}>
                                  <Add />
                                </Fab>
                              </Tooltip>
                            </Grid>
                            <Grid item xs={4} sm={12}>
                              <Tooltip title={`Edit ${this.props.selectedType.Name}`}>
                                <Fab
                                  size="small" color="primary"
                                  onClick={(_) => {
                                    this.setState({
                                      redirectTo: `/type/edit/${this.state._id}`,
                                    });
                                  }}>
                                  <Edit />
                                </Fab>
                              </Tooltip>
                            </Grid>
                            <Grid item xs={4} sm={12}>
                              <Tooltip title={`Delete ${this.props.selectedType.Name}`}>
                                <Fab
                                  size="small" color="primary"
                                  onClick={(e) => {
                                    this.setState({ modalOpen: true });
                                  }}>
                                  <Delete />
                                </Fab>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </ListItem>
                      )}
                    <ListItem>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={(_) => {
                          this.redirectToNext();
                        }}
                      >
                        <ListItemText primary="Next Type" />
                      </Button>
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
              <Grid item container spacing={0} direction="row">
                <Grid item xs={12} sm={8} container spacing={0} direction="column">
                  <Grid item>Attributes</Grid>
                  <Grid item>
                    <List>
                      {this.props.selectedType !== null &&
                        this.props.selectedType !== undefined &&
                        inheritedAttributes.map((attribute, i) => {
                          let definedType = this.props.types.filter(
                            (t) => t._id === attribute.DefinedType
                          );
                          definedType =
                            definedType.length === 0
                              ? { Name: "" }
                              : definedType[0];
                          const def = this.props.selectedType.DefaultsHash[
                            attribute.attrID
                          ];
                          return (
                            <ListItem key={i}>
                              <ListItemText>
                                {attribute.Name}:&nbsp;
                                {attribute.AttributeType === "Options" ? (
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
                                    {def !== undefined &&
                                      def.DefaultValue !== undefined &&
                                      def.DefaultValue !== "" &&
                                      ` (Default: ${def.DefaultValue})`}
                                  </span>
                                ) : attribute.AttributeType === "Type" ? (
                                  <span>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={(_) => {
                                        this.setState({
                                          redirectTo: `/type/details/${attribute.DefinedType}`,
                                        });
                                      }}
                                    >
                                      <ListItemText
                                        primary={definedType.Name}
                                      />
                                    </Button>
                                    {def !== undefined &&
                                      def.DefaultValue !== undefined &&
                                      def.DefaultValue !== "" &&
                                      this.props.things.filter(
                                        (t) => def.DefaultValue === t._id
                                      ).length > 0 &&
                                      ` (Default: ${
                                        this.props.things.filter(
                                          (t) => t._id === def.DefaultValue
                                        )[0].Name
                                      })`}
                                  </span>
                                ) : attribute.AttributeType === "List" ? (
                                  <span>
                                    List:&nbsp;
                                    {attribute.ListType === "Options" ? (
                                      <span>
                                        Options:
                                        {attribute.Options.map(
                                          (option, j) => {
                                            return (
                                              <span key={j}>
                                                {j === 0 ? " " : ", "}
                                                {option}
                                              </span>
                                            );
                                          }
                                        )}
                                        {def !== undefined &&
                                          def.DefaultListValues !==
                                            undefined &&
                                          def.DefaultListValues.length >
                                            0 && (
                                            <span>
                                              &nbsp;(Defaults:
                                              {def.DefaultListValues.map(
                                                (defaultValue, j) => {
                                                  return (
                                                    <span key={j}>
                                                      {j === 0 ? " " : ", "}
                                                      {defaultValue}
                                                    </span>
                                                  );
                                                }
                                              )}
                                              )
                                            </span>
                                          )}
                                      </span>
                                    ) : attribute.ListType === "Type" ? (
                                      <span>
                                        <Button
                                          variant="contained"
                                          color="primary"
                                          onClick={(_) => {
                                            this.setState({
                                              redirectTo: `/type/details/${attribute.DefinedType}`,
                                            });
                                          }}
                                        >
                                          <ListItemText
                                            primary={definedType.Name}
                                          />
                                        </Button>
                                        {def !== undefined &&
                                          def.DefaultListValues !==
                                            undefined &&
                                          def.DefaultListValues.length > 0 &&
                                          this.props.things.filter((t) =>
                                            def.DefaultListValues.includes(
                                              t._id
                                            )
                                          ).length > 0 && (
                                            <span>
                                              &nbsp;(Defaults:
                                              {def.DefaultListValues.map(
                                                (defaultValue, j) => {
                                                  let defaultThing = this.props.things.filter(
                                                    (t) =>
                                                      t._id === defaultValue
                                                  );
                                                  if (
                                                    defaultThing.length === 0
                                                  )
                                                    return (
                                                      <span key={j}></span>
                                                    );
                                                  else {
                                                    defaultThing =
                                                      defaultThing[0];
                                                    return (
                                                      <span key={j}>
                                                        {j === 0 ? " " : ", "}
                                                        <Button
                                                          variant="contained"
                                                          color="primary"
                                                          onClick={(_) => {
                                                            this.setState({
                                                              redirectTo: `/thing/details/${defaultValue}`,
                                                            });
                                                          }}
                                                        >
                                                          <ListItemText
                                                            primary={
                                                              defaultThing.Name
                                                            }
                                                          />
                                                        </Button>
                                                      </span>
                                                    );
                                                  }
                                                }
                                              )}
                                              )
                                            </span>
                                          )}
                                      </span>
                                    ) : (
                                      <span>
                                        {attribute.ListType}
                                        {def !== undefined &&
                                          def.DefaultListValues !==
                                            undefined &&
                                          def.DefaultListValues.length >
                                            0 && (
                                            <span>
                                              &nbsp;(Defaults:
                                              {def.DefaultListValues.map(
                                                (defaultValue, j) => {
                                                  return (
                                                    <span key={j}>
                                                      {j === 0 ? " " : ", "}
                                                      {defaultValue}
                                                    </span>
                                                  );
                                                }
                                              )}
                                              )
                                            </span>
                                          )}
                                      </span>
                                    )}
                                  </span>
                                ) : attribute.AttributeType ===
                                  "True/False" ? (
                                  <span>
                                    {attribute.AttributeType}
                                    {def !== undefined &&
                                    def.DefaultValue !== undefined &&
                                    def.DefaultValue !== ""
                                      ? ` (Default: ${def.DefaultValue})`
                                      : " (Default: False)"}
                                  </span>
                                ) : (
                                  <span>
                                    {attribute.AttributeType}
                                    {def !== undefined &&
                                      def.DefaultValue !== undefined &&
                                      def.DefaultValue !== "" &&
                                      ` (Default: ${def.DefaultValue})`}
                                  </span>
                                )}
                              </ListItemText>
                            </ListItem>
                          );
                        })}
                      {this.props.selectedType !== null &&
                        this.props.selectedType !== undefined &&
                        this.props.selectedType.AttributesArr.map(
                          (attribute, i) => {
                            let definedType = this.props.types.filter(
                              (t) => t._id === attribute.DefinedType
                            );
                            definedType =
                              definedType.length === 0
                                ? { Name: "" }
                                : definedType[0];
                            const def = this.props.selectedType.DefaultsHash[
                              attribute.attrID
                            ];
                            return (
                              <ListItem key={i}>
                                <ListItemText>
                                  {attribute.Name}:&nbsp;
                                  {attribute.AttributeType === "Options" ? (
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
                                      {def !== undefined &&
                                        def.DefaultValue !== undefined &&
                                        def.DefaultValue !== "" &&
                                        ` (Default: ${def.DefaultValue})`}
                                    </span>
                                  ) : attribute.AttributeType === "Type" ? (
                                    <span>
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={(_) => {
                                          this.setState({
                                            redirectTo: `/type/details/${attribute.DefinedType}`,
                                          });
                                        }}
                                      >
                                        <ListItemText
                                          primary={definedType.Name}
                                        />
                                      </Button>
                                      {def !== undefined &&
                                        def.DefaultValue !== undefined &&
                                        def.DefaultValue !== "" &&
                                        this.props.things.filter(
                                          (t) => def.DefaultValue === t._id
                                        ).length > 0 &&
                                        ` (Default: ${
                                          this.props.things.filter(
                                            (t) => t._id === def.DefaultValue
                                          )[0].Name
                                        })`}
                                    </span>
                                  ) : attribute.AttributeType === "List" ? (
                                    <span>
                                      List:&nbsp;
                                      {attribute.ListType === "Options" ? (
                                        <span>
                                          Options:
                                          {attribute.Options.map(
                                            (option, j) => {
                                              return (
                                                <span key={j}>
                                                  {j === 0 ? " " : ", "}
                                                  {option}
                                                </span>
                                              );
                                            }
                                          )}
                                          {def !== undefined &&
                                            def.DefaultListValues !==
                                              undefined &&
                                            def.DefaultListValues.length >
                                              0 && (
                                              <span>
                                                &nbsp;(Defaults:
                                                {def.DefaultListValues.map(
                                                  (defaultValue, j) => {
                                                    return (
                                                      <span key={j}>
                                                        {j === 0 ? " " : ", "}
                                                        {defaultValue}
                                                      </span>
                                                    );
                                                  }
                                                )}
                                                )
                                              </span>
                                            )}
                                        </span>
                                      ) : attribute.ListType === "Type" ? (
                                        <span>
                                          <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={(_) => {
                                              this.setState({
                                                redirectTo: `/type/details/${attribute.DefinedType}`,
                                              });
                                            }}
                                          >
                                            <ListItemText
                                              primary={definedType.Name}
                                            />
                                          </Button>
                                          {def !== undefined &&
                                            def.DefaultListValues !==
                                              undefined &&
                                            def.DefaultListValues.length >
                                              0 &&
                                            this.props.things.filter((t) =>
                                              def.DefaultListValues.includes(
                                                t._id
                                              )
                                            ).length > 0 && (
                                              <span>
                                                &nbsp;(Defaults:
                                                {def.DefaultListValues.map(
                                                  (defaultValue, j) => {
                                                    let defaultThing = this.props.things.filter(
                                                      (t) =>
                                                        t._id === defaultValue
                                                    );
                                                    if (
                                                      defaultThing.length ===
                                                      0
                                                    )
                                                      return (
                                                        <span key={j}></span>
                                                      );
                                                    else {
                                                      defaultThing =
                                                        defaultThing[0];
                                                      return (
                                                        <span key={j}>
                                                          {j === 0
                                                            ? " "
                                                            : ", "}
                                                          <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={(_) => {
                                                              this.setState({
                                                                redirectTo: `/thing/details/${defaultValue}`,
                                                              });
                                                            }}
                                                          >
                                                            <ListItemText
                                                              primary={
                                                                defaultThing.Name
                                                              }
                                                            />
                                                          </Button>
                                                        </span>
                                                      );
                                                    }
                                                  }
                                                )}
                                                )
                                              </span>
                                            )}
                                        </span>
                                      ) : (
                                        <span>
                                          {attribute.ListType}
                                          {def !== undefined &&
                                            def.DefaultListValues !==
                                              undefined &&
                                            def.DefaultListValues.length >
                                              0 && (
                                              <span>
                                                &nbsp;(Defaults:
                                                {def.DefaultListValues.map(
                                                  (defaultValue, j) => {
                                                    return (
                                                      <span key={j}>
                                                        {j === 0 ? " " : ", "}
                                                        {defaultValue}
                                                      </span>
                                                    );
                                                  }
                                                )}
                                                )
                                              </span>
                                            )}
                                        </span>
                                      )}
                                    </span>
                                  ) : attribute.AttributeType ===
                                    "True/False" ? (
                                    <span>
                                      {attribute.AttributeType}
                                      {def !== undefined &&
                                      def.DefaultValue !== undefined &&
                                      def.DefaultValue !== ""
                                        ? ` (Default: ${def.DefaultValue})`
                                        : " (Default: False)"}
                                    </span>
                                  ) : (
                                    <span>
                                      {attribute.AttributeType}
                                      {def !== undefined &&
                                        def.DefaultValue !== undefined &&
                                        def.DefaultValue !== "" &&
                                        ` (Default: ${def.DefaultValue})`}
                                    </span>
                                  )}
                                </ListItemText>
                              </ListItem>
                            );
                          }
                        )}
                    </List>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={4} container spacing={0} direction="column">
                  {this.props.selectedType.Supers.length > 0 && (
                    <Grid item>
                      <List>
                        <ListItem>
                          <ListItemText primary={"Super Types"} />
                        </ListItem>
                        {this.props.selectedType.Supers.map((superType, i) => {
                          return (
                            <ListItem key={i}>
                              <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={(_) => {
                                  this.setState({
                                    redirectTo: `/type/details/${superType._id}`,
                                  });
                                }}
                              >
                                <ListItemText primary={superType.Name} />
                              </Button>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Grid>
                  )}
                  {this.props.subTypes.length > 0 && (
                    <Grid item>
                      <List>
                        <ListItem>
                          <ListItemText primary={"Sub Types"} />
                        </ListItem>
                        {this.props.subTypes.map((sub, i) => {
                          return (
                            <ListItem key={i}>
                              <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={(_) => {
                                  this.setState({
                                    redirectTo: `/type/details/${sub._id}`,
                                  });
                                }}
                              >
                                <ListItemText primary={sub.Name} />
                              </Button>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Grid>
                  )}
                  {references.length > 0 && (
                    <Grid item>
                      <List>
                        <ListItem>
                          <ListItemText primary={"Referenced in:"} />
                        </ListItem>
                        {references.map((type, i) => {
                          return (
                            <ListItem key={i}>
                              <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={(_) => {
                                  this.setState({
                                    redirectTo: `/type/details/${type._id}`,
                                  });
                                }}
                              >
                                <ListItemText primary={type.Name} />
                              </Button>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Grid>
                  )}
                  {this.props.instances.length > 0 && (
                    <Grid item>
                      <List>
                        <ListItem>
                          <ListItemText primary={"Instances"} />
                        </ListItem>
                        {this.props.instances.map((thing, i) => {
                          return (
                            <ListItem key={i}>
                              <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={(_) => {
                                  this.setState({
                                    redirectTo: `/thing/details/${thing._id}`,
                                  });
                                }}
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
              <Grid item xs={12}>
                <CommentsControl 
                  user={this.props.user} 
                  allUsers={this.props.allUsers}
                  object={this.props.selectedType}
                  objectType="Type"
                  world={this.props.selectedWorld}
                  api={this.api} 
                  onChange={this.commentsChange}
                  suggestions={suggestions}
                /> 
              </Grid>
              <Modal
                aria-labelledby="delete-type-modal"
                aria-describedby="delete-type-modal-description"
                open={this.state.modalOpen}
                onClose={(e) => {
                  this.setState({ modalOpen: false });
                }}
              >
                <div style={this.getModalStyle()} className="paper">
                  <Grid container spacing={1} direction="column">
                    <Grid item>
                      Are you sure you want to delete{" "}
                      {this.props.selectedType.Name}?
                    </Grid>
                    <Grid item>
                      (All references to it will be left alone and may not work
                      correctly)
                    </Grid>
                    <Grid item container spacing={1} direction="row">
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={this.delete}
                        >
                          Yes
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={(e) => {
                            this.setState({ modalOpen: false });
                          }}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              </Modal>
            </div>
          }
        </Grid>
      );
    }
  }
}

const TypeDetails = connect(mapStateToProps, mapDispatchToProps)(Page);
export default TypeDetails;
