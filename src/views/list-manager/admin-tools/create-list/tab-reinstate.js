import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
  name: "reinstate-tab",
  dependencies: ["$", "moment", "toastService", "spinnerService"],
  props: ["emailAddresses"]
})
export default class TabReinstate extends Vue {
  deleted = [];
  certify = false;
  async mounted() {
    this.toastService.set(this);
  }
  async created() {
    //called before child views are mounted
  }
}