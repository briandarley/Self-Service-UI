<template>
  <div :id="id" class="col-sm-8">
    <input class="typeahead form-control" type="text" :placeholder="placeHolder" :value="val">
    
  </div>
</template>
<script>
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import "typeahead.js/dist/typeahead.bundle.min";
import "typeahead.js/dist/bloodhound.min";



@Component({
  name: "type-ahead",
  dependencies: ["$"],
  props: ["id", "placeHolder", "label", "service","value"]
})
export default class TypeAhead extends Vue {
  get val() {
    return this.value;
  }
  set val(value) {
    this.$emit("change", value);
  }

  mounted() {
    const $ = this.$;

    $(`#${this.id} .typeahead`)
      .typeahead(
        {
          hint: true,
          highlight: true,
          minLength: 1
        },
        {
          name: "query-results",
          source: this.service,
          async: true
        }
      )
      .bind("typeahead:select", (ev, suggestion) => {
        this.val = suggestion;
      })
      .bind("typeahead:change", (ev, suggestion) => {
        this.val = suggestion;
      })
      .parent()
      .addClass("col-sm-8")
      .css("padding", "0");

      
  }
}
</script>
<style scoped>

</style>
