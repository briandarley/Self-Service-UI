import { Component } from "vue-property-decorator";
import { BaseValidateMixin } from "../../../../components/mixins/index";
import { setTimeout } from "timers";

@Component({
  name: "tab-create-new",
  dependencies: [
    "$",
    "moment",
    "toastService",
    "spinnerService",
    "ListManagerService"
  ],
  components: {},
  props: ["emailAddresses"]
})
export default class TabCreateNew extends BaseValidateMixin {
  model = {};
  //because of how binding works, we can't bind the typeahead field to model.emailAddress as it can't track changes to a nested property
  //hence the need for the primitive propert 'emailA
  emailAddress = "";
  clear() {
    this.model = {};
    this.emailAddress = "";
    this.clearValidation();
  }
  // async click() {
  //   let errors = this.validate();
  // }

  async submit() {
    let errors = this.validate();
    if (errors.length) {
      this.toastService.error(errors.join("<br/>"));
      this.$refs.validationModal.show();
      return;
    }

    this.spinnerService.show();
    let success = false;
    try {
      await this.ListManagerService.addNewList(this.model);
      success = true;
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to create new list");
    } finally {
      this.spinnerService.hide();
      if (success) {
        this.$router.push({
          name: "pm-tools-edit",
          params: { listName: this.model.listName }
        });
      }
    }
  }

  closeValidation() {
    this.$refs.validationModal.hide();
  }

  async mounted() {
    this.toastService.set(this);
   
  }
  
  onChangeAdminEmailAddress(value) {
    this.emailAddress = value;
    this.model.emailAddress = value;
  }
  async getAdminEmailAddresses(query, _, asyncResults) {
    
    try {
      return new Promise(result => {
        
        setTimeout(() => {
          if (query == "") {
            return result(asyncResults(this.emailAddresses));

          }

          let filteredRecords = this.emailAddresses.filter(item => {
            let includes = item.toUpperCase().includes(query.toUpperCase());
            return includes;
          });

          result(asyncResults(filteredRecords));
        }, 250);
      });
    } catch (e) {
      window.console.log(e);
    }
  }
  async getSchoolsDepartmentsLike(query, _, asyncResults) {
    try {
      debugger;
      //let departments =JSON.parse(JSON.stringify(this.departments));
      return new Promise(result => {
        setTimeout(() => {
          let filteredRecords = this.departments
            .filter(item => {
              let includes = item.name
                .toUpperCase()
                .includes(query.toUpperCase());
              return includes;
            })
            .map(c => c.name);
          

          result(
            asyncResults(
              filteredRecords
              //   departments.filter(item => {
              //   let includes = item.name.toUpperCase().includes(query.toUpperCase())
              //   return  includes;

              // }

              //).map(c => c.name)
            )
          );
        }, 250);
      });
    } catch (e) {
      window.console.log(e);
    }
  }
}