import Vue from "vue"
import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'action-menu',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService','UserService'],
  props: ['id', 'entity']
})

export default class ActionMenu extends Vue {

  get elmId() {
    if (!this.entity) return "not_set";
    return `action_menu_${this.entity.id}`;
  }
  async mounted() {
    this.toastService.set(this);
  }


  get isCanceled() {
    if(this.entity.campaignStatus == null) return true;

    if(this.entity.campaignStatus.status === "CANCELED") return true;

    return false;
  }

  get isActive() {
    if (!this.entity) return false;
    const moment = this.moment;

    if(this.isCanceled) return false;
    if(!this.entity.campaignStatus) return false;
    if(this.entity.campaignStatus.status === "APPROVED") return false;

    
    let isSameOrAfter = moment(new Date(this.entity.expirationDate)).isSameOrAfter(moment(), 'day')
    return isSameOrAfter;

  }

  get showContactAuthor() {
    //don't show contact author option if the user is the author
    return this.UserService.getUserName() !== this.entity.author;
  }

  action(method) {
    this.$emit("action", {
      action: method,
      entity: this.entity
    })
  }

}