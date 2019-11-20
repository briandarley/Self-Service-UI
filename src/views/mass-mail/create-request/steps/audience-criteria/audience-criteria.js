import {
  BaseValidateMixin
} from "./../../../../../components/mixins/index";
import {
  Component,
  Watch
} from "vue-property-decorator";
import {
  CountUp
} from 'countup.js';
@Component({
  name: 'audience-criteria',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'MassMailService', 'ScreenReaderAnnouncerService'],
  props: ['value']
})

export default class AudienceCriteria extends BaseValidateMixin {
  audienceCheckResult = "";
  validationErrors = [];
  model = {
    targetPopulation: "",
    employeeCriteria: "",
    targetEmployee: "",
  }
  onyen = "";
  audienceSizeModel = {};
  targetPerson = null;
  audienceSize = 0;
  checkUserSuccess = null;
  showEmployeeCriteria = false;

  checkIsValid() {

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

    if(this.model.id){
//this.calculateAudience();
    }
    
  }


  async checkUser() {
    try {
      this.validationErrors = [];
      this.spinnerService.show();
      this.checkUserSuccess = false;

      if (!this.onyen) {
        this.toastService.error("Invalid Onyen entered");
        return;
      }
      let person = {};
      person = await this.MassMailService.checkIfUserExists(this.onyen);
      if (person.status === false) {
        this.toastService.error("Could not locate user");
        return;
      }
      let targetPopulation = "";
      switch (this.model.targetPopulation) {
        case "STUDENTS":
          this.checkUserSuccess = person.student;
          targetPopulation = "Students";
          break;
        case "EMPLOYEES":
          this.checkUserSuccess = person.employee;
          targetPopulation = "Employees";
          break;
        case "FACULTY":
          this.checkUserSuccess = person.faculty;
          targetPopulation = "Faculty";
          break;
        case "EMPLOYEES_STUDENTS":
          this.checkUserSuccess = person.student || person.employee;
          targetPopulation = "Employees and Students";
          break;
      }

      if(!this.checkUserSuccess){
        this.validationErrors.push(`Population ${targetPopulation}, user does not meet this criteria`);
      }


      if (this.model.targetEmployee === "DDD") {
        this.checkUserSuccess = this.checkUserSuccess && person.dddEntry;
        if(!person.dddEntry)
        {
          this.validationErrors.push(`DDD criteria selected, user does not meet this criteria`);
        }
      }

      if (this.model.priority === "Informational") {
        this.checkUserSuccess = this.checkUserSuccess && person.massEmailAllowed;
        if(!person.massEmailAllowed)
        {
          this.validationErrors.push(`Campaign type is 'Informational', however; entered user has MassEmail flag set to false`);
        }
      }

      if (person && !this.checkUserSuccess) {
        this.audienceCheckResult = "Person found but the person does not meet the criteria specified";
        this.$refs.confirmCheckUser.show();
        this.checkUserSuccess = false;
        return;
      }
      else if (person) {
        this.toastService.success("Verified user within selected audience");
        return;
      }


    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to retrieve user');
    } finally {
      this.spinnerService.hide();
    }



  }


  closeConfirmCheckUser(){
    this.$refs.confirmCheckUser.hide();
  }

  clearCheckUserStatus() {
    this.checkUserSuccess = null;
  }
  async targetPopulationChanged() {
    this.model.targetEmployee = "";
    if(this.model.targetPopulation === "EMPLOYEES_STUDENTS")
    {
      this.model.targetEmployee = "All Employees"
    }
    
    await this.calculateAudience();
  }

  async employeeCriteriaChanged() {
    await this.calculateAudience();
  }

  async calculateAudience() {
    this.audienceSize = 0;
    this.showEmployeeCriteria = this._showEmployeeCriteria();

    if (this.model.targetEmployee === "DDD") {
      this.audienceSize = await this._getCalculatedDddAudienceCount();
    } else {
      this.audienceSize = await this._getCalculatedTargetAudienceCount();
    }

    if (this.model.targetPopulation === "STUDENTS") {
      this.model.targetEmployee = "";
    }


    this._beginCounterAnnimation();


  }

  _beginCounterAnnimation() {
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
    if (this.model.targetEmployee === "DDD") {
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

  isValid(){
    let errors = this.validate(this.$refs.submitForm); 
    if(!errors || !errors.length) return true;
    return false;
  }
}