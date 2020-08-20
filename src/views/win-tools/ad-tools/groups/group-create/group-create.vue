<template>
  <form
    @submit.prevent.prevent
    class="container group-management"
    autocomplete="off"
    ref="submitForm"
  >
    
      <div class="card card-icon">
        <div class="card-header text-primary">
          <div class="icon bg-primary text-white">
            <i class="fa fas fas fa-object-group"></i>
          </div>
          <h1>Group Create</h1>
        </div>
        <div class="card-body">
          <div class="alert alert-info">
            <div class="info">
              <i class="fas fa-info-circle"></i>
            </div>

            <div class="p-2">
              <p>
                Use the search field below to locate a desired record using
                Onyen
              </p>

              <p>
                Note only one field is required when searching for desired
                groups. You do not need to specify both fields when searching.
                Searching by group name utilizes like expressions. So entering
                'test' will return 'ipsum_lorem_test', 'delorem_cdstest mailbox
                full access', 'its_foo_bartestdg.dg' for example.
              </p>

              <p>
                Use the 'Create New Group' button to create either a shared
                mailbox or resource mailbox
              </p>
            </div>
          </div>

          <div class="my-3 submit text-left">
            <button type="button" class="btn btn-primary ml-1" @click="goToGroupSearch()">
              <i class="fa fa-angle-left mr-1"></i>
              Back to Group Search
            </button>
          </div>

          <div class="border border-primary">
            <div class="bg bg-primary text-white p-2">Group Properties</div>
            <div class="m-2">
              <div class="row-1">
                <label
                  >Departmental Unit Abbreviation (i.e. ITS, DSA, FPG)</label
                >
                <type-ahead
                  id="thSelectDepartment"
                  placeHolder="select organization"
                  :label="'Departmental Unit Abbreviation (i.e. ITS, DSA, FPG)'"
                  ref="thSelectDepartment"
                  :dataOptions="thDataOptions"
                  @change="onDepartmentalUnitChange"
                  data-validation="{'ouName': 'Organization','message':'Organization required','required':true}"
                ></type-ahead>
              </div>

              <div class="row-1">
                <div class="form-group">
                  <label for="displayName"
                    >Friendly name for Global Address List</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    name="displayName"
                    placeholder="Friendly Name"
                    id="displayName"
                    ref="displayName"
                    data-validation="{'name': 'Friendly Name','message':'Friendly name is required', 'required':true}"
                    v-model="model.displayName"
                  />
                </div>
              </div>
              <div class="row-2">
                <div class="form-group">
                  <label for="mailbox-name">Mailbox Short Name</label>
                  <input
                    type="text"
                    class="form-control"
                    name="mailbox-name"
                    id="mailbox-name"
                    placeholder="Short Name"
                    v-model="model.name"
                    data-validation="{'name': 'Short Name','message':'Invalid, can contain only alpha numeric characters with no spaces', 'maxLength': 23,'regex': '^[-a-zA-Z0-9]+$'}"
                    ref="name"
                    title="Alpha Numeric only"
                  />
                </div>
              </div>
              <div class="row-3">
                <div class="form-group">
                  <label for="group-type">Group Type</label>
                  <select
                    name="select-group-type"
                    id="select-group-type"
                    ref="select-group-type"
                    class="form-control"
                    v-model="model.groupTypeCode"
                    data-validation="{'name': 'Group Type','message':'Group type required','required':true}"
                  >
                    <option value="">-- select group type --</option>
                    <option value="SHARED_MAILBOX">Shared Mailbox</option>
                    <option value="RESOURCE_MAILBOX">Resource Mailbox</option>
                  </select>
                </div>
              </div>
              <div
                class="row-3"
                v-if="model.groupTypeCode === 'SHARED_MAILBOX'"
              >
                <div class="form-group">
                  <label for="reply-to"
                    >Reply-to Address (This should be a unique email
                    address)</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    name="reply-to"
                    id="reply-to"
                    placeholder="Reply to Address"
                    v-model="model.replyToAddress"
                    ref="replyToAddress"
                    data-validation="{'name': 'Reply to Address','type':'email', 'minLength': 10,'required': true}"
                  />
                </div>
              </div>
               <div
                class="row-4"
                
              >
                <div class="form-group">
                  <label for="reply-to"
                    >Description (Optional)</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    name="description"
                    id="description"
                    placeholder="Description"
                    v-model="model.description"
                    ref="description"                    
                  />
                </div>
              </div>
              <div class="submit text-right">
                <button type="button"  class="btn btn-primary mr-1" @click="create()">
                  Create {{ groupTypeDisplay }}
                </button>
                <button type="button" class="btn btn-secondary" @click="clear()">
                  Clear
                </button>

                
              </div>
            </div>
          </div>
        </div>
      </div>

  </form>
</template>
<script src="./group-create.js"></script>
<style lang="scss" src="./group-create.scss"></style>
