import { BaseValidateMixin } from "./../../../../../../components/mixins/index";

import { Component } from "vue-property-decorator";

@Component({
  name: "audience-check",
  dependencies: [
    "$",
    "moment",
    "toastService",
    "spinnerService",
    "MassMailService",
  ],
  props: ["model"],
})
export default class AudienceCheck extends BaseValidateMixin {
  onyen = "";
  validationErrors = [];
  checkUserSuccess = false;
  audienceCheckResult = "";
  userInfo = {};
  async mounted() {
    this.toastService.set(this);
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

      this.userInfo = await this.MassMailService.getMassMailUserProfile(
        this.onyen
      );
      if(this.userInfo.status === false){
        this.toastService.error("Failed to retrieve user profile");
        return;
      }
      window.console.log(
        this.model.campaignAudienceSelections.includePopulations
      );
      if (
        this.model.campaignAudienceSelections.includePopulations.indexOf(
          "TEST"
        ) > -1
      ) {
        this.toastService.warn(
          "MassMail is set to test, no messages will be submitted"
        );
        return;
      }
      let meetsCriteria = false;

      this.model.campaignAudienceSelections.includePopulations.forEach(
        (population) => {
          switch (population) {
            case "UNDERGRADUATES":
              if (!this.userInfo.student) {
                this.validationErrors.push("User is not a student");
              } else {
                meetsCriteria = true;
              }
              break;
            case "GRADUATES":
              if (!this.userInfo.graduate) {
                this.validationErrors.push("User is not a graduate");
              } else {
                meetsCriteria = true;
              }
              break;
            case "STAFF":
              if (!this.userInfo.employee) {
                this.validationErrors.push("User is not an employee");
              } else {
                meetsCriteria = true;
              }
              break;

            case "FACULTY":
              if (!this.userInfo.faculty) {
                this.validationErrors.push("User is not faculty");
              } else {
                meetsCriteria = true;
              }
              break;

            case "DDD":
              if (!this.userInfo.ddd) {
                this.validationErrors.push("User is not DDD");
              } else {
                meetsCriteria = true;
              }
              break;
            case "RETIREES":
              if(this.userInfo.affiliateTypes.indexOf("Retiree") == -1) {
                this.validationErrors.push("User is not retiree");
              }
              else {
                meetsCriteria = true;
              }
              break;
            case "VOLUNTEERS":
              if(this.userInfo.affiliateTypes.indexOf("Volunteer") == -1) {
                this.validationErrors.push("User is not volunteer");
              }
              else {
                meetsCriteria = true;
              }
              break;
              
            case "CONSULTANTS":
              if(this.userInfo.affiliateTypes.indexOf("Independent Contractor") == -1 && this.userInfo.affiliateTypes.indexOf("Other Contractor/Consultant") == -1) {
                this.validationErrors.push("User is not a consultant");
              }
              else {
                meetsCriteria = true;
              }
              break;
            case "VISITING_SCHOLAR":
              if(this.userInfo.affiliateTypes.indexOf("Visiting Scholar") == -1) {
                this.validationErrors.push("User is not visiting scholar");
              }
              else {
                meetsCriteria = true;
              }
              break;
              
            
          }
        }
      );

      if (this.userInfo.status === false) {
        this.toastService.error("Could not locate user");
        return;
      }

      this.checkUserSuccess = false;
      
      this.checkUserSuccess = meetsCriteria || !this.validationErrors.length;

      if (this.userInfo && !this.checkUserSuccess) {
        this.audienceCheckResult =
          "Person found but the person does not meet the criteria specified";
        this.$refs.confirmCheckUser.show();
        this.checkUserSuccess = false;
        return;
      } else if (this.userInfo) {
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
}
