import Vue from "vue"
import {
  Component,
  Watch
} from "vue-property-decorator";

@Component({
  name: 'tabbed-control',
  props: ['tabs','options']
})

export default class TabbedControl extends Vue {
  //@Prop() tabs;
  items = [];
  @Watch('options', {immediate: true})
  onOptionsChanged(newValue){
    if(!newValue) return;
    const options = newValue;
    for(let i= 0; i < options.length; i++){
      let item = this.items.find(c=> c.tab === options[i].tab)
      if(!item) continue;
      
      item.enabled = options[i].enabled;
      
    }
    
    
  }

  @Watch('tabs', {
    immediate: true
  })
  onTabValueChanged(newValue) {
    
    this.items = newValue.split(',').map((c, index) => {
      return {
        active: false,
        label: c,
        index: index,
        tab: `tab_${index}`
        
      }
    });

    this.items[0].active = true;
  }

  tabChanged(index) {
    this.items = this.items.map(c => {
      c.active = false;
      return c;
    });
    const item = this.items.find(c => c.index === index);
    item.active = true;
    this.$emit("tabChange", item);
  }

  mounted() {

  }
}