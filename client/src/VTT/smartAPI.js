
// This is our special type of Error that represents
// when a request got a 401 Unauthorized response
function UnauthorizedError(message) {
  this.name = "UnauthorizedError";
  this.message = message;
}
UnauthorizedError.prototype = new Error();

var API = (function() {
  var instance;

  function createInstance() {
    var api = new APIClass();
    return api;
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

class APIClass {
  constructor() {
    this.real = true;
  }

  logErrorReason = reason => {
    // log the error reason but keep the rejection
    console.log("Response error reason:", reason);
    return Promise.reject(reason);
  };

  checkStatus = response => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else if (response.status === 401) {
      var unauthorizedError = new UnauthorizedError(response.statusText);
      unauthorizedError.response = response;
      return Promise.reject(unauthorizedError);
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      return Promise.reject(error);
    }
  };
  
  getAllVTT = async (userID, refresh) => {
    const campaigns = await this.getCampaigns(userID, refresh);
    const maps = await this.getMaps(userID, refresh);
    const tokens = await this.getTokens(userID, refresh);
    const playMaps = await this.getPlayMaps(userID, refresh);
    const favoriteTokens = await this.getFavoriteTokens(userID, refresh);
    const players = await this.getPlayers(refresh);

    return {
      campaigns: campaigns.campaigns,
      maps: maps.maps,
      tokens: tokens.tokens,
      playMaps: playMaps.playMaps,
      favoriteTokens: favoriteTokens.favoriteTokens,
      players: players.players
    };
  }

  // Player
  getPlayers = async (refresh = false) => {
    if (refresh) {
      return this.getPlayersFromAPI();
    }
    else {
      const data = this.getSessionData(`players`);
      if (data !== null) {
        return data;
      }
      else {
        return this.getPlayersFromAPI();
      }
    }
  };
  getPlayersFromAPI = async () => {
    if (this.real) {
      const response = await this.fetchData(
        `/api/vtt/getPlayers/`
      );
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.fetchData(
      //     `/api/vtt/getPlayers/`
      //   );
      //   return this.processResponse(response, null, `players`);
      // }
      // const data = await this.processResponse(response, retry, `players`);
      const data = await this.processResponse(response, null, `players`);
      return data;
    } else {
      return [{ _id: -1, vttID: -1, Name: "Alice" }];
    }
  };

  createPlayer = async (player) => {
    if (this.real) {
      const response = await this.postData("/api/vtt/createPlayer", { player });
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.postData("/api/vtt/createPlayer", { player });
      //   return this.processResponse(response);
      // }
      return this.processResponse(response, null);
    } else {
      return -1;
    }
  };

  deletePlayer = async (playerID) => {
    if (this.real) {
      const response = await this.deleteData("/api/vtt/deletePlayer", { playerID });
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.deleteData("/api/vtt/deletePlayer", { playerID });
      //   return this.processResponse(response);
      // }
      return this.processResponse(response, null);
    } else {
      return "success";
    }
  };

  updatePlayer = async (player) => {
    if (this.real) {
      const response = await this.patchData("/api/vtt/updatePlayer", { player });
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.patchData("/api/vtt/updatePlayer", { player });
      //   return this.processResponse(response);
      // }
      return this.processResponse(response, null);
    } else {
      return "success";
    }
  };

  login = async (email, password) => {
    if (this.real) {
      const response = await this.postData("/api/vtt/login", { email, password });
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.patchData("/api/vtt/updatePlayer", { player });
      //   return this.processResponse(response);
      // }
      return this.processResponse(response, null);
    } else {
      return "success";
    }
  };

  playerPing = async (playerID) => {
    if (this.real) {
      const response = await this.postData("/api/vtt/playerPing", { playerID });
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.patchData("/api/vtt/updatePlayer", { player });
      //   return this.processResponse(response);
      // }
      return this.processResponse(response, null);
    } else {
      return "success";
    }
  };

  // Map
  getMaps = async (userID, refresh = false) => {
    if (refresh) {
      return this.getMapsFromAPI(userID);
    }
    else {
      const data = this.getSessionData(`maps`);
      if (data !== null) {
        return data;
      }
      else {
        return this.getMapsFromAPI(userID);
      }
    }
  };
  getMapsFromAPI = async (userID) => {
    if (this.real) {
      const response = await this.fetchData(
        `/api/vtt/getMaps/${userID}`
      );
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.fetchData(
      //     `/api/vtt/getMaps/${userID}`
      //   );
      //   return this.processResponse(response, null, `maps`);
      // }
      // const data = await this.processResponse(response, retry, `maps`);
      const data = await this.processResponse(response, null, `maps`);
      return data;
    } else {
      return [{ _id: -1, vttID: -1, Name: "Alice" }];
    }
  };

  createMap = async (map) => {
    if (this.real) {
      const response = await this.postData("/api/vtt/createMap", { map });
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.postData("/api/vtt/createMap", { map });
      //   return this.processResponse(response);
      // }
      return this.processResponse(response, null);
    } else {
      return -1;
    }
  };

  deleteMap = async (mapID) => {
    if (this.real) {
      const response = await this.deleteData("/api/vtt/deleteMap", { mapID });
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.deleteData("/api/vtt/deleteMap", { mapID });
      //   return this.processResponse(response);
      // }
      return this.processResponse(response, null);
    } else {
      return "success";
    }
  };

  updateMap = async (map) => {
    if (this.real) {
      const response = await this.patchData("/api/vtt/updateMap", { map });
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.patchData("/api/vtt/updateMap", { map });
      //   return this.processResponse(response);
      // }
      return this.processResponse(response, null);
    } else {
      return "success";
    }
  };
  
  // Token
  getTokens = async (userID, refresh = false) => {
    if (refresh) {
      return this.getTokensFromAPI(userID);
    }
    else {
      const data = this.getSessionData(`tokens`);
      if (data !== null) {
        return data;
      }
      else {
        return this.getTokensFromAPI(userID);
      }
    }
  };
  getTokensFromAPI = async (userID) => {
    if (this.real) {
      const response = await this.fetchData(
        `/api/vtt/getTokens/${userID}`
      );
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.fetchData(
      //     `/api/vtt/getTokens/${userID}`
      //   );
      //   return this.processResponse(response, null, `tokens`);
      // }
      // const data = await this.processResponse(response, retry, `tokens`);
      const data = await this.processResponse(response, null, `tokens`);
      return data;
    } else {
      return [{ _id: -1, vttID: -1, Name: "Alice" }];
    }
  };

  createToken = async (token) => {
    if (this.real) {
      const response = await this.postData("/api/vtt/createToken", { token });
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.postData("/api/vtt/createToken", { token });
      //   return this.processResponse(response);
      // }
      return this.processResponse(response, null);
    } else {
      return -1;
    }
  };

  deleteToken = async (tokenID) => {
    if (this.real) {
      const response = await this.deleteData("/api/vtt/deleteToken", { tokenID });
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.deleteData("/api/vtt/deleteToken", { tokenID });
      //   return this.processResponse(response);
      // }
      return this.processResponse(response, null);
    } else {
      return "success";
    }
  };

  updateToken = async (token) => {
    if (this.real) {
      const response = await this.patchData("/api/vtt/updateToken", { token });
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.patchData("/api/vtt/updateToken", { token });
      //   return this.processResponse(response);
      // }
      return this.processResponse(response, null);
    } else {
      return "success";
    }
  };
  
  // Campaign
  getCampaigns = async (userID, refresh = false) => {
    if (refresh) {
      return this.getCampaignsFromAPI(userID);
    }
    else {
      const data = this.getSessionData(`campaigns`);
      if (data !== null) {
        return data;
      }
      else {
        return this.getCampaignsFromAPI(userID);
      }
    }
  };
  getCampaignsFromAPI = async (userID) => {
    if (this.real) {
      const response = await this.fetchData(
        `/api/vtt/getCampaigns/${userID}`
      );
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.fetchData(
      //     `/api/vtt/getCampaigns/${userID}`
      //   );
      //   return this.processResponse(response, null, `campaigns`);
      // }
      // const data = await this.processResponse(response, retry, `campaigns`);
      const data = await this.processResponse(response, null, `campaigns`);
      return data;
    } else {
      return [{ _id: -1, vttID: -1, Name: "Alice" }];
    }
  };
  getCampaign = async (campaignID, userID = -1) => {
    const response = await this.fetchData(
      `/api/vtt/getCampaign/${campaignID}/${userID}`
    );
    const data = await this.processResponse(response);
    return data;
  };

  createCampaign = async (campaign) => {
    if (this.real) {
      const response = await this.postData("/api/vtt/createCampaign", { campaign });
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.postData("/api/vtt/createCampaign", { campaign });
      //   return this.processResponse(response);
      // }
      return this.processResponse(response, null);
    } else {
      return -1;
    }
  };

  deleteCampaign = async (campaignID) => {
    if (this.real) {
      const response = await this.deleteData("/api/vtt/deleteCampaign", { campaignID });
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.deleteData("/api/vtt/deleteCampaign", { campaignID });
      //   return this.processResponse(response);
      // }
      return this.processResponse(response, null);
    } else {
      return "success";
    }
  };

  updateCampaign = async (campaign) => {
    if (this.real) {
      const response = await this.patchData("/api/vtt/updateCampaign", { campaign });
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.patchData("/api/vtt/updateCampaign", { campaign });
      //   return this.processResponse(response);
      // }
      return this.processResponse(response, null);
    } else {
      return "success";
    }
  };
  
  // PlayMap
  getPlayMaps = async (userID, refresh = false) => {
    if (refresh) {
      return this.getPlayMapsFromAPI(userID);
    }
    else {
      const data = this.getSessionData(`playMaps`);
      if (data !== null) {
        return data;
      }
      else {
        return this.getPlayMapsFromAPI(userID);
      }
    }
  };
  getPlayMapsFromAPI = async (userID) => {
    if (this.real) {
      const response = await this.fetchData(
        `/api/vtt/getPlayMaps/${userID}`
      );
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.fetchData(
      //     `/api/vtt/getPlayMaps/${userID}`
      //   );
      //   return this.processResponse(response, null, `playMaps`);
      // }
      // const data = await this.processResponse(response, retry, `playMaps`);
      const data = await this.processResponse(response, null, `playMaps`);
      return data;
    } else {
      return [{ _id: -1, vttID: -1, Name: "Alice" }];
    }
  };
  getPlayMap = async (playMapID) => {
    const response = await this.fetchData(
      `/api/vtt/getPlayMap/${playMapID}`
    );
    const data = await this.processResponse(response);
    return data;
  };

  createPlayMap = async (playMap) => {
    if (this.real) {
      const response = await this.postData("/api/vtt/createPlayMap", { playMap });
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.postData("/api/vtt/createPlayMap", { playMap });
      //   return this.processResponse(response);
      // }
      return this.processResponse(response, null);
    } else {
      return -1;
    }
  };

  deletePlayMap = async (playMapID) => {
    if (this.real) {
      const response = await this.deleteData("/api/vtt/deletePlayMap", { playMapID });
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.deleteData("/api/vtt/deletePlayMap", { playMapID });
      //   return this.processResponse(response);
      // }
      return this.processResponse(response, null);
    } else {
      return "success";
    }
  };

  updatePlayMap = async (playMap) => {
    if (this.real) {
      const response = await this.patchData("/api/vtt/updatePlayMap", { playMap });
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.patchData("/api/vtt/updatePlayMap", { playMap });
      //   return this.processResponse(response);
      // }
      return this.processResponse(response, null);
    } else {
      return "success";
    }
  };
  
  // FavoriteToken
  getFavoriteTokens = async (userID, refresh = false) => {
    if (refresh) {
      return this.getFavoriteTokensFromAPI(userID);
    }
    else {
      const data = this.getSessionData(`favoriteTokens`);
      if (data !== null) {
        return data;
      }
      else {
        return this.getFavoriteTokensFromAPI(userID);
      }
    }
  };
  getFavoriteTokensFromAPI = async (userID) => {
    if (this.real) {
      const response = await this.fetchData(
        `/api/vtt/getFavoriteTokens/${userID}`
      );
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.fetchData(
      //     `/api/vtt/getFavoriteTokens/${userID}`
      //   );
      //   return this.processResponse(response, null, `favoriteTokens`);
      // }
      // const data = await this.processResponse(response, retry, `favoriteTokens`);
      const data = await this.processResponse(response, null, `favoriteTokens`);
      return data;
    } else {
      return [{ _id: -1, vttID: -1, Name: "Alice" }];
    }
  };

  createFavoriteToken = async (favoriteToken) => {
    if (this.real) {
      const response = await this.postData("/api/vtt/createFavoriteToken", { favoriteToken });
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.postData("/api/vtt/createFavoriteToken", { favoriteToken });
      //   return this.processResponse(response);
      // }
      return this.processResponse(response, null);
    } else {
      return -1;
    }
  };

  deleteFavoriteToken = async (favoriteTokenID) => {
    if (this.real) {
      const response = await this.deleteData("/api/vtt/deleteFavoriteToken", { favoriteTokenID });
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.deleteData("/api/vtt/deleteFavoriteToken", { favoriteTokenID });
      //   return this.processResponse(response);
      // }
      return this.processResponse(response, null);
    } else {
      return "success";
    }
  };

  updateFavoriteToken = async (favoriteToken) => {
    if (this.real) {
      const response = await this.patchData("/api/vtt/updateFavoriteToken", { favoriteToken });
      // const retry = async () => {
      //   await this.relogin();
      //   const response = await this.patchData("/api/vtt/updateFavoriteToken", { favoriteToken });
      //   return this.processResponse(response);
      // }
      return this.processResponse(response, null);
    } else {
      return "success";
    }
  };

  // Core API Calls
  fetchData = async (path, options = {}) => {
    return await fetch(`${path}`, {
      mode: "cors",
      credentials: "include",
      ...options,
      headers: {
        Accept: "application/json",
        ...options.headers
      }
    })
      .then(this.checkStatus)
      .catch(this.logErrorReason);
  };

  postData = async (path, data, options = {}) => {
    return await fetch(`${path}`, {
      mode: "cors",
      credentials: "include",
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers
      },
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(this.checkStatus)
      .catch(this.logErrorReason);
  };

  putData = async (path, data, options = {}) => {
    return await fetch(`${path}`, {
      mode: "cors",
      credentials: "include",
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers
      },
      method: "PUT",
      body: JSON.stringify(data)
    })
      .then(this.checkStatus)
      .catch(this.logErrorReason);
  };

  patchData = async (path, data, options = {}) => {
    return await fetch(`${path}`, {
      mode: "cors",
      credentials: "include",
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers
      },
      method: "PATCH",
      body: JSON.stringify(data)
    })
      .then(this.checkStatus)
      .catch(this.logErrorReason);
  };

  deleteData = async (path, data, options = {}) => {
    return await fetch(`${path}`, {
      mode: "cors",
      credentials: "include",
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers
      },
      method: "DELETE",
      body: JSON.stringify(data)
    })
      .then(this.checkStatus)
      .catch(this.logErrorReason);
  };

  processResponse = async (response, retry = null, sessionName = null, noExpiry = false) => {
    const body = await response.json();
    if (response.status !== 200) { 
      throw Error(body.message);
    }
    else if (body.error !== undefined && retry !== null) {
      return retry();
    } 
    else {
      if (sessionName !== null) {
        let expiresAt = new Date();
        if (noExpiry) 
          expiresAt = "never";
        else 
          expiresAt.setHours(expiresAt.getHours() + 1);
        const sessionObj = {
          expiresAt,
          body
        };
        sessionStorage.setItem(sessionName, JSON.stringify(sessionObj));
      }
      return body;
    };
  };

  relogin = async () => {
    try {
      const user = this.getSessionData("loginUser");
      if (user !== null) {
        const response = await this.postData("/api/user/login", user);
        this.processResponse(response, null, "user", true);
      }
    }
    catch {}
  }

  getSessionData = (sessionName) => {
    const sessionStr = sessionStorage.getItem(sessionName);
    if (sessionStr !== null) {
      const sessionObj = JSON.parse(sessionStr);
      if (sessionObj.expiresAt !== undefined && 
        (sessionObj.expiresAt === "never" || sessionObj.expiresAt > new Date())) {
        return sessionObj.body;
      }
    }
    return null;
  };
}

export default API;
