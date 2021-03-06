<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons" aria-hidden="true">list_alt</i>
        </div>
        <h1>List Manager</h1>
      </div>
      <div class="card-body">
        <div class="alert alert-info">
          <div class="info text-info">
            <i class="fa fa-info-circle" aria-hidden="true"></i>
          </div>
          <div>
            <h2
              class="h5 strong"
            >Welcome to the University of North Carolina at Chapel Hill List Server</h2>
            <p>If you know the name of a list you would like to jump directly to, enter it below. Otherwise, if you are a member or administrator of multiple lists, you can view all your lists by selecting one of the links after clicking "Log In".</p>
          </div>
        </div>

        <div class="card widget">
          <form @submit.prevent.prevent class="container" role="form" ref="searchForm">
            <div class="card-body">
              <div class="form-group">
                <div class="label-info">
                  <label
                    for="searchField"
                    id="lblSearchField"
                    aria-label="required"
                  >Visit or Manage a Single List by Entering List Name</label>
                  <span class="required" id="spnRequired">Required</span>
                </div>

                <input
                  type="text"
                  id="searchField"
                  class="form-control"
                  placeholder="Enter List Name"
                  v-focus
                  v-model="listName"
                  ref="searchField"
                  v-on:keyup.13="navigateToList(listName)"
                  data-validation="{'required': 'true', 'message': 'List Name Required'}"
                  autocomplete="off"
                  v-select-all
                  aria-required="true"
                  aria-labelledby="lblSearchField spnRequired"
                />
              </div>

              <div class="submit text-right">
                <a
                  href="#"
                  class="btn btn-primary mr-1"
                  @click.prevent="navigateToList(listName)"
                >Visit</a>
                <a
                  href="#"
                  class="btn btn-secondary mr-1"
                  @click.prevent="manageList(listName)"
                >Manage</a>
              </div>
            </div>
          </form>
        </div>

        <div class="alert warning border border-warning">
          <div>
            <p>Some lists on the UNC List Server require you to log in to read or post messages. If you are asked to log in, use</p>
            <ul>
              <li>the e-mail address you used to subscribe to the list</li>
              <li>your list password*, which cannot be blank.</li>
            </ul>

            <p
              class="strong"
            >*The UNC List Server username and password is unique, and does not match the Onyen sign-on system. For security purposes, the use of ONYEN passwords on listsserv is discouraged.</p>
          </div>

          <div>
            <p class="strong">If you have difficulty logging in, please try one of the following:</p>

            <ul>
              <li>Make sure that cookies are enabled in your browser.</li>
              <li>Click here to search for a list by name or description.</li>
              <li>Click here to have your password sent to you via e-mail.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <confirm-dialog id="confirmMigration" ref="confirmMigration" width="850">
      <div slot="modal-title" class="text-white">
        <h2 class="h4">Coming Soon</h2>
      </div>
      <div slot="modal-body">
        <div class="alert">
          <div class="info text-warning">
            <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
          </div>
          <div>
            <p>The ITS Listserv Service is currently under review for migration to O365.</p>
            <p>There are options to choose from within O365 such as Teams or Groups to better suit your needs.</p>
            <p>
              Please contact (919) 962-HELP for assistance with setting up an O365 Team or group.
              <br />If you choose to use Listserv, please be advised that this service may migrate to O365 soon.
            </p>
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="closeDialog()">ok</button>
      </div>
    </confirm-dialog>
  </div>
</template>
<script src="./list-manager.js"></script>
<style lang="scss" src="./list-manager.scss" scoped></style>
