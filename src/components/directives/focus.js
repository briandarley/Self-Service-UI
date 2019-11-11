import Vue from 'vue';

export default function focus() {
  return {
    update: function(el) {
      
      setTimeout(() => {
        el.focus();
      }, 500);
    
    },
    inserted: function(el) {
     
      el.focus();
       setTimeout(() => {
      
         el.focus();
       }, 800);
    }
  }
}

Vue.directive('focus', focus());

