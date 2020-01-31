import injector from 'vue-inject';


function toastService(ScreenReaderAnnouncerService) {
  return {
    module: null,
    set(module) {
      this.module = module;
    },

    warn(msg) {
      this.module.$root.$refs.toastr.w("warning", msg);
      ScreenReaderAnnouncerService.sendAnnouncement(`Operation Warning, ${msg}`)
      setTimeout(()=> {
        ScreenReaderAnnouncerService.clear();
      },500)
    },
    success(msg) {
      this.module.$root.$refs.toastr.s("success", msg);
      ScreenReaderAnnouncerService.sendAnnouncement(`Operation Successful, ${msg}`)
      setTimeout(()=> {
        ScreenReaderAnnouncerService.clear();
      },500)
    },
    info(msg) {
      this.module.$root.$refs.toastr.i("information", msg);
      ScreenReaderAnnouncerService.sendAnnouncement(`Information Notice, ${msg}`)
      setTimeout(()=> {
        ScreenReaderAnnouncerService.clear();
      },500)
    },
    error(msg) {
      this.module.$root.$refs.toastr.e("error", msg);
      ScreenReaderAnnouncerService.sendAnnouncement(`Operation Failed, ${msg}`)
      setTimeout(()=> {
        ScreenReaderAnnouncerService.clear();
      },500)
    }
  }
}

injector.service('toastService', ['ScreenReaderAnnouncerService'], toastService);
