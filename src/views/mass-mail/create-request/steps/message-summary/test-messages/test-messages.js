import Vue from "vue"
import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'test-messages',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'MassMailService', 'UserService', 'CommonExtensions']
  
})

export default class TestMessages extends Vue {
  entities = [];
  email = "";
  allSelected = false;
  async mounted() {

    this.toastService.set(this);

    await this.getFavoriteReviewers();
    await this.getEmailFromUserProfile();

    if (this.entities.some(c => c.email.toLowerCase() == this.email.toLowerCase())) {
      this.email = "";
    }
  }
  async getEmailFromUserProfile() {
    var user = await this.UserService.get();
    this.email = user.profile.email;
  }
  async getFavoriteReviewers() {
    try {
      this.spinnerService.show();
      var response = await this.MassMailService.getFavoriteReviewers();
      response.forEach(entity => entity.checked = true);

      this.entities = response;
    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to retrieve favorite reviewers');
    } finally {
      this.spinnerService.hide();
    }
  }
  async deleteFavoriteReviewer(email) {
    try {
      this.spinnerService.show();

      await this.MassMailService.deleteFavoriteReviewer(email);

      let pos = this.entities.map(function (e) {
        return e.email;
      }).indexOf(email);

      this.entities.splice(pos, 1)

    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to remove reviewer');



    } finally {
      this.spinnerService.hide();
    }
  }
  async addFavoriteReviewer(email) {
    try {

      this.spinnerService.show();
      await this.MassMailService.addFavoriteReviewer(email);
    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to save favortie reviewer');
    } finally {
      this.spinnerService.hide();
    }
  }
  async add() {
    if (!this.CommonExtensions.isValidEmailAddress(this.email)) {
      this.toastService.error("Invalid email entered");
      return;
    }

    if (this.entities.some(c => c.email.toLowerCase() == this.email.toLowerCase())) {
      this.toastService.error("Duplicate email found");
      return;
    }

    await this.addFavoriteReviewer(this.email);
    this.entities.push({
      email: this.email,
      checked: true
    });

    this.clear();
  }
  async sendTestMessage() {
    try {
      this.spinnerService.show();
      
      let recipients = this.entities.filter(c=> c.checked).map(c=> c.email);
      
      if(recipients.length === 0 ){
        this.toastService.error("No recipients to send to");
        return;
      }
      
      await this.MassMailService.sendTestCampaign(this.$route.params.id, recipients);

      this.toastService.success("Successfully submitted test message")
    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to send test message');
    } finally {
      this.spinnerService.hide();
    }
  }
  clear() {
    this.email = "";
  }
  toggleAllRecipients(){
    this.allSelected = !this.allSelected;
    this.entities.forEach(entity => {
      entity.checked = this.allSelected;
    });

    this.entities = JSON.parse(JSON.stringify(this.entities));
  }
}