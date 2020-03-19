<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fa-user-circle-o" aria-hidden="true"></i>
        </div>
        <h1>My Aliases</h1>
      </div>
      <div class="card-body">
        <div class="my-aliases border border-primary mb-3" v-if="successfullyLoaded">
          <div class="row">
            <div class="col">
              <div class="alert alert-info">
                <div class="info">
                  <i class="fa fa-info-circle" aria-hidden="true"></i>
                </div>
                <div>
                  <p>
                    The aliases listed are associated to mail account, {{model.email}}.
                    Mail may be addressed using any of the addresses listed and will be delivered to your inbox.
                    Your primary alias is used by UNC systems when sending e-mail.
                  </p>
                  <p>Note: Accounts are limited to 5 aliases</p>
                  <p class="strong">
                    The (Primary) alias cannot be removed. If you wish to remove the current primary alias you must first designate another alias as the primary.
                    To change the primary, select the link 'set primary'.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-if="emailAddresses && emailAddresses.length">
            <!-- Add New Alias -->
            <form @submit.prevent.prevent v-if="showAddAlias" role="form" ref="submitForm">
              <div class="border border-primary">
                <div class="bg bg-primary">
                  <h2 class="text-white p-2">Add New Alias</h2>
                </div>
                <div class="add-new-alias">
                  <div class="col form-group">
                    <div class="label-info">
                      <label for="newAlias" id="lblNewAlias">New Alias (E-mail prefix)</label>
                      <span class="required" id="spnNewAliasReq">Required</span>
                    </div>
                    <input
                      type="text"
                      id="newAlias"
                      class="form-control"
                      placeholder="email alias"
                      aria-labelledby="lblNewAlias spnNewAliasReq"
                      v-model="model.mailPrefix"
                      data-validation="{'name': 'E-mail alias (prefix)','required': 'true'}"
                      ref="newAlias"
                      v-select-all
                    />
                  </div>
                  <div class="col form-group">
                    <div class="input-group-append">
                      <span class="input-group-text">@</span>
                    </div>
                  </div>
                  <div class="col form-group">
                    <div class="label-info">
                      <label for="select-domain">Domain</label>
                      <span class="required">Required</span>
                    </div>

                    <select class="form-control" v-model="model.domain" id="select-domain">
                      <option v-for="item in allowedDomains" :key="item" :value="item">{{item}}</option>
                    </select>
                  </div>
                </div>
                <div class="submit">
                  <button class="btn btn-primary" @click="addAlias">Add Alias</button>
                </div>
              </div>
            </form>
            <!-- End Add New Alias -->
            <h2 class="text-primary ml-3">Currently Assigned Aliases</h2>
            <div class="results" role="table" aria-label="Currently Assigned Aliases">
              
              <div role="row" class="header">
                <div class="col" role="columnheader" aria-sort="none">Email</div>
                <div class="col" role="columnheader" aria-sort="none">Action</div>
              </div>
              <div class="result-grid" v-for="(item, index) in emailAddresses" :key="index" role="row">
                <div role="cell">{{item.email}}</div>

                <div v-if="!item.originalPrimary" role="cell">
                  <a
                    href="#"
                    @click.prevent="setPrimaryAlias(item)"
                    class="mr-2"
                    :aria-label="'set ' + item.email + ' as primary alias'"
                  >
                    <i class="fa fa-save" aria-hidden="true"></i>
                    set primary
                  </a>
                  <a
                    href="#"
                    @click.prevent="removeAlias(item)"
                    :aria-label="'remove alias ' + item.email"
                    v-if="allowRemove(item)"
                  >
                    <i class="fa fa-trash" aria-hidden="true"></i>
                    remove
                  </a>
                </div>
                <div role="cell" v-else>
                  <span class="text-primary text-left" v-if="item.originalPrimary">(Primary)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="alert alert-warning">
            <div class="info">
              <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
            </div>
            <p
              class="py-4 my-3"
            >Failed to load profile. This can result if the system is unable to locate an LDAP or AD record.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./my-aliases.js"></script>
<style lang="scss" src="./my-aliases.scss" scoped></style>
