<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons">contact_mail</i>
        </div>
        <h1>Contact Management</h1>
      </div>
      <div class="card-body">
        <form @submit.prevent.prevent role="form" ref="searchForm">
          <div class="alert alert-info">
            <div class="info">
              <i class="fa fa-info-circle" aria-hidden="true"></i>
            </div>
            <div>
              <p>
                Use the search function to retrieve AD contact information
              </p>
            </div>
          </div>
{{entity}}
          <div class="form-group">
            <div class="label-info">
              <label for="userId">Search (Name, PID, Email)</label>
              <span class="required">Required</span>
            </div>

            <input
              type="text"
              class="form-control"
              id="contactId"
              v-select-all
              v-model="filter"
              placeholder="name, pid, or email"
              v-on:keyup.13="search()"
              data-validation="{'required': 'true', 'message': 'Search field required'}"
              ref="contactId"
              autocomplete="off"
            />
          </div>
          <div class="submit">
            <button class="btn btn-primary mr-1" @click="search()">
              Search
            </button>
            <button class="btn btn-secondary" @click="clear()">Clear</button>
          </div>
        </form>
        <div v-if="entity.name" class="contact-detail">
          <div>
            <span>Name</span>
            <span>{{ entity.name }}</span>
          </div>
          <div>
            <span>DistinguishedName</span>
            <span>{{ entity.distinguishedName }}</span>
          </div>
          <div>
            <span>Employee Id</span>
            <span v-if="entity.employeeId">{{ entity.employeeId }}</span>
            <span v-else>Null</span>
          </div>
          <div>
            <span>Member Of</span>
            <span v-if="entity.memberOf.length">{{ entity.memberOf }}</span>
            <span v-else>None</span>
          </div>
          <div>
            <span>Proxy Addresses</span>
            <span class="m-0" v-if="entity.proxyAddresses.length">
              <div>
                <select
                  name="proxyAddresses"
                  id="proxyAddresses"
                  class="form-control"
                  v-model="selectedSmtpAddress"
                >
                  <option
                    
                    v-for="address in entity.proxyAddresses"
                    :key="address.distinguishedName"
                    >{{ address }}</option
                  >
                </select>
                <button type="button" class="btn btn-danger" @click="removeSmtpAddress()">Remove</button>
              </div>
            </span>
            <span v-else>None</span>
            
          </div>
          <div>
            <span>Add Proxy Address</span>
            <span class="m-0">
             <div>
                <input type="text" class="form-control" v-model="newProxyAddress">
                <button type="button" class="btn btn-primary" @click="addSmtpAddress()">Add</button>
             </div>
            </span>
          </div>
        </div>
        <div v-if="!entity.name && entity.valid !== false">
          <div class="system-message mt-5">
            <div class="alert alert-warning">
              <div class="info">
                <i class="far fa-stop-circle" aria-hidden="true"></i>
              </div>
              <div class="message">
                <p class="pt-3 h4 text-secondary">
                  Could not find AD contact entity given search term provided
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./contacts.js"></script>
<style lang="scss" src="./contacts.scss" scoped></style>
