
<script>

import Vue from "vue";
import { Component,Watch } from "vue-property-decorator";
@Component({
  name: "my-child",
  props: ["signal","childVal"],
  template: `<h3>Showing child {{signal}}, childVal = {{childVal}} <br/><button @click="testClick()">test</button></h3>`
 
})
export default class MyChild extends Vue {
  //childVal = null;
testClick(){
 this.$emit('childchanged')
}
 @Watch('childVal', {immediate: true})
 onChildValChanged(newValue, oldValue){
   //console.log(newValue);
   //this.childVal = newValue;
   console.log(this.$parent.parentVal);
   //this.$emit('childchanged', newValue)
 }
  
}
Vue.component("my-child", MyChild);
</script>

