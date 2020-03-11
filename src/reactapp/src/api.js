
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
  login = async user => {
    if (this.real) {
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
  getWorldsForUser = async () => {
    if (this.real) {
      const response = await this.fetchData(`/world/getWorldsForUser`);
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

  createWorld = async (world) => {
    if (this.real) {
      const response = await this.postData("/world/createWorld", { world: world });
      return this.processResponse(response);
    } else {
      return -1;
    }
  };

  deleteWorld = async (worldID) => {
    if (this.real) {
      const response = await this.deleteData("/world/deleteWorld", { worldID: worldID });
      return this.processResponse(response);
    } else {
      return "success";
    }
  };

  updateWorld = async (world) => {
    if (this.real) {
      const response = await this.patchData("/world/updateWorld", { world: world });
      return this.processResponse(response);
    } else {
      return "success";
    }
  };

  selectWorld = async (worldID) => {
    if (this.real) {
      const response = await this.postData("/world/selectWorld", { worldID: worldID });
      return this.processResponse(response);
    } else {
      return "success";
    }
  };

  // Type
  getTypesForWorld = async () => {
    if (this.real) {
      const response = await this.fetchData(
        `/world/getTypesForWorld`
      );
      return this.processResponse(response);
    } else {
      return [{ _id: -1, WorldID: -1, Name: "Character" }];
    }
  };

  getType = async (typeID) => {
    if (this.real) {
      const response = await this.fetchData(
        `/world/getType/${typeID}`
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

  createType = async (type) => {
    if (this.real) {
      const response = await this.postData("/world/createType", { type: type });
      return this.processResponse(response);
    } else {
      return -1;
    }
  };

  deleteType = async (typeID) => {
    if (this.real) {
      const response = await this.deleteData("/world/deleteType", { typeID: typeID });
      return this.processResponse(response);
    } else {
      return "success";
    }
  };

  updateType = async (type) => {
    if (this.real) {
      const response = await this.patchData("/world/updateType", { type: type });
      return this.processResponse(response);
    } else {
      return "success";
    }
  };

  // Thing
  getThingsForWorld = async () => {
    if (this.real) {
      const response = await this.fetchData(
        `/world/getThingsForWorld`
      );
      return this.processResponse(response);
    } else {
      return [{ _id: -1, WorldID: -1, Name: "Alice" }];
    }
  };

  getThing = async (thingID) => {
    if (this.real) {
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

  createThing = async (thing) => {
    if (this.real) {
      const response = await this.postData("/world/createThing", { thing: thing });
      return this.processResponse(response);
    } else {
      return -1;
    }
  };

  deleteThing = async (thingID) => {
    if (this.real) {
      const response = await this.deleteData("/world/deleteThing", { thingID: thingID });
      return this.processResponse(response);
    } else {
      return "success";
    }
  };

  updateThing = async (thing) => {
    if (this.real) {
      const response = await this.patchData("/world/updateThing", { thing: thing });
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
