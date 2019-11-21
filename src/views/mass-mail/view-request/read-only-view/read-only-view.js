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

    this.formatContent();

    await this.getComments();
  }

  formatContent(){
    const $ = this.$;
    if (this.model && this.model.content) {
      
      let html = $(this.model.content.content);
      let images = html.find("img");

      //if images are greater than 600, the preview will crop the image, 
      //set image to 100% if that happens
      images.each((_, img) => {
        let width = $(img).width() || img.width;
        if(width >= 600){
          $(img).width("100%");
        }
        width = width || img.width;
        
        if((width/600)*100 > 60){
          $(img).css('margin-left', 'auto');
          $(img).css('margin-right', 'auto');
        }
        
      });
      this.model.content.content = html.get().map(function(v){return v.outerHTML}).join('');
      
    }
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