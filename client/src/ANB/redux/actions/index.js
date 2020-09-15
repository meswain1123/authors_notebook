import {
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
  SET_ATTRIBUTES,
  ADD_ATTRIBUTES,
  UPDATE_ATTRIBUTES,
  SET_TYPES,
  ADD_TYPE,
  SET_THINGS,
  ADD_THING,
  UPDATE_TYPE,
  UPDATE_SELECTED_TYPE,
  UPDATE_THING,
  UPDATE_SELECTED_THING,
  LOAD_FROM_STORAGE,
  TOGGLE_MENU,
  TOGGLE_LOGIN,
  NOT_FROM_LOGIN,
  SET_FOLLOWING_WORLDS,
  SET_WIDTH,
  SET_HEIGHT,
  UPDATE_INDEX_EXPANDED_PANEL,
  SET_VIEWS
} from "../constants/actionTypes";

export function updateIndexExpandedPanel(payload) {
  return { type: UPDATE_INDEX_EXPANDED_PANEL, payload };
}
export function setAPI(payload) {
  return { type: SET_API, payload };
}
export function addArticle(payload) {
  return { type: ADD_ARTICLE, payload };
}
export function userLogin(payload) {
  return { type: LOGIN, payload };
}
export function logout(payload) {
  return { type: LOGOUT, payload };
}
export function redirectTo(payload) {
  return { type: REDIRECT_TO, payload };
}
export function setWorlds(payload) {
  return { type: SET_WORLDS, payload };
}
export function setTemplates(payload) {
  return { type: SET_TEMPLATES, payload };
}
export function setAllUsers(payload) {
  return { type: SET_ALL_USERS, payload };
}
export function addWorld(payload) {
  return { type: ADD_WORLD, payload };
}
export function addAndSelectWorld(payload) {
  return { type: ADD_AND_SELECT_WORLD, payload };
}
export function updateWorld(payload) {
  return { type: UPDATE_WORLD, payload };
}
export function updatePublicWorldForCollab(payload) {
  return { type: UPDATE_PUBLIC_WORLD_COLLAB, payload };
}
export function setPublicWorlds(payload) {
  return { type: SET_PUBLIC_WORLDS, payload };
}
export function selectWorld(payload) {
  return { type: SELECT_WORLD, payload };
}
export function setAttributes(payload) {
  return { type: SET_ATTRIBUTES, payload };
}
export function addAttributes(payload) {
  return { type: ADD_ATTRIBUTES, payload };
}
export function updateAttributes(payload) {
  return { type: UPDATE_ATTRIBUTES, payload };
}
export function setTypes(payload) {
  return { type: SET_TYPES, payload };
}
export function addType(payload) {
  return { type: ADD_TYPE, payload };
}
export function setThings(payload) {
  return { type: SET_THINGS, payload };
}
export function addThing(payload) {
  return { type: ADD_THING, payload };
}
export function updateType(payload) {
  return { type: UPDATE_TYPE, payload };
}
export function updateSelectedType(payload) {
  return { type: UPDATE_SELECTED_TYPE, payload };
}
export function updateThing(payload) {
  return { type: UPDATE_THING, payload };
}
export function updateSelectedThing(payload) {
  return { type: UPDATE_SELECTED_THING, payload };
}
export function loadFromStorage(payload) {
  return { type: LOAD_FROM_STORAGE, payload };
}
export function toggleMenu(payload) {
  return { type: TOGGLE_MENU, payload };
}
export function toggleLogin(payload) {
  return { type: TOGGLE_LOGIN, payload };
}
export function notFromLogin(payload) {
  return { type: NOT_FROM_LOGIN, payload };
}
export function setFollowingWorlds(payload) {
  return { type: SET_FOLLOWING_WORLDS, payload };
}
export function setWidth(payload) {
  return { type: SET_WIDTH, payload };
}
export function setHeight(payload) {
  return { type: SET_HEIGHT, payload };
}
export function setViews(payload) {
  return { type: SET_VIEWS, payload };
}
