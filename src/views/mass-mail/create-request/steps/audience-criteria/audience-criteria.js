import { BaseValidateMixin } from "./../../../../../components/mixins/index";
import { Component, Watch } from "vue-property-decorator";
import { CountUp } from "countup.js";
@Component({
  name: "audience-criteria",
  dependencies: [
    "$",
    "moment",
    "toastService",
    "spinnerService",
    "MassMailService",
    "ScreenReaderAnnouncerService"
  ],
  props: ["value"]
})
export default class AudienceCriteria extends BaseValidateMixin {
  audienceCheckResult = "";
  validationErrors = [];
  model = {
    targetPopulation: "",
    employeeCriteria: "",
    targetEmployee: ""
  };
  onyen = "";
  audienceSizeModel = {};
  targetPerson = null;
  audienceSize = 0;
  beginAudienceSize = 0;
  checkUserSuccess = null;
  showEmployeeCriteria = false;
  isToggled = false;
  audienceList = [
    {
      value: "ALL",
      checked: false
    },
    {
      value: "EMPLOYEES",
      checked: false
    },
    {
      value: "STUDENTS",
      checked: false
    },
    {
      value: "AFFILIATES",
      checked: false
    },
    {
      value: "TEST",
      checked: false
    }
  ];

  @Watch("model", {
    immediate: false,
    deep: true
  })
  onModelChanged(newValue) {
    this.$emit("input", newValue);
  }
  @Watch("value", {
    immediate: true,
    deep: true
  })
  onValueChanged(newValue) {
    this.model = newValue;
    
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

      this.checkUserSuccess = false;
      let checkedAudiences = [];
      this.audienceList.forEach(item => {
        if (item.checked == true) {
          switch (item.value) {
            case "ALL":
            case "TEST":
              break;
            case "EMPLOYEES":
              this.checkUserSuccess = this.checkUserSuccess || person.employee;
              checkedAudiences.push("Employees");
              break;
            case "STUDENTS":
              this.checkUserSuccess = this.checkUserSuccess || person.student;
              checkedAudiences.push("Students");
              break;
            case "AFFILIATES":
              this.checkUserSuccess = this.checkUserSuccess || person.affiliate;
              checkedAudiences.push("Affiliates");
              break;
            case "FACULTY":
              this.checkUserSuccess = this.checkUserSuccess || person.faculty;
              checkedAudiences.push("Faculty");
              break;
            default:
              throw "Unsuported Value";
          }
        }
      });

      if (!this.checkUserSuccess) {
        let list = checkedAudiences.join(",");

        this.validationErrors.push(
          `Population ${list}, user does not meet this criteria`
        );
      }

      if (this.model.targetEmployee === "DDD") {
        this.checkUserSuccess = this.checkUserSuccess && person.dddEntry;
        if (!person.dddEntry) {
          this.validationErrors.push(
            `DDD criteria selected, user does not meet this criteria`
          );
        }
      }

      if (this.model.priority === "Informational") {
        this.checkUserSuccess =
          this.checkUserSuccess && person.massEmailAllowed;
        if (!person.massEmailAllowed) {
          this.validationErrors.push(
            `Campaign type is 'Informational', however; entered user has MassEmail flag set to false`
          );
        }
      }

      if (person && !this.checkUserSuccess) {
        this.audienceCheckResult =
          "Person found but the person does not meet the criteria specified";
        this.$refs.confirmCheckUser.show();
        this.checkUserSuccess = false;
        return;
      } else if (person) {
        this.toastService.success("Verified user within selected audience");
        return;
      }
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve user");
    } finally {
      this.spinnerService.hide();
    }
  }

  closeConfirmCheckUser() {
    this.$refs.confirmCheckUser.hide();
  }

  clearCheckUserStatus() {
    this.checkUserSuccess = null;
  }

  async employeeCriteriaChanged() {
    await this.calculateAudience();
  }

  async calculateAudience() {
    this.beginAudienceSize = this.audienceSize;
    this.audienceSize = 0;

    this.showEmployeeCriteria = this._showEmployeeCriteria();

    if (this.model.targetEmployee === "DDD") {
      this.audienceSize = await this._getCalculatedDddAudienceCount();
    } else {
      this.audienceSize = await this._getCalculatedTargetAudienceCount();
    }

    this._beginCounterAnnimation();
  }

  _beginCounterAnnimation() {
    const easingFn = function(t, b, c, d) {
      const ts = (t /= d) * t;
      const tc = ts * t;
      return b + c * (tc + -3 * ts + 3 * t);
    };

    const options = {
      useEasing: true,
      easingFn: easingFn,
      useGrouping: true,
      separator: ",",
      decimal: ".",
      startVal: this.beginAudienceSize
    };

    const couter = new CountUp(
      "targetAudience",
      this.audienceSize,
      options,
      0,
      1.5
    );

    if (!couter.error) {
      couter.start();
    } else {
      window.console.error(couter.error);
    }
  }

  async _getCalculatedTargetAudienceCount() {
    if (this.audienceList.some(c => c.value === "TEST" && c.checked)) {
      return 0;
    }

    let audienceSize;
    let students = this.audienceList.some(
      c => c.value === "STUDENTS" && c.checked
    );
    let employees = this.audienceList.some(
      c => c.value === "EMPLOYEES" && c.checked
    );
    let affiliates = this.audienceList.some(
      c => c.value === "AFFILIATES" && c.checked
    );
    let faculty = this.audienceList.some(
      c => c.value === "FACULTY" && c.checked
    );

    let totalStudents = 0,
      totalEmployees = 0,
      totalAffiliate = 0,
      totalFaculty = 0;

    if (this.model.priority !== "Formal Notice") {
      if (students) {
        totalStudents = this.audienceSizeModel.massMailAllowedStudents;
      }
      if (employees) {
        totalEmployees = this.audienceSizeModel.massMailAllowedEmployees;
      }
      if (affiliates) {
        totalAffiliate = this.audienceSizeModel.massMailAllowedAffiliate;
      }
      if (faculty) {
        totalFaculty = this.audienceSizeModel.massMailAllowedFaculty;
      }
    } else {
      if (students) {
        totalStudents = this.audienceSizeModel.totalStudents;
      }
      if (employees) {
        totalEmployees = this.audienceSizeModel.totalEmployees;
      }
      if (affiliates) {
        totalAffiliate = this.audienceSizeModel.totalAffiliate;
      }
      if (faculty) {
        totalFaculty = this.audienceSizeModel.totalFaculty;
      }
    }
    audienceSize =
      totalStudents + totalEmployees + totalAffiliate + totalFaculty;

    return audienceSize;
  }

  _showEmployeeCriteria() {
    return this.audienceList.some(c => c.value === "EMPLOYEES" && c.checked);
  }

  async _getCalculatedDddAudienceCount() {
    if (this.audienceList.some(c => c.value === "TEST" && c.checked)) {
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
    this.audienceList.forEach(item => {
      if (this.model.targetPopulation.includes(item.value)) {
        item.checked = true;
      }
    });
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

    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement(
      "Mass Mail Audience Criteria"
    );
  }

  isValid() {
    let errors = this.validate(this.$refs.submitForm);
    if (!errors || !errors.length) return true;
    return false;
  }

  async toggleAll(ev) {
    let value = ev.target.checked;
    this.isToggled = value;

    for (let i = 0; i < this.audienceList.length; i++) {
      this.audienceList[i].checked = this.isToggled;
    }
    this.audienceList[0].checked = this.isToggled;
    this.audienceList[4].checked = false;

    this.model.targetEmployee = "";

    if (this.audienceList[1].checked == true) {
      this.model.targetEmployee = "All Employees";
    }
    
    await this.calculateAudience();
    this.setModelValue();
  }

  async clearAllAudiences(ev) {
    let value = ev.target.checked;

    for (let i = 0; i < this.audienceList.length; i++) {
      this.audienceList[i].checked = false;
    }
    this.audienceList[0].checked = false;
    this.audienceList[4].checked = value;

    await this.calculateAudience();
    this.setModelValue();
  }
  async audienceChecked(ev, population) {
    this.audienceList[0].checked = false;

    this.audienceList[4].checked = false;
    let value = ev.target.checked;

    this.model.targetEmployee = "";
    switch (population) {
      case "employee":
        this.audienceList[1].checked = value;
        if (value) {
          this.model.targetEmployee = "All Employees";
        }
        break;
      case "student":
        this.audienceList[2].checked = value;
        break;
      case "affiliate":
        this.audienceList[3].checked = value;
        break;
    }
    
    let totalChecked = this.audienceList.filter(c => c.checked).length;
    if (totalChecked < this.audienceList.length - 2) {
      this.audienceList[0].checked = false;
    }
    if (totalChecked == this.audienceList.length - 2) {
      this.audienceList[0].checked = true;
    }
    //this.audienceList =JSON.parse(JSON.stringify(this.audienceList));
    await this.calculateAudience();
    this.setModelValue();
  }

  setModelValue() {
    let value = this.audienceList
      .filter(c => c.checked)
      .map(c => c.value)
      .join(",");

    this.model.targetPopulation = value;
  }
}
