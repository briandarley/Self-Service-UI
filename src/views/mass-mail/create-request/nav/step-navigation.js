import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
    name: 'step-navigation',
    props:['currentNavigation','maxNavigation']
    
  })

export default class StepNavigation extends Vue {
  navigation = [
    {
      id: 1,
      nav: 'BASIC_INFORMATION'
    },
    {
      id: 2,
      nav: 'AUDIENCE_CRITERIA'
    },
    {
      id: 3,
      nav: 'MESSAGE_CONTENTS'
    },
    {
      id: 4,
      nav: 'MESSAGE_SUMMARY'
    }
  ]
  getPreviousNav(){
    let currentMaxNav = this.navigation.filter(c=> c.nav === this.currentNavigation);
    let currentMaxId = parseInt(currentMaxNav[0].id);
    let nextNav = this.navigation.filter(c=> c.id === currentMaxId -1);
    if(nextNav.length)
    {
      return nextNav[0].nav;
    }
    return null;
  }
  
  getNextNav(){
    let currentMaxNav = this.navigation.filter(c=> c.nav === this.currentNavigation);
    let currentMaxId = parseInt(currentMaxNav[0].id);
    let nextNav = this.navigation.filter(c=> c.id === currentMaxId +1);
    if(nextNav.length)
    {
      return nextNav[0].nav;
    }
    return null;
  }

  getCurrentNavIndex(){
    let currentMaxNav = this.navigation.filter(c=> c.nav === this.currentNavigation);
    let currentMaxId = currentMaxNav[0].id;
    return currentMaxId;
  }
  isSelected(value){
    return this.currentNavigation === value;
  }
  notSelectable(value){
    if(!this.maxNavigation) return false;    
    let currentMaxId = this.getCurrentNavIndex();

    let selectedNav = this.navigation.filter(c=> c.nav === value);
    let selectedNavId = selectedNav[0].id;

    return currentMaxId <= selectedNavId;
    
  }
  goto(value){
    if(value == this.currentNavigation || this.notSelectable(value)) {
      return;
    }
   

    this.$emit('nav-click', value);
  }

}


