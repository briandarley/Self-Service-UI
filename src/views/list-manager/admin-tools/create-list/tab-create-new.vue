<template>
  <form @submit.prevent.prevent class="validation-form" autocomplete="off">
    <div class="container">
      <div class="form-group">
        <h4 class="text-primary">Todo, Remedy 3924152, allow member to manually enter email address</h4>
        <label for="admin_email">Admin Email</label>
        <select
          name="admin_email"
          id="admin_email"
          class="form-control"
          v-model="model.emailAddress"
          ref="admin_email"
          data-validation="{'name': 'Admin Email','message':'Invalid', 'required': 'true'}"
        >
          <option v-for="email in emailAddresses" :key="email" :value="email">{{email}}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="list_name">List Name</label>
        <input
          type="text"
          class="form-control"
          id="list_name"
          v-model="model.listName"
          data-validation="{'name': 'List Name','minLength': '3','message':'Invalid, can contain only alpha numeric characters (lower case) with no spaces', 'regex': '^[a-z0-9_\\-]+$'}"
          ref="list_name"
        >
      </div>
      <div class="form-group">
        <label for="admin_password">Admin Password</label>
        <input
          type="password"
          class="form-control"
          id="admin_password"
          v-model="model.password"
          data-validation="{'name': 'Admin Password','type':'password', 'minLength': '3','message':'Invalid'}"
          ref="admin_password"
        >
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <input type="text" class="form-control" id="description" v-model="model.description">
      </div>
      <div class="form-group">
        <label class="d-inline-block mr-3">Type of List</label>
        <ul
          class="d-inline-block radio-buttons"
          data-validation="{'name': 'Type of List','required': true,'message':'Invalid','model': 'mailingType'}"
          :model="model.mailingType"
          ref="mailing-type"
        >
          <li>
            <input
              type="radio"
              id="mailing-type-closed"
              value="closed"
              name="mailing-type"
              v-model="model.mailingType"
              checked
            >
            <label for="mailing-type-closed">Closed</label>
          </li>
          <li>
            <input
              type="radio"
              id="mailing-type-open"
              value="open"
              name="mailing-type"
              v-model="model.mailingType"
            >
            <label for="mailing-type-open">Open</label>
          </li>
        </ul>
      </div>
      <br>
      <div class="form-group">
        <div class="check-buttons">
          <input
            type="checkbox"
            name="certify"
            id="chkcertify"
            ref="chkcertify"
            v-validate="'required'"
            v-model="model.certify"
            :value="model.certify"
            data-validation="{'name': 'Must Certify List Checkbox','required': true}"
          >
          <label for="chkcertify">
            By checking this box I certify that this listserv and its uses are aligned with the mission of The University of North Carolina at Chapel Hill.
            The UNC Mission Statement can be found here:
            <a
              href="https://www.unc.edu/about/mission/"
            >UNC Mission Statement</a>
          </label>
        </div>
      </div>

      <div class="text-right my-3">
        <button class="btn btn-primary mr-2" @click="submit()">Submit</button>
        <button class="btn btn-secondary" @click="clear()">Clear</button>
      </div>

      <confirm-dialog id="validationModal" ref="validationModal">
        <div slot="modal-title">
          <span class="text-danger">Validation Error: Invalid</span>
        </div>
        <div slot="modal-body">
          <div class="info text-danger">
            <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
          </div>
          <p>There appears to be validation errors. Please ensure valid inputs and retry your request again.</p>
        </div>
        <div slot="modal-footer">
          <button class="btn btn-primary" @click="closeValidation()">ok</button>
        </div>
      </confirm-dialog>
    </div>
  </form>
</template>
<script>

import { Component } from "vue-property-decorator";
import { BaseValidateMixin } from "../../../../components/mixins/index";

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

  clear() {
    this.model = {};
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
          name: "pm-tools-edit", params: {listName: this.model.listName}
                 
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
  async created() {
    //called before child views are mounted
  }
}
</script>
<style lang="scss"  >
</style>
