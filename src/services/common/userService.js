import injector from "vue-inject";
import * as Oidc from "oidc-client";

var console = window.console;

function UserService(
  configReaderService,
  localStorageService,
  routerService,
  axios
) {
  return {
    _user: null,
    _mgr: null,
    _logoutTimeOut: null,
    getUserName() {
      if (!this._user) return null;
      return this._user.profile.name;
    },
    isInRole(role) {
      if (!this._user) {
        return false;
      }
      if (!this._user.profile.role || this._user.profile.role.length === 0) {
        return false;
      }

      let userRoles = [];
      if (Array.isArray(this._user.profile.role)) {
        userRoles = this._user.profile.role.map((c) => c.toUpperCase());
      } else {
        userRoles.push(this._user.profile.role.toUpperCase());
      }

      if (userRoles.indexOf(role.toUpperCase()) > -1) {
        return true;
      }
      //BD temporarily removed
      //const systemRoles = userRoles.filter(c => c.mapedName.toUpperCase() === role.toUpperCase());
      //const rolesIsAMemberOf = systemRoles[0].roles.filter((c) => userRoles.some(d => c.toUpperCase() === d));

      //if (rolesIsAMemberOf.length > 0) {
      // return true;
      //}

      switch (role.toUpperCase()) {
        case "ADMIN":
          return userRoles.some((c) => c === "ITS_IDM USERS");
        case "HELP_DESK":
          return (
            userRoles.some((c) => c === "ITS_IDM USERS") ||
            userRoles.some((c) => c === "ITS_WSP-ACCESS-HELPDESKUSERS") ||
            userRoles.some((c) => c === "ITS_WSP-ACCESS-HELPDESKPOSTMASTERS") ||
            userRoles.some((c) => c === "ITS_WSP-ACCESS-HELPDESKMANAGERS")
          );
        case "MASSMAIL_ADMIN":
          return userRoles.some(
            (c) => c === "ITS_WSP-ACCESS-MASSMAIL-ADMINISTRATORS"
          );
        case "MASSMAIL_STUDENT_APPROVER":
          return userRoles.some(
            (c) => c === "ITS_WSP-ACCESS-MASSMAIL-APPROVERS_STUDENTS"
          );
        case "MASSMAIL_EMPLOYEE_APPROVER":
          return userRoles.some(
            (c) => c === "ITS_WSP-ACCESS-MASSMAIL-APPROVERS_EMPLOYEES"
          );
        case "MASSMAIL_APPROVER":
          return userRoles.some(
            (c) => c === "ITS_WSP-ACCESS-MASSMAIL-APPROVER"
          );
      }

      return false;
    },
    async _initializeManager() {
      try {
        if (!this._mgr) {
          const address = await configReaderService.getConfigurationSetting(
            "security"
          );

          this._mgr = new Oidc.UserManager(address);

          //Todo: If expiring do we need to do anything? redirect to shib?
          this._mgr.events.addAccessTokenExpiring(() => {});
        }
      } catch (e) {
        console.log(e);
      }
    },
    async login() {
      this._initializeManager();
      let uid = "";
      if (location.hostname !== "localhost") {
        const handler = axios.create();

        try {
          let response = await handler.get(
            `${window.location.protocol}//${
              window.location.hostname
            }/Shibboleth.sso/Session`
          );
          let data = response.data;
          let index = data.indexOf("<strong>uid</strong>: ")
          data = data.substring(index + "<strong>uid</strong>: ".length)
          index = data.indexOf("</pre>");
          data = data.substring(0, index);
          uid = data;
          console.log(data);
        } catch (e) {
          console.log(e);
        }
      }

      this._mgr.clearStaleState(null).then(() => {
        const args = {uid:uid};
        this._mgr.signinRedirect(args);
      });
    },
    async logout() {
      await this._initializeManager();

      let user = await this._mgr.getUser();

      await this._mgr.removeUser();

      await this._mgr.signoutRedirect({
        id_token_hint: user.id_token,
      });

      this._mgr.clearStaleState();
    },

    async get() {
      try {
        await this._initializeManager();

        this._user = await this._mgr.getUser();

        if (!this._user) {
          localStorageService.set(
            "current-path",
            routerService.router.history.current.path
          );
          this.login();
          return null;
        }

        this.expireDate = new Date(this._user.expires_at * 1000);

        let currentTime = new Date().getTime();
        let expiryTime = this._user.expires_at * 1000;

        let expiresIn = expiryTime - currentTime;
        if (this._logoutTimeOut) {
          clearTimeout(this._logoutTimeOut);
        }

        this._logoutTimeOut = setTimeout(async () => {
          await this.logout();
        }, expiresIn);

        //let user = (await this.UserService.get());

        //this.authTime = new Date(user.profile.auth_time * 1000).toLocaleString("en-US", {timeZone: "America/New_York"});
        //this.expiresAt = new Date(user.expires_at * 1000).toLocaleString("en-US", {timeZone: "America/New_York"});

        if (this._user.expires_at < new Date().getTime() / 1000) {
          await this.logout();
          this.login();
        }

        return this._user;
      } catch (e) {
        console.log(e);
      }
    },
  };
}

//injector.service('UserService', ['ConfigReaderService', 'localStorageService', 'routerService'], UserService);
injector.service(
  "UserService",
  ["ConfigReaderService", "localStorageService", "routerService", "axios"],
  UserService
);
