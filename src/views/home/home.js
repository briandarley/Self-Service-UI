import Vue from "vue"
import {
  Component
} from "vue-property-decorator";


@Component({
  name: 'home',
  dependencies: ['$', 'toastService', 'spinnerService', 'ScreenReaderAnnouncerService']
})

export default class Home extends Vue {
  async mounted() {
    this.toastService.set(this);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Self Service Home");
  }
}