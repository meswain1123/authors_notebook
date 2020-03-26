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
  TOGGLE_MENU,
  SET_FOLLOWING_WORLDS,
  SET_WIDTH
} from "../constants/actionTypes";

const initialState = {
  selectedPage: "Test",
  articles: [],
  user: null,
  loginError: "",
  worlds: [],
  publicWorlds: [],
  followingWorlds: [],
  selectedWorld: null,
  selectedWorldID: null,
  types: [],
  things: [],
  selectedType: null,
  attributesArr: [],
  selectedThing: null,
  loadIt: true,
  menuOpen: true,
  width: 0
};
function rootReducer(state = initialState, action) {
  if (action.type === LOAD_FROM_STORAGE) {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const worlds = JSON.parse(sessionStorage.getItem("worlds"));
    const publicWorlds = JSON.parse(sessionStorage.getItem("publicWorlds"));
    const selectedWorld = JSON.parse(sessionStorage.getItem("selectedWorld"));
    const selectedWorldID = sessionStorage.getItem("selectedWorldID");
    const types = JSON.parse(sessionStorage.getItem("types"));
    const things = JSON.parse(sessionStorage.getItem("things"));
    const followingWorlds = JSON.parse(sessionStorage.getItem("followingWorlds"));
    
    return Object.assign({}, state, {
      user: user,
      worlds: worlds === null ? [] : worlds,
      publicWorlds: publicWorlds === null ? [] : publicWorlds,
      selectedWorld,
      selectedWorldID,
      types: types === null ? [] : types,
      things: things === null ? [] : things,
      followingWorlds: followingWorlds === null ? [] : followingWorlds
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
    sessionStorage.setItem("user", JSON.stringify(action.payload));
    sessionStorage.setItem("followingWorlds", JSON.stringify(action.payload.followingWorlds));
    return Object.assign({}, state, {
      user: action.payload, 
      followingWorlds: action.payload.followingWorlds
    });
  } else if (action.type === LOG_OUT) {
    sessionStorage.removeItem("user");
    return Object.assign({}, state, {
      user: null
    });
  } else if (action.type === SET_WORLDS) {
    if (action.payload.error === undefined){
      sessionStorage.setItem("worlds", JSON.stringify(action.payload));
      if (state.selectedWorldID !== null && state.selectedWorld === null) {
        const worldArr = action.payload.filter(
          world => world._id === state.selectedWorldID
        );
        if (worldArr.length > 0) {
          let world = worldArr[0];
          sessionStorage.setItem("selectedWorld", JSON.stringify(world));
          return Object.assign({}, state, {
            worlds: action.payload,
            selectedWorld: world
          });
        } else {
          return Object.assign({}, state, {
            worlds: action.payload
          });
        }
      } else {
        return Object.assign({}, state, {
          worlds: action.payload
        });
      }
    }
    else {
      return Object.assign({}, state, {});
    }
  } else if (action.type === SET_PUBLIC_WORLDS) {
    if (action.payload.error === undefined){
      sessionStorage.setItem("publicWorlds", JSON.stringify(action.payload));
      if (state.selectedWorldID !== null && state.selectedWorld === null) {
        const worldArr = action.payload.filter(
          world => world._id === state.selectedWorldID
        );
        if (worldArr.length > 0) {
          let world = worldArr[0];
          sessionStorage.setItem("selectedWorld", JSON.stringify(world));
          return Object.assign({}, state, {
            publicWorlds: action.payload,
            selectedWorld: world
          });
        } else {
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
    let world = state.worlds.filter(world => world._id === action.payload);
    if (world.length === 0)
      world = state.publicWorlds.filter(world => world._id === action.payload);
    if (world.length > 0) {
      sessionStorage.setItem("selectedWorldID", action.payload);
      sessionStorage.setItem("selectedWorld", JSON.stringify(world[0]));
      return Object.assign({}, state, {
        selectedWorldID: action.payload,
        selectedWorld: world[0]
      });
    } else {
      sessionStorage.setItem("selectedWorldID", action.payload);
      sessionStorage.removeItem("selectedWorld");
      return Object.assign({}, state, {
        selectedWorldID: action.payload,
        selectedWorld: null
      });
    }
  } else if (action.type === SET_TYPES) {
    sessionStorage.setItem("types", JSON.stringify(action.payload));
    return Object.assign({}, state, {
      types: action.payload
    });
  } else if (action.type === ADD_TYPE) {
    const types = state.types.concat(action.payload);
    sessionStorage.setItem("types", JSON.stringify(types));
    return Object.assign({}, state, {
      types: types
    });
  } else if (action.type === SET_THINGS) {
    sessionStorage.setItem("things", JSON.stringify(action.payload));
    return Object.assign({}, state, {
      things: action.payload
    });
  } else if (action.type === ADD_THING) {
    const things = state.things.concat(action.payload);
    sessionStorage.setItem("things", JSON.stringify(things));
    return Object.assign({}, state, {
      things: things
    });
  } else if (action.type === UPDATE_SELECTED_TYPE) {
    // This is because Redux won't cause a rerender
    // on changes to arrays.
    const changedType = { ...action.payload, changedAt: Date.now() };
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
    sessionStorage.setItem("types", JSON.stringify(types));
    return Object.assign({}, state, {
      types: types
    });
  } else if (action.type === UPDATE_ATTRIBUTES_ARR) {
    return Object.assign({}, state, {
      attributesArr: action.payload
    });
  } else if (action.type === UPDATE_SELECTED_THING) {
    // This is because Redux won't cause a rerender
    // on changes to arrays.
    const changedThing = { ...action.payload, changedAt: Date.now() };
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
    sessionStorage.setItem("things", JSON.stringify(things));
    return Object.assign({}, state, {
      things: things
    });
  } else if (action.type === TOGGLE_MENU) {
    return Object.assign({}, state, {
      menuOpen: !state.menuOpen
    });
  } else if (action.type === SET_WIDTH) {
    return Object.assign({}, state, {
      width: action.payload
    });
  } else if (action.type === SET_FOLLOWING_WORLDS) {
    sessionStorage.setItem("followingWorlds", JSON.stringify(action.payload));
    return Object.assign({}, state, {
      followingWorlds: action.payload
    });
  }
  return state;
}

export default rootReducer;

export const login = (user, history) => {};

export const logout = history => {};
