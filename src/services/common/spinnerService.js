import injector from 'vue-inject';


function spinnerService() {
  return {
    onShowSpinner: null,
    onHideSpinner: null,
    onToggleSpinner: null,
    show() {
     if (this.onShowSpinner) {
        this.onShowSpinner();
      }
    },
    hide() {
      if (this.onHideSpinner) {
        this.onHideSpinner();
      }
    },
    toggle() {
      if (this.onToggleSpinner) {
        this.onToggleSpinner();
      }
    }
  }
}

injector.service('spinnerService', spinnerService);
