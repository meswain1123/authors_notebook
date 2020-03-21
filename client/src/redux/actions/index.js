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
  SET_FOLLOWING_WORLDS
} from "../constants/actionTypes";

export function selectPage(payload) {
  return { type: SELECT_PAGE, payload };
}
export function addArticle(payload) {
  return { type: ADD_ARTICLE, payload };
}
export function userLogin(payload) {
  return { type: LOGIN, payload };
}
export function logOut(payload) {
  return { type: LOG_OUT, payload };
}
export function setWorlds(payload) {
  return { type: SET_WORLDS, payload };
}
export function addWorld(payload) {
  return { type: ADD_WORLD, payload };
}
export function updateWorld(payload) {
  return { type: UPDATE_WORLD, payload };
}
export function setPublicWorlds(payload) {
  return { type: SET_PUBLIC_WORLDS, payload };
}
export function selectWorld(payload) {
  return { type: SELECT_WORLD, payload };
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
export function updateAttributesArr(payload) {
  return { type: UPDATE_ATTRIBUTES_ARR, payload };
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
export function setFollowingWorlds(payload) {
  return { type: SET_FOLLOWING_WORLDS, payload };
}
