import Vue from 'vue';

export default function tabindex() {
  return {
    
    inserted: function(el) {
      el.setAttribute('tabindex', 0)  
    }
  }
}

Vue.directive('tabindex', tabindex());

