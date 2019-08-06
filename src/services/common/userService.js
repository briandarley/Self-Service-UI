import injector from 'vue-inject';
import * as Oidc from 'oidc-client';

var console = window.console;

function UserService(configReaderService, localStorageService, routerService) {
    return {
        _user: null,
        _mgr: null,

        isInRole(role) {
            if (!this._user) {
                return false;
            }
            if (!this._user.profile.role || this._user.profile.role.length === 0) {
                return false;
            }

            let userRoles = [];
            if (Array.isArray(this._user.profile.role)) {
                userRoles = this._user.profile.role.map(c => c.toUpperCase());
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
                    return userRoles.some(c => c === "ITS_IdM Users")
                case "HELP_DESK":
                    return userRoles.some(c => c === "ITS_IdM Users") ||
                        userRoles.some(c => c === "ITS_WSP-Access-HelpdeskUsers") ||
                        userRoles.some(c => c === "ITS_WSP-Access-HelpdeskPostmasters") ||
                        userRoles.some(c => c === "ITS_WSP-Access-HelpdeskManagers");


            }


            return false;

        },
        async _initializeManager() {
            try {
                if (!this._mgr) {



                    const address = await configReaderService.getConfigurationSetting("security");

                    this._mgr = new Oidc.UserManager(address);
                }
            } catch (e) {
                console.log(e);
            }
        },
        login() {
            this._initializeManager();

            this._mgr.clearStaleState(null).then(() => {
                const args = {};
                this._mgr.signinRedirect(args);
            });


        },
        async logout() {
            await this._initializeManager();

            let user = await this._mgr.getUser();

            await this._mgr.signoutRedirect({
                'id_token_hint': user.id_token
            })
            this._mgr.removeUser();
            this._mgr.clearStaleState();
        },
        async get() {
            try {
                await this._initializeManager();

                this._user = await this._mgr.getUser();


                if (!this._user) {
                    localStorageService.set('current-path', routerService.router.history.current.path);
                    this.login();
                }

                this.expireDate = new Date(this._user.expires_at * 1000);

                if (this._user.expires_at < new Date().getTime() / 1000) {
                    this.logout();
                    this.login();
                }

                return this._user;
            } catch (e) {
                console.log(e);
            }
        }
    }
}

//injector.service('UserService', ['ConfigReaderService', 'localStorageService', 'routerService'], UserService);
injector.service('UserService', ['ConfigReaderService', 'localStorageService', 'routerService'], UserService);