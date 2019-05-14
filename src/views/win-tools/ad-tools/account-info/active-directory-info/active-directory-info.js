import Vue from "vue"
import {
  Component,
  Watch
} from "vue-property-decorator";

@Component({
  name: 'active-directory-info',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'CommonExtensions'],
  props: ['data']
})

export default class ActiveDirectoryInfo extends Vue {
  async mounted() {
    this.toastService.set(this);
  }

  isEmpty(value) {
    const moment = this.moment;

    if (this.CommonExtensions.isDate(value)) {
      if (moment(value).year() < 1900) {
        return true;
      }
      return false;
    }

   return false;
  }
}