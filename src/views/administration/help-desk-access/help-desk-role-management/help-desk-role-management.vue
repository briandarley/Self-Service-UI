<template>
  <div class="container">
    <h5 class="text-primary">{{roleToManage}}</h5>
    <!-- Search Criteria -->
    <form @submit.prevent.prevent class="section" role="form">
      <div class="search-criteria">
        <div class="header">Add User to Access Group</div>
        <div class="container pt-3">
          <div class="search-criteria-fields">
            <div class="form-group">
              <label for="user-to-add">Onyen</label>
              <input
                id="user-to-add"
                type="text"
                class="form-control"
                placeholder="onyen"
                v-model="model.onyen"
                autocomplete="off"
              />
            </div>
          </div>
        </div>
        <div class="submit p-3">
          <div class="text-right">
            <button class="btn btn-primary mr-1" @click="addUserToGroup()">Add to Group</button>
            <button class="btn btn-secondary" @click="clear()">Clear</button>
          </div>
        </div>
      </div>

      <!-- Search Criteria -->
    </form>
    <div class="section">
      <!-- Search Results -->

      <div class="container mb-3" v-if="entities.length">
        <h3 class="text-primary">Total {{entities.length | formatNumber}}</h3>

        <div class="bg-primary text-white row-header">
          <div class="col">
            <a href="#" @click.prevent="sort('samAccountName')">Onyen</a>
          </div>
          <div class="col">
            <a href="#" @click.prevent="sort('employeeId')">PID</a>
          </div>
          <div class="col">
            <a href="#" @click.prevent="sort('objectClass')">Type</a>
          </div>
          <div class="col">
            <a href="#" @click.prevent="sort('enabled')">Enabled</a>
          </div>
          <div class="col"></div>
        </div>
        <div
          class="result-grid"
          v-for="item in entities"
          v-bind:key="item.onyen"
          :class="{'text-primary': item.objectClass === 'group'}"
        >
          <div class="col">{{item.samAccountName}}</div>
          <div class="col">{{item.employeeId}}</div>
          <div class="col">{{item.objectClass}}</div>
          <div class="col">
            <span v-if="item.objectClass === 'user'">{{item.enabled | toEnabledDisabled}}</span>
          </div>
          <div class="col edit-col text-right">
            <span v-if="item.objectClass === 'user'">
              <a href="#" @click.prevent="removeMember(item)" title="remove member">
                <i class="fa fa-trash-o" aria-hidden="true"></i>
              </a>
            </span>
          </div>
        </div>
      </div>
      <div class="conatiner" v-else>
        <div class="alert alert-warning">
          <div class="info">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
          </div>
          <p class="my-4 ml-3 pb-3">
            No members in group
            <span class="strong">{{roleToManage}}</span> were found.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./help-desk-role-management.js"></script>
<style lang="scss" src="./help-desk-role-management.scss" scoped></style>
