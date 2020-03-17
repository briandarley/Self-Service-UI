import {
  BaseValidateMixin
} from "./../../../../../components/mixins/index";
import { Component, Watch } from "vue-property-decorator";

@Component({
    name: 'basic-information',
    dependencies: ['$','moment','toastService','spinnerService','MassMailService','ScreenReaderAnnouncerService'],
    props: ['value']
  })

export default class BasicInformation extends BaseValidateMixin {
  
  campaignId = null;
  defaultMailAddress = "no_reply@email.unc.edu";
  model ={};
  // model = {
  //   sendFrom: "",
  //   expirationDate: null,
  //   sendDate: null,
  //   replyTo: "",
  //   subject: "",
  //   sponsoringUniversity: "",
  //   priority: ""
  // }
  @Watch('model', {immediate:false, deep: true})
  onModelChanged(newValue)
  {
    this.$emit('input', newValue);
  }
  @Watch('value', {immediate: true, deep: true})
  onValueChanged(newValue){

    if(Array.isArray(newValue.comments)){
      let initialComment = newValue.comments.find(c=> c.commentTypeCode === "INITIAL_AUTH_COMMENT");
      if(initialComment)
      {
        newValue.comments =   initialComment;
      }
      else{
        newValue.comments = "";
      }
    }
    this.model = newValue;
  }
  async mounted() {
    this.toastService.set(this);
    this.campaignId = this.$route.params.id;
    await this.loadDepartments();
    
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Mass Mail Basic Information");
  }
  
  onSendDateChanged(value){
    const moment = this.moment;
    let sendDate =  moment(value, ['MM/DD/YYYY', 'M/D/YYYY']).add(3, 'day');
    
    if(sendDate.isSameOrAfter(this.model.expirationDate))
    {
      this.model.expirationDate = sendDate.format("MM/DD/YYYY")
    }
  }
  
  async loadDepartments() {
    try {
      this.spinnerService.show();
      let entities = await this.MassMailService.getDepartments()
      this.departments = entities;

    } catch (e) {
      window.console.log(e);
      this.toasterService.error('Failed to retrieve departments');
    } finally {
      this.spinnerService.hide();
    }
  }

  async getSchoolsDepartmentsLike(query, _, asyncResults) {

    try {
      //let departments =JSON.parse(JSON.stringify(this.departments));
      return new Promise(result => {
        setTimeout(() => {
          let filteredRecords = this.departments.filter(item => {
            let includes = item.name.toUpperCase().includes(query.toUpperCase())
            return  includes;
          } ).map(c => c.name);
            //return  includes;

          result(
            asyncResults(
              filteredRecords
            //   departments.filter(item => {
            //   let includes = item.name.toUpperCase().includes(query.toUpperCase())
            //   return  includes;
            
            // }
            
            //).map(c => c.name)

          ));

        }, 250);
      });



    } catch (e) {
      window.console.log(e);
    }

  }

  onSponsorChanged(value) {
    this.model.sponsoringUniversity = value;
  }

  onBroadcastModelChange() {

    //prevent over doing it with change events
    window.clearTimeout(this.changeTimer);
    this.changeTimer = setTimeout(() => {
      this.$emit('model-changed', this.model)

    }, 500);

    setTimeout(() => {
        if (this.model.errors) {
          //if the model was previously initialized, i.e. model.errors, then re-validate
          //this is required because date-picker sets the form to 'needs-validation' which is not desired
          this.validate(this.$refs.submitForm);
        }
      },
      100);


  }

  isValid() {
    let errors = this.validate(this.$refs.submitForm); 
    if(!errors || !errors.length) return true;
    return false;
  }
  
}

