<template>

    <input :id="id" class="typeahead form-control" type="text" :placeholder="placeHolder" :value="val" v-select-all>
    
  
</template>
<script>
import Vue from "vue";
import { Component } from "vue-property-decorator";
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
    let that = this;
    $(`#${this.id}`)
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
      .bind("typeahead:select", (event, suggestion) => {
        event.target.value = suggestion;
        that.val = suggestion;
      })
      .bind("typeahead:change", (event, suggestion) => {
        event.target.value = suggestion;
        that.val = suggestion;
      })
      .parent()
      .css("padding", "0");

      
  }
}
</script>
<style scoped>

</style>
