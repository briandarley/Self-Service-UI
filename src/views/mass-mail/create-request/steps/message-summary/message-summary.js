import {
  BaseValidateMixin
} from "./../../../../../components/mixins/index";
import {
  Component,
  Watch
} from "vue-property-decorator";


@Component({
  name: 'message-summary',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'ScreenReaderAnnouncerService'],
  props: ['value'],
  filters: {
    formatSender(value) {
      if (!value)
        return "no-reply@email.unc.edu";
      return value;
    },
    formatSendingCriteria(value) {
      switch (value) {
        case "STUDENTS":
          return "Students";
        case "EMPLOYEES":
          return "Employees";
        case "FACULTY":
          return "Faculty";
        case "EMPLOYEES_STUDENTS":
          return "Employees and Students";
      }
      
    },
    formatEmployeeCriteria(value) {
      if(value){
        return "/ " + value;
      }
      return "";
    }
  }
})

export default class MessageSummary extends BaseValidateMixin {
  model = {

  }

  @Watch('model', {
    immediate: false,
    deep: true
  })
  onModelChanged(newValue) {
    this.$emit('input', newValue);
  }
  @Watch('value', {
    immediate: true,
    deep: true
  })
  onValueChanged(newValue) {
    this.model = newValue;
  }

  async mounted() {
    this.toastService.set(this);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Mass Mail Message Summary");
  }

  

  isValid() {
    let errors = [];

    if (!this.model.subject) {
      errors.push("Subject empty");
    }
    if (!this.model.sendDate) {
      errors.push("Send Date required");
    }
    if (!this.model.expirationDate) {
      errors.push("Expiration Date required");
    }
    if (!this.model.sponsoringUniversity) {
      errors.push("Sponsoring University required");
    }
    if (!this.model.priority) {
      errors.push("Priority required");
    }
    if (!this.model.targetPopulation) {
      errors.push("Target population required");
    }

    if (this.model.targetPopulation === "EMPLOYEES" || this.model.targetPopulation === "EMPLOYEES_STUDENTS") {
      if (!this.model.targetEmployee) {
        errors.push("Employee criteria required");
      }


    }

    if (errors.length) {
      return false;
    }

    return true;



  }
}