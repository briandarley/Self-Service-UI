<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fa-user-circle-o"></i>
        </div>
        <h3>My Aliases</h3>
      </div>
      <div class="card-body">
        <div class="my-aliases border border-primary mb-3" v-if="successfullyLoaded">
          <div class="row">
            <div class="col">
              <div class="alert alert-info">
                <div class="info">
                  <i class="fa fa-info-circle"></i>
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
          <div class="email-alias-list">
            <div class="email-alias" v-for="(item, index) in emailAddresses" :key="index">
              <div>{{item.email}}</div>

              <div v-if="!item.originalPrimary">
                <a href="#" @click.prevent="setPrimaryAlias(item)" class="mr-2">
                  <i class="fa fa-save"></i>
                  set primary
                </a>
                <a href="#" @click.prevent="removeAlias(item)">
                  <i class="fa fa-trash"></i>
                  remove
                </a>
              </div>
              <div v-else>
                <span class="text-primary text-left" v-if="item.originalPrimary">(Primary)</span>
              </div>
            </div>

            <!-- Add New Alias -->
            <div class="form-group form-inline add-new-alias" v-if="showAddAlias">
              <label for>New Alias</label>
              <input
                type="text"
                class="form-control"
                placeholder="email alias"
                v-model="model.mailPrefix"
              >
              <div class="input-group-append">
                <span class="input-group-text">@</span>
              </div>

              <select class="form-control" v-model="model.domain">
                <option v-for="item in allowedDomains" :key="item" :value="item">{{item}}</option>
              </select>

              <button class="btn btn-primary" @click="addAlias">Add Alias</button>
            </div>
            <!-- End Add New Alias -->
          </div>
        </div>
        <div v-else>
          <div class="alert alert-warning">
            <div class="info">
              <i class="fa fa-exclamation-circle"></i>
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
