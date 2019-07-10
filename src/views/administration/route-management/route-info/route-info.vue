<template>
  <div>
  <div class="container">
    <div class="route-title form-group">
      <label for="route-title-value">Title</label>
      <input type="text" class="form-control" id="route-title-value" v-model="model.title" />
    </div>
    <div class="route-name">
      <label for="route-name-value">Name</label>
      <input type="text" class="form-control" id="route-name-value" v-model="model.name" />
    </div>
    <div class="route-alias">
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
    <div class="route-vue-component">
      <label for="route-vue-component-value">VUE Component</label>
      <input
        type="text"
        class="form-control"
        id="route-vue-component-value"
        v-model="model.component"
      />
    </div>
    <div class="route-route">
      <label for="route-route-value">Route</label>
      <input type="text" class="form-control" id="route-route-value" v-model="model.route" />
    </div>

    <div class="route-order  input-bool">
      <label for="route-order-value">Order</label>
      <input type="text" class="form-control" id="route-order-value" v-model="model.order" />
    </div>
    <div class="route-enabled  input-bool">
      <label for="route-nested-enabled-select">Enabled</label>
      <select id="route-nested-enabled-select" class="form-control" v-model="model.enabled">
        <option value>- select -</option>
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    </div>
    <div class="route-nested-routing  input-bool">
      <label for="route-nested-routing-select">Nested Routing</label>
      <select id="route-nested-routing-select" class="form-control" v-model="model.nestedRouting">
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
    <div class="route-roles">
      <label for="route-roles-select">Roles</label>
      <div class="form-inline">
        <select class="form-control" id="route-roles-select" >
          <option v-for="item in model.roles" :key="item">{{item}}</option>
        </select>
      <button class="btn btn-primary"><i class="fa fa-plus-circle"></i> </button>
      <button class="btn btn-danger"><i class="fa fa-minus-circle"></i> </button>
      </div>
    </div>
  </div>
  
  <child-route-info :model="model.children" class="child-routes" v-if="model.children.length"></child-route-info>

  </div>
</template>
<script src="./route-info.js"></script>
<style lang="scss" src="./route-info.scss" scoped></style>
