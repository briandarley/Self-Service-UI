<template>
  <form @submit.prevent.prevent class="validation-form" autocomplete="off" >
     
    <div class="container">
      <div class="form-group">
        <!-- <h4 class="text-primary">Todo, Remedy 3924152, allow member to manually enter email address</h4>
        <h4 class="text-primary">Todo, Remedy 3993792, description is a required field</h4>
        -->
        <label>Admin Email</label>
        
        <type-ahead
          :id="'admin_email'"
          v-model="emailAddress"
          min-length="0"
          @change="onChangeAdminEmailAddress"
          :service="getAdminEmailAddresses"
          
        ></type-ahead>

      
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
          v-on:keyup.13="search()"
        />
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
        />
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <input type="text" class="form-control" id="description" v-model="model.description" />
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
            />
            <label for="mailing-type-closed">Closed</label>
          </li>
          <li>
            <input
              type="radio"
              id="mailing-type-open"
              value="open"
              name="mailing-type"
              v-model="model.mailingType"
            />
            <label for="mailing-type-open">Open</label>
          </li>
        </ul>
      </div>
      <br />
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
          />
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
          <span class="text-white">Validation Error: Invalid</span>
        </div>
        <div slot="modal-body">
           <div class="alert alert-danger">
              <div class="info">
                  <i class="fa fa-exclamation-triangle m-0"></i>
              </div>
              <p>There appears to be validation errors. Please ensure valid inputs and retry your request again.</p>
          </div>

          
         
        </div>
        <div slot="modal-footer">
          <button class="btn btn-primary" @click="closeValidation()">ok</button>
        </div>
      </confirm-dialog>
    </div>
  </form>
</template>
<script src="./tab-create-new.js"></script>
<style lang="scss" src="./tab-create-new.scss" ></style>
