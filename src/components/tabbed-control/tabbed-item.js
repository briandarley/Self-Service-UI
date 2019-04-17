import Vue from "vue"
import { Component } from "vue-property-decorator";
@Component({
  name: 'tabbed-item',
  props: ['isActive']
})
export default class TabbedItem extends Vue {
  

}
