import injector from 'vue-inject';


function toastService() {
  return {
    module: null,
    set(module) {
      this.module = module;
    },

    warn(msg) {
      this.module.$root.$refs.toastr.w("warning", msg);
    },
    success(msg) {
      this.module.$root.$refs.toastr.s("success", msg);
    },
    info(msg) {
      this.module.$root.$refs.toastr.i("information", msg);
    },
    error(msg) {
      this.module.$root.$refs.toastr.e("error", msg);
    }
  }
}

injector.service('toastService', toastService);
