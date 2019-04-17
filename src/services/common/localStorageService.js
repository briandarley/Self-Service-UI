import injector from 'vue-inject';

function localStorageService() {
  return {
    set: (param, value) => {
      localStorage.setItem(`self-service: ${param}`, JSON.stringify(value));
    },
    get: (param) => {
      return JSON.parse(localStorage.getItem(`self-service: ${param}`));
    },
    remove(param) {
      localStorage.removeItem(`self-service: ${param}`);
    },


    sessionSet: (param, value) => {
      sessionStorage.setItem(`self-service: ${param}`, JSON.stringify(value));
    },
    sessionGet: (param) => {
      return JSON.parse(sessionStorage.getItem(`self-service: ${param}`));
    },
    sessionRemove(param) {
      sessionStorage.removeItem(`self-service: ${param}`);
    }

    
  }
}

injector.service('localStorageService', localStorageService);
