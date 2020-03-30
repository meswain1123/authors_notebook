
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

  getVersion = async () => {
    if (this.real) {
      const response = await this.fetchData("/version");
      return this.processResponse(response);
    } else {
      return { version: "0.0.1" };
    }
  };

  // User
  getAllUsers = async () => {
    if (this.real) {
      const response = await this.fetchData("/api/user/getAllUsers");
      return this.processResponse(response);
    } else {
      return [{
        _id: "-1",
        email: "fake@fakemail.com",
        username: "Liar Liar"
      }];
    }
  };

  login = async user => {
    if (this.real) {
      const response = await this.postData("/api/user/login", user);
      return this.processResponse(response);
    } else {
      return {
        _id: "-1",
        email: "fake@fakemail.com",
        username: "Liar Liar"
      };
    }
  };

  logout = async user => {
    if (this.real) {
      await this.postData("/api/user/logout");
    }
  };

  register = async user => {
    if (this.real) {
      const response = await this.postData("/api/user/register", user);
      return this.processResponse(response);
    } else {
      return -1;
    }
  };

  confirmEmail = async (code) => {
    if (this.real) {
      const response = await this.patchData("/api/user/confirmEmail", {code});
      return this.processResponse(response);
    } else {
      return {
        _id: "-1",
        email: "fake@fakemail.com",
        username: "Liar Liar"
      };
    }
  };

  sendReset = async user => {
    if (this.real) {
      const response = await this.postData("/api/user/sendReset", user);
      return this.processResponse(response);
    } else {
      return "success";
    }
  };

  checkResetPasswordCode = async code => {
    if (this.real) {
      const response = await this.postData("/api/user/checkResetPasswordCode", {code});
      return this.processResponse(response);
    } else {
      return "success";
    }
  };
  
  resetPassword = async (code, newPassword) => {
    if (this.real) {
      const response = await this.patchData("/api/user/resetPassword", {code, newPassword});
      return this.processResponse(response);
    } else {
      return {
        _id: "-1",
        email: "fake@fakemail.com",
        username: "Liar Liar"
      };
    }
  };

  emailTest = async user => {
    if (this.real) {
      const response = await this.postData("/api/user/emailTest", user);
      return this.processResponse(response);
    } else {
      return "success";
    }
  };
  
  updateUser = async user => {
    if (this.real) {
      const response = await this.patchData("/api/user/update", user);
      return this.processResponse(response);
    } else {
      return {
        _id: "-1",
        email: "fake@fakemail.com",
        username: "Liar Liar"
      };
    }
  };

  // World
  getWorldsForUser = async () => {
    if (this.real) {
      const response = await this.fetchData(`/api/world/getWorldsForUser`);
      return this.processResponse(response);
    } else {
      return [
        { _id: -1, OwnerID: -1, Name: "Alice in Wonderland", Public: true }
      ];
    }
  };

  getPublicWorlds = async () => {
    if (this.real) {
      const response = await this.fetchData("/api/world/getPublicWorlds");
      return this.processResponse(response);
    } else {
      return [
        { _id: -1, OwnerID: -1, Name: "Alice in Wonderland", Public: true }
      ];
    }
  };

  createWorld = async (world) => {
    if (this.real) {
      const response = await this.postData("/api/world/createWorld", { world: world });
      return this.processResponse(response);
    } else {
      return -1;
    }
  };

  deleteWorld = async (worldID) => {
    if (this.real) {
      const response = await this.deleteData("/api/world/deleteWorld", { worldID: worldID });
      return this.processResponse(response);
    } else {
      return "success";
    }
  };

  updateWorld = async (world) => {
    if (this.real) {
      const response = await this.patchData("/api/world/updateWorld", { world: world });
      return this.processResponse(response);
    } else {
      return "success";
    }
  };

  selectWorld = async (worldID) => {
    if (this.real) {
      const response = await this.postData("/api/world/selectWorld", { worldID: worldID });
      return this.processResponse(response);
    } else {
      return "success";
    }
  };

  // Type
  getTypesForWorld = async (worldID) => {
    if (this.real) {
      const response = await this.fetchData(
        `/api/world/getTypesForWorld/${worldID}`
      );
      return this.processResponse(response);
    } else {
      return [{ _id: -1, worldID: -1, Name: "Character" }];
    }
  };

  getType = async (worldID, typeID) => {
    if (this.real) {
      const response = await this.fetchData(
        `/api/world/getType/${worldID}/${typeID}`
      );
      return this.processResponse(response);
    } else {
      return {
        _id: -1,
        worldID: -1,
        Name: "Character",
        Description: "",
        AttributesArr: {}
      };
    }
  };

  createType = async (type) => {
    if (this.real) {
      const response = await this.postData("/api/world/createType", { type: type });
      return this.processResponse(response);
    } else {
      return -1;
    }
  };

  deleteType = async (worldID, typeID) => {
    if (this.real) {
      const response = await this.deleteData("/api/world/deleteType", { worldID: worldID, typeID: typeID });
      return this.processResponse(response);
    } else {
      return "success";
    }
  };

  updateType = async (type) => {
    if (this.real) {
      const response = await this.patchData("/api/world/updateType", { type: type });
      return this.processResponse(response);
    } else {
      return "success";
    }
  };

  // Thing
  getThingsForWorld = async (worldID) => {
    if (this.real) {
      const response = await this.fetchData(
        `/api/world/getThingsForWorld/${worldID}`
      );
      return this.processResponse(response);
    } else {
      return [{ _id: -1, worldID: -1, Name: "Alice" }];
    }
  };

  getThing = async (worldID, thingID) => {
    if (this.real) {
      const response = await this.fetchData(`/api/world/getThing/${worldID}/${thingID}`);
      return this.processResponse(response);
    } else {
      return {
        _id: -1,
        worldID: -1,
        Types: [-1],
        Name: "Alice",
        Description: ""
      };
    }
  };

  createThing = async (thing) => {
    if (this.real) {
      const response = await this.postData("/api/world/createThing", { thing: thing });
      return this.processResponse(response);
    } else {
      return -1;
    }
  };

  deleteThing = async (worldID, thingID) => {
    if (this.real) {
      const response = await this.deleteData("/api/world/deleteThing", { worldID: worldID, thingID: thingID });
      return this.processResponse(response);
    } else {
      return "success";
    }
  };

  updateThing = async (thing) => {
    if (this.real) {
      const response = await this.patchData("/api/world/updateThing", { thing: thing });
      return this.processResponse(response);
    } else {
      return "success";
    }
  };

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
    if (response.status !== 200) throw Error(body.message);
    else return body;
  };
}

export default API;
