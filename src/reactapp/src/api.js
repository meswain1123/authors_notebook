// import { sessionService, sessionReducer } from "redux-react-session";

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
    // this.state = {
    //   user: null,
    //   worldID: null
    // };
    this.real = true;
  }

  logErrorReason = reason => {
    // log the error reason but keep the rejection
    // console.log("Response error reason:", reason);
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

  getVersion = async () => {
    if (this.real) {
      const response = await this.fetchData("/version");
      return this.processResponse(response);
    } else {
      return { version: "0.0.1" };
    }
  };

  // User
  login = async user => {
    // // console.log(user);
    if (this.real) {
      // this.state.user = user; // Saving for autofix
      const response = await this.postData("/user/login", user);
      return this.processResponse(response);
    } else {
      return {
        _id: "-1",
        email: "fake@fakemail.com",
        firstName: "Liar Liar",
        lastName: "Pants on Fire"
      };
    }
  };

  logout = async user => {
    if (this.real) {
      // this.state.user = null;
      // this.state.worldID = null;
      await this.postData("/user/logout");
    }
  };

  register = async user => {
    if (this.real) {
      const response = await this.postData("/user/register", user);
      return this.processResponse(response);
    } else {
      return -1;
    }
  };

  sendReset = async user => {
    if (this.real) {
      const response = await this.postData("/user/sendReset", user);
      return this.processResponse(response);
    } else {
      return "success";
    }
  };

  // World
  getWorldsForUser = async (userID) => {
    if (this.real) {
      // console.log(this.state.user);
      // if (this.state.user === null)
      //   this.state.user = JSON.parse(sessionStorage.getItem("user"));
      const response = await this.fetchData(`/world/getWorldsForUser/${userID}`);
      return this.processResponse(response);
    } else {
      return [
        { _id: -1, OwnerID: -1, Name: "Alice in Wonderland", Public: true }
      ];
    }
  };

  getPublicWorlds = async () => {
    if (this.real) {
      const response = await this.fetchData("/world/getPublicWorlds");
      return this.processResponse(response);
    } else {
      return [
        { _id: -1, OwnerID: -1, Name: "Alice in Wonderland", Public: true }
      ];
    }
  };

  createWorld = async (userID, world) => {
    if (this.real) {
      const response = await this.postData("/world/createWorld", { userID: userID, world: world });
      return this.processResponse(response);
    } else {
      return -1;
    }
  };

  deleteWorld = async (userID, worldID) => {
    if (this.real) {
      const response = await this.deleteData("/world/deleteWorld", { userID: userID, worldID: worldID });
      return this.processResponse(response);
    } else {
      return "success";
    }
  };

  updateWorld = async (userID, world) => {
    if (this.real) {
      const response = await this.patchData("/world/updateWorld", { userID: userID, world: world });
      return this.processResponse(response);
    } else {
      return "success";
    }
  };

  selectWorld = async (userID, worldID) => {
    if (this.real) {
      // this.state.worldID = worldID;
      const response = await this.postData("/world/selectWorld", { userID: userID, worldID: worldID });
      return this.processResponse(response);
    } else {
      return "success";
    }
  };

  // Type
  getTypesForWorld = async (userID, worldID) => {
    if (this.real) {
      const response = await this.fetchData(
        `/world/getTypesForWorld/${userID}/${worldID}`
      );
      return this.processResponse(response);
    } else {
      return [{ _id: -1, WorldID: -1, Name: "Character" }];
    }
  };

  getType = async (worldID, typeID) => {
    if (this.real) {
      const response = await this.fetchData(
        `/world/getType/${worldID}/${typeID}`
      );
      return this.processResponse(response);
    } else {
      return {
        _id: -1,
        WorldID: -1,
        Name: "Character",
        Description: "",
        Attributes: {}
      };
    }
  };

  createType = async (userID, type) => {
    if (this.real) {
      const response = await this.postData("/world/createType", { userID: userID, type: type });
      return this.processResponse(response);
    } else {
      return -1;
    }
  };

  deleteType = async (userID, worldID, typeID) => {
    if (this.real) {
      const response = await this.deleteData("/world/deleteType", { userID: userID, worldID: worldID, typeID: typeID });
      return this.processResponse(response);
    } else {
      return "success";
    }
  };

  updateType = async (userID, type) => {
    if (this.real) {
      const response = await this.patchData("/world/updateType", { userID: userID, type: type });
      return this.processResponse(response);
    } else {
      return "success";
    }
  };

  // Thing
  getThingsForWorld = async (userID, worldID) => {
    if (this.real) {
      const response = await this.fetchData(
        `/world/getThingsForWorld/${userID}/${worldID}`
      );
      return this.processResponse(response);
    } else {
      return [{ _id: -1, WorldID: -1, Name: "Alice" }];
    }
  };

  getThing = async (worldID, thingID) => {
    if (this.real) {
      // console.log(thingID);
      const response = await this.fetchData(`/world/getThing/${thingID}`);
      return this.processResponse(response);
    } else {
      return {
        _id: -1,
        WorldID: -1,
        Types: [-1],
        Name: "Alice",
        Description: ""
      };
    }
  };

  createThing = async (userID, thing) => {
    if (this.real) {
      const response = await this.postData("/world/createThing", { userID: userID, thing: thing });
      return this.processResponse(response);
    } else {
      return -1;
    }
  };

  deleteThing = async (userID, thingID) => {
    if (this.real) {
      const response = await this.deleteData("/world/deleteThing", { userID: userID, thingID: thingID });
      return this.processResponse(response);
    } else {
      return "success";
    }
  };

  updateThing = async (userID, thing) => {
    if (this.real) {
      const response = await this.patchData("/world/updateThing", { userID: userID, thing: thing });
      return this.processResponse(response);
    } else {
      return "success";
    }
  };

  // I should probably change these to not be exported
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

  processResponse = async response => {
    const body = await response.json();
    // if (body.user !== undefined)
    //   this.state.user = body.user;
    if (response.status !== 200) throw Error(body.message);
    else return body;
  };
}

export default API;
