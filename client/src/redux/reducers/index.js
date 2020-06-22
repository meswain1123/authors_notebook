import {
  UPDATE_INDEX_EXPANDED_PANEL,
  SET_API,
  ADD_ARTICLE,
  LOGIN,
  LOGOUT,
  REDIRECT_TO,
  SET_WORLDS,
  SET_PUBLIC_WORLDS,
  SET_TEMPLATES,
  SET_ALL_USERS,
  ADD_WORLD,
  ADD_AND_SELECT_WORLD,
  UPDATE_WORLD,
  UPDATE_PUBLIC_WORLD_COLLAB,
  SELECT_WORLD,
  SET_TYPES,
  ADD_TYPE,
  SET_THINGS,
  ADD_THING,
  UPDATE_TYPE,
  // UPDATE_ATTRIBUTES_ARR,
  SET_ATTRIBUTES,
  ADD_ATTRIBUTES,
  UPDATE_ATTRIBUTES,
  UPDATE_SELECTED_TYPE,
  UPDATE_THING,
  UPDATE_SELECTED_THING,
  LOAD_FROM_STORAGE,
  TOGGLE_MENU,
  TOGGLE_LOGIN,
  NOT_FROM_LOGIN,
  SET_FOLLOWING_WORLDS,
  SET_WIDTH
} from "../constants/actionTypes";

const initialState = {
  indexExpandedPanel: false,
  api: null,
  articles: [],
  user: null,
  redirectToURL: null,
  loginError: "",
  worlds: [],
  publicWorlds: [],
  followingWorlds: [],
  selectedWorld: null,
  selectedWorldID: null,
  types: [],
  things: [],
  selectedType: null,
  // attributesArr: [],
  // attributes: [],
  attributesByID: {},
  attributesByName: {},
  selectedThing: null,
  loadIt: true,
  menuOpen: true,
  loginOpen: false,
  fromLogin: false,
  width: 0,
  templates: [],
  allUsers: [],
  userSuggestions: [],
  collabSuggestions: [],
  worldSuggestions: [],
  typeSuggestions: [],
  thingSuggestions: []
};
function rootReducer(state = initialState, action) {
  if (action.type === UPDATE_INDEX_EXPANDED_PANEL) {
    return Object.assign({}, state, {
      indexExpandedPanel: action.payload
    });
  } else if (action.type === LOAD_FROM_STORAGE) {
    let user = JSON.parse(sessionStorage.getItem("user"));
    if (user !== undefined && user !== null && user.body !== undefined && user.body.user !== undefined)
      user = user.body.user;
    else 
      user = null;
    // const worlds = JSON.parse(sessionStorage.getItem("worlds"));
    // const publicWorlds = JSON.parse(sessionStorage.getItem("publicWorlds"));
    const selectedWorld = JSON.parse(sessionStorage.getItem("selectedWorld"));
    const selectedWorldID = sessionStorage.getItem("selectedWorldID");
    const types = JSON.parse(sessionStorage.getItem("types"));
    const things = JSON.parse(sessionStorage.getItem("things"));
    const followingWorlds = JSON.parse(sessionStorage.getItem("followingWorlds"));
    // const attributes = JSON.parse(sessionStorage.getItem("attributes"));
    const attributesByID = JSON.parse(sessionStorage.getItem("attributesByID"));
    const attributesByName = JSON.parse(sessionStorage.getItem("attributesByName"));
    const worldSuggestions = JSON.parse(sessionStorage.getItem("worldSuggestions"));
    const userSuggestions = JSON.parse(sessionStorage.getItem("userSuggestions"));
    const collabSuggestions = JSON.parse(sessionStorage.getItem("collabSuggestions"));
    const typeSuggestions = JSON.parse(sessionStorage.getItem("typeSuggestions"));
    const thingSuggestions = JSON.parse(sessionStorage.getItem("thingSuggestions"));
    
    return Object.assign({}, state, {
      user: user,
      // worlds: worlds === null ? [] : worlds,
      // publicWorlds: publicWorlds === null ? [] : publicWorlds,
      selectedWorld,
      selectedWorldID,
      types: types === null ? [] : types,
      things: things === null ? [] : things,
      followingWorlds: followingWorlds === null ? [] : followingWorlds,
      // attributes: attributes === null ? [] : attributes,
      attributesByID: attributesByID === null ? {} : attributesByID,
      attributesByName: attributesByName === null ? {} : attributesByName,
      worldSuggestions: worldSuggestions === null ? [] : worldSuggestions,
      userSuggestions: userSuggestions === null ? [] : userSuggestions,
      collabSuggestions: collabSuggestions === null ? [] : collabSuggestions,
      typeSuggestions: typeSuggestions === null ? [] : typeSuggestions,
      thingSuggestions: thingSuggestions === null ? [] : thingSuggestions
    });
  } else if (action.type === SET_API) {
    return Object.assign({}, state, {
      api: action.payload
    });
  } else if (action.type === ADD_ARTICLE) {
    return Object.assign({}, state, {
      articles: state.articles.concat(action.payload)
    });
  } else if (action.type === LOGIN) {
    // sessionStorage.setItem("user", JSON.stringify(action.payload));
    sessionStorage.setItem("followingWorlds", JSON.stringify(action.payload.followingWorlds));
    return Object.assign({}, state, {
      user: action.payload, 
      followingWorlds: action.payload.followingWorlds
    });
  } else if (action.type === LOGOUT) {
    // sessionStorage.removeItem("user");
    return Object.assign({}, state, {
      user: null
    });
  } else if (action.type === REDIRECT_TO) {
    return Object.assign({}, state, {
      redirectToURL: action.payload
    });
  } else if (action.type === SET_WORLDS) {
    if (action.payload !== undefined && action.payload.error === undefined){
      // sessionStorage.setItem("worlds", JSON.stringify(action.payload));
      if (state.selectedWorldID !== null && state.selectedWorld === null) {
        const worldArr = action.payload.filter(
          world => world._id === state.selectedWorldID
        );
        if (worldArr.length > 0) {
          let world = worldArr[0];
          sessionStorage.setItem("selectedWorld", JSON.stringify(world));
          return Object.assign({}, state, {
            worlds: action.payload,
            selectedWorld: world,
            // attributes: [],
            // attributesByID: {},
            // attributesByName: {}
          });
        } else {
          return Object.assign({}, state, {
            worlds: action.payload,
            // attributes: [],
            // attributesByID: {},
            // attributesByName: {}
          });
        }
      } else {
        return Object.assign({}, state, {
          worlds: action.payload,
          // attributes: [],
          // attributesByID: {},
          // attributesByName: {}
        });
      }
    }
    else {
      return Object.assign({}, state, {});
    }
  } else if (action.type === SET_PUBLIC_WORLDS) {
    if (action.payload.error === undefined) {
      // sessionStorage.setItem("publicWorlds", JSON.stringify(action.payload));
      const worldSuggestions = [];
      action.payload.forEach(w => {
        // worldSuggestions.push(`${w.Name}-${w._id}`);
        worldSuggestions.push({
          _id: w._id,
          suggestionType: "world",
          Display: `${w.Name}`
        });
      });
      sessionStorage.setItem("worldSuggestions", JSON.stringify(worldSuggestions));
      if (state.selectedWorldID !== null && state.selectedWorld === null) {
        const worldArr = action.payload.filter(
          world => world._id === state.selectedWorldID
        );
        if (worldArr.length > 0) {
          let world = worldArr[0];
          sessionStorage.setItem("selectedWorld", JSON.stringify(world));
          
          return Object.assign({}, state, {
            publicWorlds: action.payload,
            selectedWorld: world,
            worldSuggestions
            // attributes: [],
            // attributesByID: {},
            // attributesByName: {}
          });
        } else {
          return Object.assign({}, state, {
            publicWorlds: action.payload,
            worldSuggestions
          });
        }
      } else {
        return Object.assign({}, state, {
          publicWorlds: action.payload,
          worldSuggestions
        });
      }
    }
    else {
      return Object.assign({}, state, {});
    }
  } else if (action.type === SET_TEMPLATES) {
    return Object.assign({}, state, {
      templates: action.payload
    });
  } else if (action.type === SET_ALL_USERS) {
    const userSuggestions = [];
    action.payload.forEach(u => {
      // userSuggestions.push(`${u.username}-${u._id}`);
      userSuggestions.push({
        _id: u._id,
        suggestionType: "user",
        Display: `${u.username}`
      });
    });
    sessionStorage.setItem("userSuggestions", JSON.stringify(userSuggestions));
    if (state.selectedWorld !== null){
      const collabSuggestions = [];
      action.payload.forEach(u => {
        if (state.selectedWorld.Owner === u._id || (state.selectedWorld.Collaborators !== undefined && state.selectedWorld.Collaborators !== null && state.selectedWorld.Collaborators.filter(c => c.userID === u._id).length > 0)) {
          // collabSuggestions.push(`${u.username}-${u._id}`);
          collabSuggestions.push({
            _id: u._id,
            suggestionType: "user",
            Display: `${u.username}`
          });
        }
      });
      sessionStorage.setItem("collabSuggestions", JSON.stringify(collabSuggestions));
      return Object.assign({}, state, {
        allUsers: action.payload,
        userSuggestions,
        collabSuggestions
      });
    } else {
      return Object.assign({}, state, {
        allUsers: action.payload,
        userSuggestions
      });
    }
  } else if (action.type === ADD_WORLD) {
    if (action.payload.Public) {
      const worlds = state.worlds.concat(action.payload);
      const publicWorlds = state.publicWorlds.concat(action.payload);
      // sessionStorage.setItem("worlds", JSON.stringify(worlds));
      // sessionStorage.setItem("publicWorlds", JSON.stringify(publicWorlds));
      return Object.assign({}, state, {
        worlds,
        publicWorlds
      });
    } else {
      // const worlds = state.worlds.concat(action.payload);
      // sessionStorage.setItem("worlds", JSON.stringify(worlds));
      return Object.assign({}, state, {
        worlds: state.worlds.concat(action.payload)
      });
    }
  } else if (action.type === ADD_AND_SELECT_WORLD) {
    if (action.payload.Public) {
      const worlds = state.worlds.concat(action.payload);
      const publicWorlds = state.publicWorlds.concat(action.payload);
      
      const world = action.payload;
      sessionStorage.setItem("selectedWorldID", action.payload._id);
      sessionStorage.setItem("selectedWorld", JSON.stringify(world));
      if (state.allUsers.length > 0) {
        const collabSuggestions = [];
        state.allUsers.forEach(u => {
          if (world.Owner === u._id) {
            // collabSuggestions.push(`${u.username}-${u._id}`);
            collabSuggestions.push({
              _id: u._id,
              suggestionType: "user",
              Display: `${u.username}`
            });
          }
        });
        sessionStorage.setItem("collabSuggestions", JSON.stringify(collabSuggestions));
        return Object.assign({}, state, {
          selectedWorldID: action.payload,
          selectedWorld: world,
          // attributes: [],
          attributesByID: {},
          attributesByName: {},
          collabSuggestions,
          worlds,
          publicWorlds
        });
      } else {
        return Object.assign({}, state, {
          selectedWorldID: action.payload,
          selectedWorld: world,
          // attributes: [],
          attributesByID: {},
          attributesByName: {},
          worlds,
          publicWorlds
        });
      }
    } else {
      const world = action.payload;
      sessionStorage.setItem("selectedWorldID", action.payload._id);
      sessionStorage.setItem("selectedWorld", JSON.stringify(world));
      if (state.allUsers.length > 0) {
        const collabSuggestions = [];
        state.allUsers.forEach(u => {
          if (world.Owner === u._id) {
            // collabSuggestions.push(`${u.username}-${u._id}`);
            collabSuggestions.push({
              _id: u._id,
              suggestionType: "user",
              Display: `${u.username}`
            });
          }
        });
        sessionStorage.setItem("collabSuggestions", JSON.stringify(collabSuggestions));
        return Object.assign({}, state, {
          selectedWorldID: action.payload,
          selectedWorld: world,
          // attributes: [],
          attributesByID: {},
          attributesByName: {},
          collabSuggestions,
          worlds: state.worlds.concat(action.payload)
        });
      } else {
        return Object.assign({}, state, {
          selectedWorldID: action.payload,
          selectedWorld: world,
          // attributes: [],
          attributesByID: {},
          attributesByName: {},
          worlds: state.worlds.concat(action.payload)
        });
      }
    }
  } else if (action.type === UPDATE_WORLD) {
    const worlds = [...state.worlds];
    let publicWorlds = [...state.publicWorlds];
    const world = worlds.filter(t => t._id === action.payload._id)[0];
    world.Name = action.payload.Name;
    world.Description = action.payload.Description;
    const wasPublic = world.Public;
    world.Public = action.payload.Public;
    world.AcceptingCollaborators = action.payload.AcceptingCollaborators;
    world.Collaborators = action.payload.Collaborators;
    // sessionStorage.setItem("worlds", JSON.stringify(worlds));
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
      // sessionStorage.setItem("publicWorlds", JSON.stringify(publicWorlds));
      return Object.assign({}, state, {
        worlds,
        publicWorlds
      });
    } else {
      if (wasPublic) {
        // It used to be public, so we need to remove it
        publicWorlds = publicWorlds.filter(t => t._id !== world._id);
        // sessionStorage.setItem("publicWorlds", JSON.stringify(publicWorlds));
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
  } else if (action.type === UPDATE_PUBLIC_WORLD_COLLAB) {
    let publicWorlds = [...state.publicWorlds];
    const world = publicWorlds.filter(t => t._id === action.payload._id)[0];
    world.Collaborators = action.payload.Collaborators;
    // sessionStorage.setItem("publicWorlds", JSON.stringify(publicWorlds));
    return Object.assign({}, state, {
      publicWorlds
    });
  } else if (action.type === SELECT_WORLD) {
    let world = state.worlds.filter(world => world._id === action.payload);
    if (world.length === 0)
      world = state.publicWorlds.filter(world => world._id === action.payload);
    if (world.length > 0) {
      world = world[0];
      sessionStorage.setItem("selectedWorldID", action.payload);
      sessionStorage.setItem("selectedWorld", JSON.stringify(world));
      if (state.allUsers.length > 0) {
        const collabSuggestions = [];
        state.allUsers.forEach(u => {
          if (world.Owner === u._id || (world.Collaborators !== undefined && world.Collaborators !== null && world.Collaborators.filter(c => c.userID === u._id).length > 0)) {
            // collabSuggestions.push(`${u.username}-${u._id}`);
            collabSuggestions.push({
              _id: u._id,
              suggestionType: "user",
              Display: `${u.username}`
            });
          }
        });
        sessionStorage.setItem("collabSuggestions", JSON.stringify(collabSuggestions));
        return Object.assign({}, state, {
          selectedWorldID: action.payload,
          selectedWorld: world,
          // attributes: [],
          attributesByID: {},
          attributesByName: {},
          collabSuggestions
        });
      } else {
        return Object.assign({}, state, {
          selectedWorldID: action.payload,
          selectedWorld: world,
          // attributes: [],
          attributesByID: {},
          attributesByName: {}
        });
      }
    } else {
      sessionStorage.setItem("selectedWorldID", action.payload);
      sessionStorage.removeItem("selectedWorld");
      sessionStorage.removeItem("collabSuggestions");
      return Object.assign({}, state, {
        selectedWorldID: action.payload,
        selectedWorld: null,
        // attributes: [],
        attributesByID: {},
        attributesByName: {},
        collabSuggestions: []
      });
    }
  } else if (action.type === SET_ATTRIBUTES) {
    const attributesByID = {};
    const attributesByName = {};
    action.payload.forEach(attribute => {
      attributesByID[attribute._id] = attribute;
      attributesByName[attribute.Name] = attribute;
    });
    
    // sessionStorage.setItem("attributes", JSON.stringify(action.payload));
    sessionStorage.setItem("attributesByID", JSON.stringify(attributesByID));
    sessionStorage.setItem("attributesByName", JSON.stringify(attributesByName));

    return Object.assign({}, state, {
      // attributes: action.payload,
      attributesByID: attributesByID,
      attributesByName: attributesByName
    });
  } else if (action.type === UPDATE_ATTRIBUTES) {
    const attributesByID = state.attributesByID;
    const attributesByName = state.attributesByName;
    action.payload.forEach(attribute => {
      attributesByID[attribute._id] = attribute;
      attributesByName[attribute.Name] = attribute;
    });
    
    // sessionStorage.setItem("attributes", JSON.stringify(action.payload));
    sessionStorage.setItem("attributesByID", JSON.stringify(attributesByID));
    sessionStorage.setItem("attributesByName", JSON.stringify(attributesByName));

    return Object.assign({}, state, {
      // attributes: action.payload,
      attributesByID: attributesByID,
      attributesByName: attributesByName
    });
  } else if (action.type === ADD_ATTRIBUTES) {
    // const attributes = state.attributes.concat(action.payload);
    const attributesByID = state.attributesByID;
    const attributesByName = state.attributesByName;
    action.payload.forEach(attribute => {
      attributesByID[attribute._id] = attribute;
      attributesByName[attribute.Name] = attribute;
    });
    
    // sessionStorage.setItem("attributes", JSON.stringify(attributes));
    sessionStorage.setItem("attributesByID", JSON.stringify(attributesByID));
    sessionStorage.setItem("attributesByName", JSON.stringify(attributesByName));
    
    return Object.assign({}, state, {
      // attributes: attributes,
      attributesByID: attributesByID,
      attributesByName: attributesByName
    });
  } else if (action.type === SET_TYPES) {
    sessionStorage.setItem("types", JSON.stringify(action.payload));
    const typeSuggestions = [];
    action.payload.forEach(t => {
      // typeSuggestions.push(`${t.Name}-${t._id}`);
      typeSuggestions.push({
        _id: t._id,
        suggestionType: "type",
        Display: `${t.Name}`
      });
    });
    sessionStorage.setItem("typeSuggestions", JSON.stringify(typeSuggestions));
    return Object.assign({}, state, {
      types: action.payload,
      typeSuggestions
    });
  } else if (action.type === ADD_TYPE) {
    const types = state.types.concat(action.payload);
    sessionStorage.setItem("types", JSON.stringify(types));
    const typeSuggestions = [];
    types.forEach(t => {
      // typeSuggestions.push(`${t.Name}-${t._id}`);
      typeSuggestions.push({
        _id: t._id,
        suggestionType: "type",
        Display: `${t.Name}`
      });
    });
    sessionStorage.setItem("typeSuggestions", JSON.stringify(typeSuggestions));
    return Object.assign({}, state, {
      types,
      typeSuggestions
    });
  } else if (action.type === SET_THINGS) {
    sessionStorage.setItem("things", JSON.stringify(action.payload));
    
    const thingSuggestions = [];
    action.payload.forEach(t => {
      // thingSuggestions.push(`${t.Name}-${t._id}`);
      thingSuggestions.push({
        _id: t._id,
        suggestionType: "thing",
        Display: `${t.Name}`
      });
      t.Types.forEach(t2 => {
        // thingSuggestions.push(`${t2.Name}-${t.Name}-${t._id}`);
        thingSuggestions.push({
          _id: t._id,
          suggestionType: "thing",
          Display: `${t2.Name}-${t.Name}`
        });
      });
    });
    sessionStorage.setItem("thingSuggestions", JSON.stringify(thingSuggestions));
    return Object.assign({}, state, {
      things: action.payload, 
      thingSuggestions
    });
  } else if (action.type === ADD_THING) {
    const things = state.things.concat(action.payload);
    sessionStorage.setItem("things", JSON.stringify(things));
    const thingSuggestions = [];
    things.forEach(t => {
      // thingSuggestions.push(`${t.Name}-${t._id}`);
      thingSuggestions.push({
        _id: t._id,
        suggestionType: "thing",
        Display: `${t.Name}`
      });
      t.Types.forEach(t2 => {
        // thingSuggestions.push(`${t2.Name}-${t.Name}-${t._id}`);
        thingSuggestions.push({
          _id: t._id,
          suggestionType: "thing",
          Display: `${t2.Name}-${t.Name}`
        });
      });
    });
    sessionStorage.setItem("thingSuggestions", JSON.stringify(thingSuggestions));
    
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
    type.AttributesArr = action.payload.AttributesArr;
    type.Attributes = action.payload.Attributes;
    sessionStorage.setItem("types", JSON.stringify(types));
    return Object.assign({}, state, {
      types: types
    });
  // } else if (action.type === UPDATE_ATTRIBUTES_ARR) {
  //   return Object.assign({}, state, {
  //     attributesArr: action.payload
  //   });
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
  } else if (action.type === TOGGLE_LOGIN) {
    return Object.assign({}, state, {
      fromLogin: state.loginOpen,
      loginOpen: !state.loginOpen
    });
  } else if (action.type === NOT_FROM_LOGIN) {
    return Object.assign({}, state, {
      fromLogin: false
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
