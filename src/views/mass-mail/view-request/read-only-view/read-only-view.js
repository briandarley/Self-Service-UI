import Vue from "vue"
import {
  Component,
  Watch
} from "vue-property-decorator";

@Component({
  name: 'read-only-view',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'MassMailService'],
  props: ['campaign'],
  filters: {
    defaultNoReplyIfEmpty(value) {
      if (!value) return "no_reply@unc.edu";
      return value;
    }


  }


})

export default class ReadOnlyView extends Vue {

  model = {}
  comments = [];

  @Watch('campaign', {
    immediate: true
  })
  async onCampaignChanged(newValue) {

    this.model = newValue;
    if(newValue == null) return;
    await this.getComments();
  }

  async mounted() {
    this.toastService.set(this);
  }

  async getComments() {
    try {
      this.spinnerService.show();

      this.comments = await this.MassMailService.getComments(this.model.id);

    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to retrieve comments');
    } finally {
      this.spinnerService.hide();
    }
  }

  hasAllEmployees() {
    if (!this.model || !this.model.targetEmployee) return false;
    return this.model.targetEmployee.indexOf("All Employees") > -1
  }

  hasEmployeePopulation() {
    if (!this.model || !this.model.targetPopulation) return false;
    return this.model.targetPopulation.indexOf("EMPLOYEE") > -1

  }

  hasStudentPopulation() {
    if (!this.model || !this.model.targetPopulation) return false;
    return this.model.targetPopulation.indexOf("STUDENT") > -1

  }
}