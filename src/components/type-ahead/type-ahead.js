import Vue from "vue";
import { Component } from "vue-property-decorator";
import "typeahead.js/dist/typeahead.bundle.min";
import "typeahead.js/dist/bloodhound.min";

@Component({
  name: "type-ahead",
  dependencies: ["$"],
  props: [
    "id",
    "placeHolder",
    "label",
    "service",
    "value",
    "minLength",
    "displayOptions",
    "dataOptions",
  ],
})
export default class TypeAhead extends Vue {
  currentValue = "";

  get val() {
    return this.value;
  }
  set val(value) {
    
    if(value !== undefined && this.currentValue !== value)
    {
      this.currentValue = value;
      this.$emit("change", value);
    }
    
  }

  setValue(value) {
    const $ = this.$;
    if(!value)
    {
      value = "";
    }
    let el = $(`#${this.id}`);
    $(el).typeahead('val', value);

    
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
  initializeControl() {
    const $ = this.$;
    let that = this;

    let minLength =
      this.minLength === undefined || this.minLength == null
        ? 1
        : this.minLength;
    let async = minLength > 0;

    let el = $(`#${this.id}`);
    
    let displayOptions = this.displayOptions;
    let dataOptions = this.dataOptions;
    if (!displayOptions) {
      displayOptions = {
        hint: true,
        highlight: false,
        minLength: minLength,
      };
    }
    
    if(!dataOptions){
      dataOptions = {
        name: "query-results",
        source: this.service,
        async: async,
      };
    }
    
      el.typeahead(
        displayOptions,
        dataOptions
      )
        .bind("typeahead:select", (event, suggestion) => {
          //window.console.log("typeahead:select");
          event.target.value = suggestion;
          that.val = suggestion;
          el.typeahead('close');
        })
        .bind("typeahead:change", (event, suggestion) => {
          //window.console.log("typeahead:select");
          event.target.value = suggestion;
          that.val = suggestion;
        })
        .parent()
        .css("padding", "0");
    
    
  }
  
  mounted() {
    //this.initializeControl();
    setTimeout(() => {
    this.initializeControl();
    },1500);
  }
}
