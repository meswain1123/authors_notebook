
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
      const retry = async () => {
        await this.relogin();
        const response = await this.fetchData("/api/user/getAllUsers");
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
    } else {
      return [{
        _id: "-1",
        email: "fake@fakemail.com",
        username: "Liar Liar"
      }];
    }
  };

  login = async (user, stayLoggedIn) => {
    if (this.real) {
      if (stayLoggedIn) {
        const sessionObj = {
          body: user,
          expiresAt: "never"
        };
        sessionStorage.setItem("loginUser", JSON.stringify(sessionObj));
      }
      const response = await this.postData("/api/user/login", user);
      return this.processResponse(response, null, "user", stayLoggedIn);
    } else {
      return {
        _id: "-1",
        email: "fake@fakemail.com",
        username: "Liar Liar"
      };
    }
  }

  logout = async user => {
    if (this.real) {
      await this.postData("/api/user/logout");
      sessionStorage.removeItem("user");
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
      const retry = async () => {
        await this.relogin();
        const response = await this.patchData("/api/user/update", user);
        return this.processResponse(response, null);
      }
      return this.processResponse(response, retry);
    } else {
      return {
        _id: "-1",
        email: "fake@fakemail.com",
        username: "Liar Liar"
      };
    }
  };

  // World
  getWorldsForUser = async (refresh = false) => {
    if (refresh) {
      return this.getWorldsForUserFromAPI();
    }
    else {
      const data = this.getSessionData("worlds");
      if (data !== null) {
        return data;
      }
      else {
        return this.getWorldsForUserFromAPI();
      }
    }
  };
  getWorldsForUserFromAPI = async () => {
    if (this.real) {
      const response = await this.fetchData(`/api/world/getWorldsForUser`);
      const retry = async () => {
        await this.relogin();
        const response = await this.fetchData(`/api/world/getWorldsForUser`);
        return this.processResponse(response, null, "worlds");
      }
      return this.processResponse(response, retry, "worlds");
    } else {
      return [
        { _id: -1, OwnerID: -1, Name: "Alice in Wonderland", Public: true }
      ];
    }
  };

  getPublicWorlds = async (refresh = false) => {
    if (refresh) {
      return this.getPublicWorldsFromAPI();
    }
    else {
      const data = this.getSessionData("publicWorlds");
      if (data !== null) {
        return data;
      }
      else {
        return this.getPublicWorldsFromAPI();
      }
    }
  };
  getPublicWorldsFromAPI = async () => {
    if (this.real) {
      const response = await this.fetchData("/api/world/getPublicWorlds");
      const retry = async () => {
        await this.relogin();
        const response = await this.fetchData("/api/world/getPublicWorlds");
        return this.processResponse(response, null, "publicWorlds");
      }
      return this.processResponse(response, retry, "publicWorlds");
    } else {
      return [
        { _id: -1, OwnerID: -1, Name: "Alice in Wonderland", Public: true }
      ];
    }
  };

  getWorld = async (worldID, refresh = false) => {
    try {
      let attributes = await this.getAttributesForWorld(worldID, refresh);
      attributes = attributes.attributes;
      let types = await this.getTypesForWorld(worldID, refresh);
      types = types.types;
      let things = await this.getThingsForWorld(worldID, refresh);
      things = things.things;

      // Now connect them all as is appropriate.
      const attributesByID = {};
      const attributesByName = {};
      attributes.forEach(attribute => {
        attribute.TypeIDs = [];
        attributesByID[attribute._id] = attribute;
        attributesByName[attribute.Name] = attribute;
      });
      types.forEach(t=> {
        t.Supers = [];
        t.SuperIDs.forEach(sID=> {
          t.Supers = t.Supers.concat(types.filter(t2=>t2._id === sID));
        });
        t.AttributesArr = [];
        t.Attributes.forEach(a => {
          const attr = attributesByID[a.attrID];
          if (attr === undefined) {
          }
          else {
            attr.TypeIDs.push(t._id);
            t.AttributesArr.push({
              index: t.AttributesArr.length,
              Name: attr.Name.trim(),
              AttributeType: attr.AttributeType,
              Options: attr.Options,
              DefinedType: attr.DefinedType,
              ListType: attr.ListType,
              attrID: a.attrID,
              TypeIDs: attr.TypeIDs
            });
          }
        });
        const defHash = {};
        if (t.Defaults !== undefined) {
          t.Defaults.forEach(def => {
            defHash[def.attrID] = def;
          });
        }
        t.DefaultsHash = defHash;
      });
      things.forEach(t=> {
        t.Types = [];
        t.TypeIDs.forEach(tID=> {
          t.Types = t.Types.concat(types.filter(t2=>t2._id === tID));
        });
      });
      return {
        attributes,
        attributesByID,
        attributesByName,
        types,
        things
      };
    }
    catch (error) {
      console.log(error);
      return { error };
    }
  };

  createWorld = async (world) => {
    if (this.real) {
      const response = await this.postData("/api/world/createWorld", { world: world });
      const retry = async () => {
        await this.relogin();
        const response = await this.postData("/api/world/createWorld", { world: world });
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
    } else {
      return -1;
    }
  };

  deleteWorld = async (worldID) => {
    if (this.real) {
      const response = await this.deleteData("/api/world/deleteWorld", { worldID: worldID });
      const retry = async () => {
        await this.relogin();
        const response = await this.deleteData("/api/world/deleteWorld", { worldID: worldID });
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
    } else {
      return "success";
    }
  };

  updateWorld = async (world) => {
    if (this.real) {
      const response = await this.patchData("/api/world/updateWorld", { world: world });
      const retry = async () => {
        await this.relogin();
        const response = await this.patchData("/api/world/updateWorld", { world: world });
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
    } else {
      return "success";
    }
  };

  generateCollabLink = async (worldID) => {
    if (this.real) {
      const response = await this.patchData("/api/world/generateCollabLink", { worldID: worldID });
      const retry = async () => {
        await this.relogin();
        const response = await this.patchData("/api/world/generateCollabLink", { worldID: worldID });
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
    } else {
      return "success";
    }
  };

  addNewCollaborator = async (worldID, userID, email) => {
    if (this.real) {
      const response = await this.patchData("/api/world/addNewCollaborator", { worldID, userID, email });
      const retry = async () => {
        await this.relogin();
        const response = await this.patchData("/api/world/addNewCollaborator", { worldID, userID, email });
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
    } else {
      return "success";
    }
  };

  emailCollaborator = async (worldID, email) => {
    if (this.real) {
      const response = await this.patchData("/api/world/emailCollaborator", { worldID, email });
      const retry = async () => {
        await this.relogin();
        const response = await this.patchData("/api/world/emailCollaborator", { worldID, email });
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
    } else {
      return "success";
    }
  };

  deleteCollab = async (worldID, collabID) => {
    if (this.real) {
      const response = await this.deleteData("/api/world/deleteCollab", { worldID, collabID });
      const retry = async () => {
        await this.relogin();
        const response = await this.deleteData("/api/world/deleteCollab", { worldID, collabID });
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
    } else {
      return "success";
    }
  };

  updateCollaboratorPermission = async (worldID, collabID, editPermission) => {
    if (this.real) {
      const response = await this.patchData("/api/world/updateCollaboratorPermission", { worldID, collabID, editPermission });
      const retry = async () => {
        await this.relogin();
        const response = await this.patchData("/api/world/updateCollaboratorPermission", { worldID, collabID, editPermission });
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
    } else {
      return "success";
    }
  };

  checkCollabID = async (worldID, collabID) => {
    if (this.real) {
      const response = await this.postData("/api/world/checkCollabID", {worldID, collabID});
      return this.processResponse(response);
    } else {
      return "success";
    }
  };

  requestToCollaborate = async (worldID) => {
    if (this.real) {
      const response = await this.patchData("/api/world/requestToCollaborate", { worldID });
      const retry = async () => {
        await this.relogin();
        const response = await this.patchData("/api/world/requestToCollaborate", { worldID });
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
    } else {
      return "success";
    }
  };

  declineCollabInvite = async (worldID, collabID) => {
    if (this.real) {
      const response = await this.deleteData("/api/world/declineCollabInvite", { worldID, collabID });
      const retry = async () => {
        await this.relogin();
        const response = await this.deleteData("/api/world/declineCollabInvite", { worldID, collabID });
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
    } else {
      return "success";
    }
  };

  acceptCollabInvite = async (worldID, collabID) => {
    if (this.real) {
      const response = await this.patchData("/api/world/acceptCollabInvite", { worldID, collabID });
      const retry = async () => {
        await this.relogin();
        const response = await this.patchData("/api/world/acceptCollabInvite", { worldID, collabID });
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
    } else {
      return "success";
    }
  };

  acceptCollabRequest = async (worldID, collabID) => {
    if (this.real) {
      const response = await this.patchData("/api/world/acceptCollabRequest", { worldID, collabID });
      const retry = async () => {
        await this.relogin();
        const response = await this.patchData("/api/world/acceptCollabRequest", { worldID, collabID });
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
    } else {
      return "success";
    }
  };

  selectWorld = async (worldID) => {
    if (this.real) {
      const response = await this.postData("/api/world/selectWorld", { worldID: worldID });
      const retry = async () => {
        await this.relogin();
        const response = await this.postData("/api/world/selectWorld", { worldID: worldID });
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
    } else {
      return "success";
    }
  };

  // Attribute
  getAttributesForWorld = async (worldID, refresh = false) => {
    if (refresh) {
      return this.getAttributesForWorldFromAPI(worldID);
    }
    else {
      const data = this.getSessionData(`attributes_${worldID}`);
      if (data !== null) {
        return data;
      }
      else {
        return this.getAttributesForWorldFromAPI(worldID);
      }
    }
  };
  getAttributesForWorldFromAPI = async (worldID) => {
    if (this.real) {
      const response = await this.fetchData(
        `/api/world/getAttributesForWorld/${worldID}`
      );
      const retry = async () => {
        await this.relogin();
        const response = await this.fetchData(
          `/api/world/getAttributesForWorld/${worldID}`
        );
        return this.processResponse(response, null, `attributes_${worldID}`);
      }
      return this.processResponse(response, retry, `attributes_${worldID}`);
    } else {
      return [{ _id: -1, worldID: -1, Name: "Character" }];
    }
  };

  getAttribute = async (worldID, attrID) => {
    if (this.real) {
      const response = await this.fetchData(
        `/api/world/getAttribute/${worldID}/${attrID}`
      );
      const retry = async () => {
        await this.relogin();
        const response = await this.fetchData(
          `/api/world/getAttribute/${worldID}/${attrID}`
        );
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
    } else {
      return {
        _id: -1,
        worldID: -1,
        Name: "Character",
        Description: "",
        // AttributesArr: {},
        Attributes: {}
      };
    }
  };

  createAttribute = async (attribute) => {
    if (this.real) {
      const response = await this.postData("/api/world/createAttribute", { attribute: attribute });
      const retry = async () => {
        await this.relogin();
        const response = await this.postData("/api/world/createAttribute", { attribute: attribute });
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
    } else {
      return -1;
    }
  };

  // deleteAttribute = async (worldID, attrID) => {
  //   if (this.real) {
  //     const response = await this.deleteData("/api/world/deleteAttribute", { worldID: worldID, attrID: attrID });
  //     return this.processResponse(response);
  //   } else {
  //     return "success";
  //   }
  // };

  // updateAttribute = async (attribute) => {
  //   if (this.real) {
  //     const response = await this.patchData("/api/world/updateAttribute", { attribute: attribute });
  //     return this.processResponse(response);
  //   } else {
  //     return "success";
  //   }
  // };

  upsertAttributes = async (worldID, attributes) => {
    if (this.real) {
      const response = await this.patchData("/api/world/upsertAttributes", { worldID, attributes: attributes });
      const retry = async () => {
        await this.relogin();
        const response = await this.patchData("/api/world/upsertAttributes", { worldID, attributes: attributes });
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
    } else {
      return "success";
    }
  };
  // Type
  getTypesForWorld = async (worldID, refresh = false) => {
    if (refresh) {
      return this.getTypesForWorldFromAPI(worldID);
    }
    else {
      const data = this.getSessionData(`types_${worldID}`);
      if (data !== null) {
        return data;
      }
      else {
        return this.getTypesForWorldFromAPI(worldID);
      }
    }
  };
  getTypesForWorldFromAPI = async (worldID) => {
    if (this.real) {
      const response = await this.fetchData(
        `/api/world/getTypesForWorld/${worldID}`
      );
      const retry = async () => {
        await this.relogin();
        const response = await this.fetchData(
          `/api/world/getTypesForWorld/${worldID}`
        );
        return this.processResponse(response, null, `types_${worldID}`);
      }
      return this.processResponse(response, retry, `types_${worldID}`);
    } else {
      return [{ _id: -1, worldID: -1, Name: "Character" }];
    }
  };

  getType = async (worldID, typeID) => {
    if (this.real) {
      const response = await this.fetchData(
        `/api/world/getType/${worldID}/${typeID}`
      );
      const retry = async () => {
        await this.relogin();
        const response = await this.fetchData(
          `/api/world/getType/${worldID}/${typeID}`
        );
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
    } else {
      return {
        _id: -1,
        worldID: -1,
        Name: "Character",
        Description: "",
        // AttributesArr: {},
        Attributes: {}
      };
    }
  };

  createType = async (type) => {
    if (this.real) {
      const response = await this.postData("/api/world/createType", { type: type });
      const retry = async () => {
        await this.relogin();
        const response = await this.postData("/api/world/createType", { type: type });
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
    } else {
      return -1;
    }
  };

  deleteType = async (worldID, typeID) => {
    if (this.real) {
      const response = await this.deleteData("/api/world/deleteType", { worldID: worldID, typeID: typeID });
      const retry = async () => {
        await this.relogin();
        const response = await this.deleteData("/api/world/deleteType", { worldID: worldID, typeID: typeID });
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
    } else {
      return "success";
    }
  };

  updateType = async (type) => {
    if (this.real) {
      const response = await this.patchData("/api/world/updateType", { type: type });
      const retry = async () => {
        await this.relogin();
        const response = await this.patchData("/api/world/updateType", { type: type });
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
    } else {
      return "success";
    }
  };

  // Thing
  getThingsForWorld = async (worldID, refresh = false) => {
    if (refresh) {
      return this.getThingsForWorldFromAPI(worldID);
    }
    else {
      const data = this.getSessionData(`things_${worldID}`);
      if (data !== null) {
        return data;
      }
      else {
        return this.getThingsForWorldFromAPI(worldID);
      }
    }
  };
  getThingsForWorldFromAPI = async (worldID) => {
    if (this.real) {
      const response = await this.fetchData(
        `/api/world/getThingsForWorld/${worldID}`
      );
      const retry = async () => {
        await this.relogin();
        const response = await this.fetchData(
          `/api/world/getThingsForWorld/${worldID}`
        );
        return this.processResponse(response, null, `things_${worldID}`);
      }
      return this.processResponse(response, retry, `things_${worldID}`);
    } else {
      return [{ _id: -1, worldID: -1, Name: "Alice" }];
    }
  };

  getThing = async (worldID, thingID) => {
    if (this.real) {
      const response = await this.fetchData(`/api/world/getThing/${worldID}/${thingID}`);
      const retry = async () => {
        await this.relogin();
        const response = await this.fetchData(`/api/world/getThing/${worldID}/${thingID}`);
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
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
      const retry = async () => {
        await this.relogin();
        const response = await this.postData("/api/world/createThing", { thing: thing });
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
    } else {
      return -1;
    }
  };

  deleteThing = async (worldID, thingID) => {
    if (this.real) {
      const response = await this.deleteData("/api/world/deleteThing", { worldID: worldID, thingID: thingID });
      const retry = async () => {
        await this.relogin();
        const response = await this.deleteData("/api/world/deleteThing", { worldID: worldID, thingID: thingID });
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
    } else {
      return "success";
    }
  };

  updateThing = async (thing) => {
    if (this.real) {
      const response = await this.patchData("/api/world/updateThing", { thing: thing });
      const retry = async () => {
        await this.relogin();
        const response = await this.patchData("/api/world/updateThing", { thing: thing });
        return this.processResponse(response);
      }
      return this.processResponse(response, retry);
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
