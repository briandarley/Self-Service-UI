import Vue from "vue";
import { Component } from "vue-property-decorator";
import "typeahead.js/dist/typeahead.bundle.min";
import "typeahead.js/dist/bloodhound.min";

@Component({
  name: "type-ahead",
  dependencies: ["$"],
  props: ["id", "placeHolder", "label", "service", "value", "minLength"]
})
export default class TypeAhead extends Vue {
  get val() {
    return this.value;
  }
  set val(value) {
    this.$emit("change", value);
  }
  // @Watch('value', {immediate:true})
  // onValueChanged(newValue){
  //   window.console.log(newValue);
  // }
  // checkEnter(e) {
  //   e = e || event;
  //   let txtArea = /textarea/i.test((e.target || e.srcElement).tagName);
  //   return txtArea || (e.keyCode || e.which || e.charCode || 0) !== 13;
  // }
  mounted() {
    const $ = this.$;
    let that = this;
    
    let minLength =
      this.minLength === undefined || this.minLength == null
        ? 1
        : this.minLength;
    let async = minLength > 0;

    let el = $(`#${this.id}`);
    
    

    el.typeahead(
      {
        hint: true,
        highlight: false,
        minLength: minLength
      },
      {
        name: "query-results",
        source: this.service,
        async: async
      }
    )
      .bind("typeahead:select", (event, suggestion) => {
        //console.log(suggestion)
        event.target.value = suggestion;
        that.val = suggestion;
      })
      .bind("typeahead:change", (event, suggestion) => {
        //console.log(suggestion)
        event.target.value = suggestion;
        that.val = suggestion;
      })
      .parent()
      .css("padding", "0");
  }
}