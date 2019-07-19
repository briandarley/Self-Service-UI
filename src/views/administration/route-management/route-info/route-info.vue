<template>
  <div class="route-info">
    <tabbed-control tabs="Route Info,Raw JSON">
      <tabbed-item slot="tab_0">
        <div class="route-fields pb-3">
          <div class="route-title form-group">
            <label for="route-title-value">Title</label>
            <input
              id="route-title-value"
              type="text"
              class="form-control"
              data-validation="{'name': 'Route Title','required': 'true'}"
              ref="routeTitleValue"
              placeholder="Route Title Required"
              v-model="model.title"
              v-select-all
            />
          </div>
          <div class="route-name form-group">
            <label for="route-name-value">Name</label>
            <input
              id="route-name-value"
              type="text"
              class="form-control"
              data-validation="{'name': 'Route Name','required': 'true'}"
              ref="routeNameValue"
              placeholder="Route Name Required"
              v-model="model.name"
              v-select-all
            />
          </div>
          <div class="route-alias form-group">
            <label for="route-alias-value">Alias</label>
            <input type="text" class="form-control" id="route-alias-value" v-model="model.alias" />
          </div>
          <div class="route-icon-type">
            <label for="route-icon-type-select">Icon Type</label>
            <select id="route-icon-type-select" class="form-control" v-model="model.iconType">
              <option value></option>
              <option value="material">Material</option>
              <option value="fontawesome">Font-Awesome</option>
            </select>
          </div>
          <div class="route-icon-content">
            <label for="route-icon-content-value">Icon Content</label>
            <input
              type="text"
              class="form-control"
              id="route-icon-content-value"
              v-model="model.iconContent"
            />
          </div>
          <div class="route-vue-component form-group">
            <label for="route-vue-component-value">VUE Component</label>

            <input
              id="route-vue-component-value"
              type="text"
              class="form-control"
              data-validation="{'name': 'Route Component','required': 'true','regex': '^.+vue$', 'message': 'Invalid route component path, must end with .vue'}"
              ref="routeComponentPathValue"
              placeholder="Vue Component Required"
              v-model="model.component"
              v-select-all
            />
          </div>
          <div class="route-route form-group">
            <label for="route-route-value">Route</label>
            <input
              id="route-route-value"
              type="text"
              class="form-control"
              data-validation="{'name': 'Route Path','required': 'true'}"
              ref="routePathValue"
              placeholder="Route Path"
              v-model="model.route"
              v-select-all
            />
          </div>
          <div class="route-order input-bool">
            <label for="route-order-value">Order</label>
            <input type="text" class="form-control" id="route-order-value" v-model="model.order" />
          </div>
          <div class="route-enabled input-bool">
            <label for="route-nested-enabled-select">Enabled</label>
            <select id="route-nested-enabled-select" class="form-control" v-model="model.enabled">
              <option value>- select -</option>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </div>
          <div class="route-nested-routing input-bool">
            <label for="route-nested-routing-select">Nested Routing</label>
            <select
              id="route-nested-routing-select"
              class="form-control"
              v-model="model.nestedRouting"
            >
              <option value>- select -</option>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </div>
          <div class="route-mfa input-bool">
            <label for="route-mfa-select">MFA</label>
            <select id="route-mfa-select" class="form-control" v-model="model.mfa">
              <option value>- select -</option>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </div>
          <div class="route-parent-route-id input-bool">
            <label for="route-parent-route-id-value">Parent Route Id</label>
            <input
              type="text"
              class="form-control"
              id="route-parent-route-id-value"
              v-model="model.parentRouteId"
            />
          </div>
          <div class="two-col">
            <div class="route-roles">
              <label for="route-roles-select">Roles</label>
              <div class="form-inline">
                <select class="form-control" id="route-roles-select" v-model="seletedRole">
                  <option value>- select role -</option>
                  <option v-for="item in model.roles" :key="item" :value="item">{{item}}</option>
                </select>
                <button class="btn btn-primary" @click="onAddNewRole()">
                  <i class="fa fa-plus-circle"></i>
                </button>
                <button class="btn btn-danger" @click="onRemoveRole()">
                  <i class="fa fa-minus-circle"></i>
                </button>
              </div>
            </div>
            <div class="submit text-right">
              <div>&nbsp;</div>
              <button class="btn btn-primary mr-1" @click="saveChanges()">Save</button>
              <button class="btn btn-danger" @click="deleteRoute()" v-if="!model.isNew">Delete</button>
            </div>
          </div>
        </div>
      </tabbed-item>
      <tabbed-item slot="tab_1">
        <textarea name="raw-json" id="txtRawJson" rows="10" class="form-control" v-model="rawJson"></textarea>
      </tabbed-item>
    </tabbed-control>

    <child-route-info
      :model="model.children"
      class="mt-3 child-routes"
      v-if="model.children.length"
      @routeUpdated="onRouteUpdated"
      @routeDeleted="onRouteDeleted"
    ></child-route-info>

    <confirm-dialog id="confirmAddRole" ref="confirmAddRole">
      <div slot="modal-title" class="text-white">Confirm: Add Role</div>
      <div slot="modal-body">
        <div class="alert alert-info">
          <p
            class="px-3 pt-1"
          >If you add a role in which you are not a member of, the next time you refresh this view the route may not be listed</p>
        </div>

        <div class="form-group">
          <label for="new-role">Role Name</label>
          <input type="text" class="form-control" id="new-role" v-select-all v-model="addNewRole" />
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="onConfirmAddRoles()">add role</button>
        <button class="btn btn-secondary" @click="onCancelConfirmAddRoles()">cancel</button>
      </div>
    </confirm-dialog>
  </div>
</template>
<script src="./route-info.js"></script>
<style lang="scss" src="./route-info.scss"></style>
