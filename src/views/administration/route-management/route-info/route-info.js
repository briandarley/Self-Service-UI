import {
  BaseValidateMixin
} from "../../../../components/mixins/index";

import {
  Component,
  Watch
} from "vue-property-decorator";

@Component({
  name: 'route-info',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'RouteSourcesService'],
  props: ['model']
})

export default class RouteInfo extends BaseValidateMixin {
  addNewRole = "";
  seletedRole = "";
  rawJson = "";
  updating = false;

  @Watch("model", {
    immediate: true,
    deep: true
  })
  @Watch("rawJson", {
    immediate: false
  })
  onModelChanged(newValue, oldValue) {
    if (!newValue) {
      return;
    }

    if (typeof newValue === "string") {
      if (!this._isJsonString(newValue)) {
        return;
      }
      let model = JSON.parse(newValue);
      model.parentRouteId = model.parentMenuRouteId;
      if (model.roles) {
        model.roles = model.roles.split(",");
      }
      Object.keys(model).map((key, index) => {
        if (key !== "id") {
          this.model[key] = model[key];
        }
      });
    } else {

      let model = JSON.parse(JSON.stringify(this.model));

      model.parentMenuRouteId = model.parentRouteId;

      if (Array.isArray(model.roles)) {
        model.roles = model.roles.join(",");
      }
      if (Array.isArray(model.alias)) {
        model.alias = model.alias.join(",");
      }
      delete model.parentRouteId;
      delete model.children;

      let json = JSON.stringify(model, null, 2);
      this.updating = true;
      this.rawJson = json;
      this.updating = false;
    }

  }
  _isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }



  async mounted() {
    this.toastService.set(this);
  }

  async onRouteUpdated(route) {
    this.$emit('routeUpdated', route);
  }
  async onRouteDeleted() {
    this.$emit('routeDeleted');
  }
  async saveChanges() {
    try {

      this.spinnerService.show();
      let errors = this.validate(this.$refs.submitForm);
      
      if (errors.length) {
        this.toastService.error("Validation Failed");
        return;
      }
      await this.RouteSourcesService.updateRoute(this.model);

      this.$emit('routeUpdated', this.model)

      this.toastService.success("Successfully saved route");

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to update route");
    } finally {
      this.spinnerService.hide();
    }

  }

  async deleteRoute() {
    try {
      this.spinnerService.show();

      await this.RouteSourcesService.deleteRoute(this.model.id);

      this.toastService.success("Successfully removed entity");
      this.$emit('routeDeleted')

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to delete entity");
    } finally {
      this.spinnerService.hide();
    }
  }




  onAddNewRole() {
    this.$refs.confirmAddRole.show();
  }

  onConfirmAddRoles() {

    if (!this.model.roles) {
      this.model.roles = [];
    }
    this.model.roles.push(this.addNewRole);
    this.addNewRole = "";
    this.$refs.confirmAddRole.hide();
    this.toastService.success("Successfully added role");
  }
  onCancelConfirmAddRoles() {
    this.$refs.confirmAddRole.hide();
  }

  onRemoveRole() {
    if (!this.model.roles) {
      this.model.roles = [];
    }
    let index = this.model.roles.findIndex(c => c == this.seletedRole);

    this.model.roles.splice(index, 1);
    this.seletedRole = "";
  }
}