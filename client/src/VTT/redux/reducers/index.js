import {
  SET_MAPS,
  ADD_MAP,
  UPDATE_MAP,
  // DELETE_MAP,
  SET_TOKENS,
  ADD_TOKEN,
  UPDATE_TOKEN,
  // DELETE_TOKEN,
  SET_CAMPAIGNS,
  ADD_CAMPAIGN,
  UPDATE_CAMPAIGN,
  // DELETE_CAMPAIGN,
  SELECT_CAMPAIGN,
  SET_PLAYMAPS,
  ADD_PLAYMAP,
  UPDATE_PLAYMAP,
  // DELETE_PLAYMAP,
  SELECT_PLAYMAP,
  SET_FAVORITETOKENS,
  ADD_FAVORITETOKEN,
  UPDATE_FAVORITETOKEN,
  // DELETE_FAVORITETOKEN,
  TOGGLE_IS_ON
} from "../constants/actionTypes";

const initialState = {
  maps: null,
  tokens: null,
  campaigns: null,
  playMaps: null,
  favoriteTokens: null,
  selectedCampaign: null,
  selectedPlayMap: null,
  isOn: true
};
function rootReducer(state = initialState, action) {
  if (action.type === SET_MAPS) {
    return Object.assign({}, state, {
      maps: action.payload
    });
  } else if (action.type === SET_TOKENS) {
    return Object.assign({}, state, {
      tokens: action.payload
    });
  } else if (action.type === SET_CAMPAIGNS) {
    return Object.assign({}, state, {
      campaigns: action.payload
    });
  }  else if (action.type === SET_PLAYMAPS) {
    return Object.assign({}, state, {
      playMaps: action.payload
    });
  } else if (action.type === SET_FAVORITETOKENS) {
    return Object.assign({}, state, {
      favoriteTokens: action.payload
    });
  } else if (action.type === ADD_MAP) {
    const maps = state.maps;
    maps.push(action.payload);
    return Object.assign({}, state, {
      maps
    });
  } else if (action.type === ADD_TOKEN) {
    const tokens = state.tokens;
    tokens.push(action.payload);
    return Object.assign({}, state, {
      tokens
    });
  } else if (action.type === ADD_CAMPAIGN) {
    const campaigns = state.campaigns;
    campaigns.push(action.payload);
    return Object.assign({}, state, {
      campaigns
    });
  } else if (action.type === ADD_PLAYMAP) {
    const playMaps = state.playMaps;
    playMaps.push(action.payload);
    return Object.assign({}, state, {
      playMaps
    });
  } else if (action.type === ADD_FAVORITETOKEN) {
    const favoriteTokens = state.favoriteTokens;
    favoriteTokens.push(action.payload);
    return Object.assign({}, state, {
      favoriteTokens
    });
  } else if (action.type === UPDATE_MAP) {
    const maps = state.maps;
    const mapFinder = maps.filter(m => m._id === action.payload._id);
    if (mapFinder.length === 1) {
      const map = mapFinder[0];
      map.name = action.payload.name;
      map.file = action.payload.file;
      map.gridWidth = action.payload.gridWidth;
      map.gridHeight = action.payload.gridHeight;
    }
    return Object.assign({}, state, {
      maps
    });
  } else if (action.type === UPDATE_TOKEN) {
    const tokens = state.tokens;
    const tokenFinder = tokens.filter(t => t._id === action.payload._id);
    if (tokenFinder.length === 1) {
      const token = tokenFinder[0];
      token.file = action.payload.file;
    }
    return Object.assign({}, state, {
      tokens
    });
  } else if (action.type === UPDATE_CAMPAIGN) {
    const campaigns = state.campaigns;
    let selectedCampaign = state.selectedCampaign;
    // let selectedPlayMap = state.selectedPlayMap;
    const campaignFinder = campaigns.filter(m => m._id === action.payload._id);
    if (campaignFinder.length === 1) {
      const campaign = campaignFinder[0];
      campaign.name = action.payload.name;
      campaign.selectedPlayMapID = action.payload.selectedPlayMapID;

      if (selectedCampaign._id === campaign._id) {
        selectedCampaign = campaign;
        // if (selectedCampaign.selectedPlayMapID === "") {
        //   selectedPlayMap = null;
        // } else if (selectedPlayMap === null || selectedCampaign.selectedPlayMapID !== selectedPlayMap._id) {
        //   const playMapFinder = state.playMaps.filter(m => m._id === selectedCampaign.selectedPlayMapID);
        //   if (playMapFinder.length === 1) {
        //     selectedPlayMap = playMapFinder[0];
        //   } else {
        //     selectedPlayMap = null;
        //   }
        // }
      }
    }
    return Object.assign({}, state, {
      campaigns,
      selectedCampaign,
      // selectedPlayMap
    });
  } else if (action.type === UPDATE_PLAYMAP) {
    const playMaps = state.playMaps;
    let selectedPlayMap = state.selectedPlayMap;
    const playMapFinder = playMaps.filter(m => m._id === action.payload._id);
    if (playMapFinder.length === 1) {
      const playMap = playMapFinder[0];
      playMap.campaignID = action.payload.campaignID;
      playMap.name = action.payload.name;
      playMap.map = action.payload.map;
      playMap.tokens = action.payload.tokens;
      playMap.lightMasks = action.payload.lightMasks;
      playMap.zoom = action.payload.zoom;
      playMap.dx = action.payload.dx;
      playMap.dy = action.payload.dy;

      if (selectedPlayMap._id === playMap._id) {
        selectedPlayMap = playMap;
      }
    }
    return Object.assign({}, state, {
      playMaps,
      selectedPlayMap
    });
  } else if (action.type === UPDATE_FAVORITETOKEN) {
    const favoriteTokens = state.favoriteTokens;
    const favoriteTokenFinder = favoriteTokens.filter(t => t._id === action.payload._id);
    if (favoriteTokenFinder.length === 1) {
      const favoriteToken = favoriteTokenFinder[0];
      favoriteToken.file = action.payload.file;
    }
    return Object.assign({}, state, {
      favoriteTokens
    });
  } else if (action.type === SELECT_CAMPAIGN) {
    const selectedCampaign = action.payload;
    let selectedPlayMap = state.selectedPlayMap;
    if (selectedCampaign.selectedPlayMapID === "") {
      selectedPlayMap = null;
    } else if (state.playMaps && (selectedPlayMap === null || selectedCampaign.selectedPlayMapID !== selectedPlayMap._id)) {
      const playMapFinder = state.playMaps.filter(m => m._id === selectedCampaign.selectedPlayMapID);
      if (playMapFinder.length === 1) {
        selectedPlayMap = playMapFinder[0];
      } else {
        selectedPlayMap = null;
      }
    }
    return Object.assign({}, state, {
      selectedCampaign,
      selectedPlayMap
    });
  } else if (action.type === SELECT_PLAYMAP) {
    return Object.assign({}, state, {
      selectedPlayMap: action.payload
    });
  } else if (action.type === TOGGLE_IS_ON) {
    return Object.assign({}, state, {
      isOn: !state.isOn
    });
  }
  return state;
}

export default rootReducer;

export const login = (user, history) => {};

export const logout = history => {};
