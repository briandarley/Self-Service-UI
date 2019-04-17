import Vue from 'vue';

export default function submitOnEnter() {
  return {
    update: function(el, binding) {
    
    },
    bind: function(el, binding) {
      
    },
    inserted: function(el, binding) {
      el.focus();
    }
  }
}

Vue.directive('submit-on-enter', submitOnEnter());

