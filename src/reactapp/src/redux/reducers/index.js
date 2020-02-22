import {
  SELECT_PAGE,
  ADD_ARTICLE,
  LOGIN,
  LOG_OUT,
  SET_WORLDS,
  SET_PUBLIC_WORLDS,
  ADD_WORLD,
  UPDATE_WORLD,
  SELECT_WORLD,
  SET_TYPES,
  ADD_TYPE,
  SET_THINGS,
  ADD_THING,
  UPDATE_TYPE,
  UPDATE_ATTRIBUTES_ARR,
  UPDATE_SELECTED_TYPE,
  UPDATE_THING,
  UPDATE_SELECTED_THING,
  LOAD_FROM_STORAGE,
  TOGGLE_MENU
} from "../constants/actionTypes";
// import { sessionService } from "redux-react-session";
// import API from "../../api";

const initialState = {
  selectedPage: "Test",
  articles: [],
  user: null,
  loginError: "",
  worlds: [],
  publicWorlds: [],
  selectedWorld: null,
  selectedWorldID: null,
  types: [],
  things: [],
  selectedType: null,
  attributesArr: [],
  selectedThing: null,
  loadIt: true,
  menuOpen: true
};
// const api = API.getInstance();
function rootReducer(state = initialState, action) {
  if (action.type === LOAD_FROM_STORAGE) {
    // const str = sessionStorage.getItem("selectedWorld");
    // console.log(str);
    const worlds = JSON.parse(sessionStorage.getItem("worlds"));
    const publicWorlds = JSON.parse(sessionStorage.getItem("publicWorlds"));
    const selectedWorld = JSON.parse(sessionStorage.getItem("selectedWorld"));
    const selectedWorldID = sessionStorage.getItem("selectedWorldID");
    const types = JSON.parse(sessionStorage.getItem("types"));
    const things = JSON.parse(sessionStorage.getItem("things"));
    return Object.assign({}, state, {
      worlds: worlds === null ? [] : worlds,
      publicWorlds: publicWorlds === null ? [] : publicWorlds,
      selectedWorld,
      selectedWorldID,
      types: types === null ? [] : types,
      things: things === null ? [] : things
    });
  } else if (action.type === SELECT_PAGE) {
    return Object.assign({}, state, {
      selectedPage: action.payload
    });
  } else if (action.type === ADD_ARTICLE) {
    return Object.assign({}, state, {
      articles: state.articles.concat(action.payload)
    });
  } else if (action.type === LOGIN) {
    // I found that it worked better to do this api call in the page.
    // I think the things I'm reading are saying the same as well.
    // const user = action.payload;
    // api.login(user).then(response => {
    //   // console.log(response);
    //   if (response.user === null) {
    //     return Object.assign({}, state, {
    //       loginError: response.message
    //     });
    //   }
    //   else {
    //     return Object.assign({}, state, {
    //       user: response.user
    //     });
    //     // const { token } = response.user;
    //     // sessionService.saveSession({ token })
    //     // .then(() => {
    //     //   sessionService.saveUser(response.user)
    //     //   .then(() => {
    //     //     return Object.assign({}, state, {
    //     //       selectedPage: "/"
    //     //     });
    //     //   }).catch(err => console.error(err));
    //     // }).catch(err => console.error(err));
    //   }
    // });
    // const token = {};
    // sessionService.saveSession({ token })
    // .then(() => {
    //   sessionService.saveUser(action.payload)
    //   .then(() => {
    //     return Object.assign({}, state, {
    //       user: action.payload
    //     });
    //     // return Object.assign({}, state, {
    //     //   selectedPage: "/"
    //     // });
    //   }).catch(err => console.error(err));
    // }).catch(err => console.error(err));
    return Object.assign({}, state, {
      user: action.payload
    });
  } else if (action.type === LOG_OUT) {
    // api.logout()
    //   .then(() => {
    //     sessionService.deleteSession();
    //     sessionService.deleteUser();
    //     // return Object.assign({}, state, {
    //     //   selectedPage: "login"
    //     // });
    //   })
    //   .catch(err => {
    //     throw err;
    //   });
  } else if (action.type === SET_WORLDS) {
    // console.log(action.payload);
    if (action.payload.message === undefined){
      sessionStorage.setItem("worlds", JSON.stringify(action.payload));
      if (state.selectedWorldID !== null && state.selectedWorld === null) {
        const worldArr = action.payload.filter(
          world => world._id === state.selectedWorldID
        );
        if (worldArr.length > 0) {
          let world = worldArr[0];

          // sessionService.saveSession({ worlds: action.payload, selectedWorld: world })
          // .then(() => {}).catch(err => console.error(err));
          sessionStorage.setItem("selectedWorld", JSON.stringify(world));
          return Object.assign({}, state, {
            worlds: action.payload,
            selectedWorld: world
          });
        } else {
          // sessionService.saveSession({ worlds: action.payload })
          // .then(() => {}).catch(err => console.error(err));
          return Object.assign({}, state, {
            worlds: action.payload
          });
        }
      } else {
        // sessionService.saveSession({ worlds: action.payload })
        // .then(() => {}).catch(err => console.error(err));
        return Object.assign({}, state, {
          worlds: action.payload
        });
      }
    }
    else {
      return Object.assign({}, state, {});
    }
  } else if (action.type === SET_PUBLIC_WORLDS) {
    // console.log(action.payload);
    if (action.payload.message === undefined){
      sessionStorage.setItem("publicWorlds", JSON.stringify(action.payload));
      if (state.selectedWorldID !== null && state.selectedWorld === null) {
        const worldArr = action.payload.filter(
          world => world._id === state.selectedWorldID
        );
        if (worldArr.length > 0) {
          let world = worldArr[0];
          // sessionService.saveSession({ publicWorlds: action.payload, selectedWorld: world })
          // .then(() => {}).catch(err => console.error(err));
          sessionStorage.setItem("selectedWorld", JSON.stringify(world));
          return Object.assign({}, state, {
            publicWorlds: action.payload,
            selectedWorld: world
          });
        } else {
          // sessionService.saveSession({ publicWorlds: action.payload })
          // .then(() => {}).catch(err => console.error(err));
          return Object.assign({}, state, {
            publicWorlds: action.payload
          });
        }
      } else {
        return Object.assign({}, state, {
          publicWorlds: action.payload
        });
      }
    }
    else {
      return Object.assign({}, state, {});
    }
  } else if (action.type === ADD_WORLD) {
    if (action.payload.Public) {
      const worlds = state.worlds.concat(action.payload);
      const publicWorlds = state.publicWorlds.concat(action.payload);
      sessionStorage.setItem("worlds", JSON.stringify(worlds));
      sessionStorage.setItem("publicWorlds", JSON.stringify(publicWorlds));
      return Object.assign({}, state, {
        worlds,
        publicWorlds
      });
    } else {
      const worlds = state.worlds.concat(action.payload);
      sessionStorage.setItem("worlds", JSON.stringify(worlds));
      return Object.assign({}, state, {
        worlds: state.worlds.concat(action.payload)
      });
    }
  } else if (action.type === UPDATE_WORLD) {
    const worlds = [...state.worlds];
    let publicWorlds = [...state.publicWorlds];
    const world = worlds.filter(t => t._id === action.payload._id)[0];
    world.Name = action.payload.Name;
    const wasPublic = world.Public;
    world.Public = action.payload.Public;
    sessionStorage.setItem("worlds", JSON.stringify(worlds));
    if (world.Public) {
      if (wasPublic) {
        // It was already public so we just need to update the name
        const publicWorld = publicWorlds.filter(t => t._id === world._id)[0];
        publicWorld.Name = world.Name;
      }
      else {
        // It's been changed to public, so we need to add it
        publicWorlds = publicWorlds.concat(world);
      }
      sessionStorage.setItem("publicWorlds", JSON.stringify(publicWorlds));
      return Object.assign({}, state, {
        worlds,
        publicWorlds
      });
    } else {
      if (wasPublic) {
        // It used to be public, so we need to remove it
        publicWorlds = publicWorlds.filter(t => t._id !== world._id);
        sessionStorage.setItem("publicWorlds", JSON.stringify(publicWorlds));
        return Object.assign({}, state, {
          worlds,
          publicWorlds
        });
      }
      else {
        // It's still not public, so we can leave it
        return Object.assign({}, state, {
          worlds
        });
      }
    }
  } else if (action.type === SELECT_WORLD) {
    // // console.log(action.payload);
    // // console.log(state);
    let world = state.worlds.filter(world => world._id === action.payload);
    // // console.log(world);
    if (world.length === 0)
      world = state.publicWorlds.filter(world => world._id === action.payload);
    // // console.log(world);
    if (world.length > 0) {
      // sessionService.saveSession({
      //   selectedWorldID: action.payload, selectedWorld: world[0]
      // })
      // .then(() => {}).catch(err => console.error(err));
      sessionStorage.setItem("selectedWorldID", action.payload);
      sessionStorage.setItem("selectedWorld", JSON.stringify(world[0]));
      return Object.assign({}, state, {
        selectedWorldID: action.payload,
        selectedWorld: world[0]
      });
    } else {
      // sessionService.saveSession({
      //   selectedWorldID: action.payload, selectedWorld: null
      // })
      // .then(() => {}).catch(err => console.error(err));
      sessionStorage.setItem("selectedWorldID", action.payload);
      sessionStorage.removeItem("selectedWorld");
      return Object.assign({}, state, {
        selectedWorldID: action.payload,
        selectedWorld: null
      });
    }
  } else if (action.type === SET_TYPES) {
    // // console.log(action.payload);
    // sessionService.saveSession({
    //   types: action.payload
    // })
    // .then(() => {}).catch(err => console.error(err));
    sessionStorage.setItem("types", JSON.stringify(action.payload));
    return Object.assign({}, state, {
      types: action.payload
    });
  } else if (action.type === ADD_TYPE) {
    // sessionService.saveSession({
    //   types: state.types.concat(action.payload)
    // })
    // .then(() => {}).catch(err => console.error(err));
    const types = state.types.concat(action.payload);
    sessionStorage.setItem("types", JSON.stringify(types));
    return Object.assign({}, state, {
      types
    });
  } else if (action.type === SET_THINGS) {
    // sessionService.saveSession({
    //   things: action.payload
    // })
    // .then(() => {}).catch(err => console.error(err));
    sessionStorage.setItem("things", JSON.stringify(action.payload));
    return Object.assign({}, state, {
      things: action.payload
    });
  } else if (action.type === ADD_THING) {
    // sessionService.saveSession({
    //   things: state.things.concat(action.payload)
    // })
    // .then(() => {}).catch(err => console.error(err));
    const things = state.things.concat(action.payload);
    sessionStorage.setItem("things", JSON.stringify(things));
    return Object.assign({}, state, {
      things
    });
  } else if (action.type === UPDATE_SELECTED_TYPE) {
    // This is because Redux won't cause a rerender
    // on changes to arrays.
    const changedType = { ...action.payload, changedAt: Date.now() };
    // // console.log(changedType);
    return Object.assign({}, state, {
      selectedType: changedType
    });
  } else if (action.type === UPDATE_TYPE) {
    const types = [...state.types];
    const type = types.filter(t => t._id === action.payload._id)[0];
    type.Name = action.payload.Name;
    type.Description = action.payload.Description;
    type.Supers = action.payload.Supers;
    type.Attributes = action.payload.Attributes;
    // sessionService.saveSession({
    //   types: types
    // })
    // .then(() => {}).catch(err => console.error(err));
    sessionStorage.setItem("types", JSON.stringify(types));
    return Object.assign({}, state, {
      types: types
    });
  } else if (action.type === UPDATE_ATTRIBUTES_ARR) {
    // // console.log(action.payload);
    return Object.assign({}, state, {
      attributesArr: action.payload
    });
  } else if (action.type === UPDATE_SELECTED_THING) {
    // This is because Redux won't cause a rerender
    // on changes to arrays.
    const changedThing = { ...action.payload, changedAt: Date.now() };
    // // console.log(changedThing);
    return Object.assign({}, state, {
      selectedThing: changedThing
    });
  } else if (action.type === UPDATE_THING) {
    const things = [...state.things];
    const thing = things.filter(t => t._id === action.payload._id)[0];
    thing.Name = action.payload.Name;
    thing.Description = action.payload.Description;
    thing.Types = action.payload.Types;
    thing.Attributes = action.payload.Attributes;
    // sessionService.saveSession({
    //   things: things
    // })
    // .then(() => {}).catch(err => console.error(err));
    sessionStorage.setItem("things", JSON.stringify(things));
    return Object.assign({}, state, {
      things: things
    });
  } else if (action.type === TOGGLE_MENU) {
    return Object.assign({}, state, {
      menuOpen: !state.menuOpen
    });
  }
  return state;
}
export default rootReducer;

export const login = (user, history) => {};

export const logout = history => {};
