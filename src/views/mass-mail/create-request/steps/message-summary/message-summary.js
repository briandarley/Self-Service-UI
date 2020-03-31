import {
  BaseValidateMixin
} from "./../../../../../components/mixins/index";
import {
  Component,
  Watch
} from "vue-property-decorator";
import TestMessages from './test-messages/test-messages.vue';




@Component({
  name: 'message-summary',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'ScreenReaderAnnouncerService'],
  components: {
    TestMessages
  },
  props: ['value'],
  filters: {
    formatSender(value) {
      if (!value)
        return "no-reply@email.unc.edu";
      return value;
    },
   
    formatEmployeeCriteria(value) {
      if (value) {
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
    const $ = this.$;
    
    if (this.model) {
      let html = $(this.model.content);
      let images = html.find("img");

      //if images are greater than 600, the preview will crop the image, 
      //set image to 100% if that happens
      images.each((_, img) => {
        
        if($(img).width() >= 600){
          $(img).width("100%");
        }
        
      });
      this.model.content = html.get().map(function(v){return v.outerHTML}).join('');
      
    }

  }

  async mounted() {
    
    this.toastService.set(this);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Mass Mail Message Summary");
  }

  showPreview() {
    this.$refs.confirmPreview.show();
  }

  closePreview() {
    this.$refs.confirmPreview.hide();
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
      errors.push("Sponsoring Office required");
    }
    if (!this.model.priority) {
      errors.push("Priority required");
    }
    if (!this.model.targetPopulation) {
      errors.push("Target population required");
    }

    if (this.model.targetPopulation != null) {
      if(this.model.targetPopulation.includes("EMPLOYEES"))
      {
        if (!this.model.targetEmployee) {
          errors.push("Employee criteria required");
        }
      }


    }

    if (errors.length) {
      return false;
    }

    return true;



  }
}