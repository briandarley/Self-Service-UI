<template>
  <div class="toggle-switch">
    <input type="checkbox" :id="id" v-model="checked">
    <label :for="id">Toggle</label>
    <span >{{label}}</span>
  </div>
</template>
<script>
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

@Component({
  name: "toggle-switch",
  dependencies: ["$"],
  props: ["value","label"]
})
export default class ToggleSwitch extends Vue {
  id = null;
  checked = false;
  @Watch("value", {immediate: true})
  onValueChanged(newValue) {
    if (newValue !== undefined) {
      this.checked = newValue;
    }
  }
  @Watch("checked", {immediate: false})
  onCheckChanged(newValue){
    if(newValue !== undefined){
         //Required because the desired syntax is ':selected-date.sync' 
         //this syntax makes consuming the component simpler where the consumer doesn't have to trap the event explicitly.
          this.$emit('update:value', this.checked);
    }
  }
  
  mounted() {
    this.id = this._uid;
  }
}
</script>
<style lang="scss" scoped>
span{
  line-height: initial;
  margin-left: 5px;
}
.toggle-switch {
  display: flex;
  justify-content: center;
  padding-top: 10px;
}
input[type="checkbox"] {
  height: 0;
  width: 0;
  visibility: hidden;
}

label {
  cursor: pointer;
  text-indent: -9999px;
  width: 40px;
  height: 20px;
  background: $gray-500;
  display: block;
  border-radius: 20px;
  position: relative;
}

label:after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 15px;
  height: 15px;
  background: #fff;
  border-radius: 20px;
  transition: 0.3s;
}

input:checked + label {
  background: $carolina-blue;
}

input:checked + label:after {
  left: calc(100% - 3px);
  transform: translateX(-100%);
}

label:active:after {
  width: 15px;
}
</style>
