import {
  ADD_PLAYMAP
} from "../constants/actionTypes";

export function addPlayMap(payload) {
  return { type: ADD_PLAYMAP, payload };
}
