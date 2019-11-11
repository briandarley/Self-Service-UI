
<script >
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
  name: "my-parent",
  props: ['myChild'],
  template: `<div>
               <h3>Parent's Children:</h3>
               <slot :signal="parentVal" ></slot>
  <span>mychild:{{myChild}}             </span>
             </div>`
})
export default class MyParent extends Vue {
  
  parentVal = "value of parent";

  childchanged(arg1, arg2){
    
    
  }


  mounted() {
    
  }
}
Vue.component("my-parent", MyParent);
</script>

