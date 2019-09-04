import Vue from "vue"
import { Component,Watch } from "vue-property-decorator";
import {CountUp} from 'countup.js';
@Component({
    name: 'audience-criteria',
    dependencies: ['$','moment','toastService','spinnerService','MassMailService','ScreenReaderAnnouncerService'],
    props: ['value']
  })

export default class AudienceCriteria extends Vue {
  model = {
    targetPopulation: "",
    employeeCriteria: ""
    
  }
  onyen = "";
  audienceSizeModel = {};
  targetPerson = null;
  audienceSize = 0;
  checkUserSuccess = null;
  showEmployeeCriteria = false;

  checkIsValid(){
    
  }

  

  @Watch('model', {immediate:false, deep: true})
  onModelChanged(newValue)
  {
    this.$emit('input', newValue);
  }
  @Watch('value', {immediate: true, deep: true})
  onValueChanged(newValue){
    this.model = newValue;
  }





  async checkUser() {
    this.checkUserSuccess = false;
    if (!this.targetPerson) {
      return;
    }
    let person = {};
    try {
      person = await this.audienceCriteriaService.checkIfUserExists(this.targetPerson);
    } catch (e) {
      return;
    }


    switch (this.model.targetPopulation) {
      case "STUDENTS":
        this.checkUserSuccess = person.student;
        break;
      case "EMPLOYEES":
        this.checkUserSuccess = person.employee;
        break;
      case "EMPLOYEES_STUDENTS":
        this.checkUserSuccess = person.student || person.employee;
        break;
    }



    if (this.model.employeeCriteria === "DDD") {
      this.checkUserSuccess = this.checkUserSuccess && person.ddd;
    }

    if (this.model.priority === "Informational") {
      this.checkUserSuccess = this.checkUserSuccess && person.massemailallowed;
    }

    if (person && !this.checkUserSuccess) {
      this.inializeMessageDialog("messageDialog",
        "Person Found",
        "Person found but the person indicated does not meet the criteria selected");
      this.dialogService.show();

      this.checkUserSuccess = false;
    }



  }

  clearCheckUserStatus() {
    this.checkUserSuccess = null;
  }
  async calculateAudience() {
    
    this.showEmployeeCriteria = this._showEmployeeCriteria();
    this.audienceSize = 0;
    if (this.model.employeeCriteria === "DDD") {
      this.audienceSize = await this._getCalculatedDddAudienceCount();
    } else {
      this.audienceSize = await this._getCalculatedTargetAudienceCount();
    }

    if (this.model.targetPopulation === "STUDENTS") {
      this.model.employeeCriteria = "";
    }


    const easingFn = function (t, b, c, d) {
      const ts = (t /= d) * t;
      const tc = ts * t;
      return b + c * (tc + -3 * ts + 3 * t);
    };
    const options = {
      useEasing: true,
      easingFn: easingFn,
      useGrouping: true,
      separator: ',',
      decimal: '.',
    };

    const couter = new CountUp('targetAudience', this.audienceSize, 0, 1.5, options);

    if (!couter.error) {
      couter.start();
    } else {
      window.console.error(couter.error);
    }


  }

  async _getCalculatedTargetAudienceCount() {

    let audienceSize, property;




    switch (this.model.targetPopulation) {

      case "STUDENTS":
        property = this.model.priority === "Formal Notice" ? "totalStudents" : "massMailAllowedStudents";
        audienceSize = this.audienceSizeModel[property];
        break;
      case "EMPLOYEES":
        property = this.model.priority === "Formal Notice" ? "totalEmployees" : "massMailAllowedEmployees";
        audienceSize = this.audienceSizeModel[property];
        break;
      case "EMPLOYEES_STUDENTS":

        property = this.model.priority === "Formal Notice" ? "totalStudents" : "massMailAllowedStudents";
        audienceSize = this.audienceSizeModel[property];
        property = this.model.priority === "Formal Notice" ? "totalEmployees" : "massMailAllowedEmployees";
        audienceSize += this.audienceSizeModel[property];
        break;
      default:
        audienceSize = 0;
    }

    return audienceSize;

  }

  _showEmployeeCriteria() {
    switch (this.model.targetPopulation) {
      case "EMPLOYEES":
      case "EMPLOYEES_STUDENTS":
        return true;
      default:
        return false;
    }
  }

  async _getCalculatedDddAudienceCount() {
    if (this.model.targetPopulation === "TESTING_ONLY") {
      return 0;
    }

    if (this.model.priority === "Formal Notice") {
      return this.audienceSizeModel["totalDddUsers"];
    } else {
      return this.audienceSizeModel["massMailAllowedDdd"];
    }

  }

  async initializeAudienceSize() {

    const $ = this.$;
    this.audienceSize = 0;
    if (this.model.employeeCriteria === "DDD") {
      this.audienceSize = await this._getCalculatedDddAudienceCount();
    } else {
      this.audienceSize = await this._getCalculatedTargetAudienceCount();
    }
    const audienceSize = this.$options.filters.formatNumber(this.audienceSize);

    $("#targetAudience").html(audienceSize);

  }

  async mounted() {
    this.toastService.set(this);

    this.audienceSizeModel = await this.MassMailService.getMassMailAudienceTotals();
    this.showEmployeeCriteria = this._showEmployeeCriteria();

    this.initializeAudienceSize();

    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Mass Mail Audience Criteria");

  }
}

