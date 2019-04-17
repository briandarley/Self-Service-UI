import Vue from 'vue';

export default function {{camelCase name}}() {
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

Vue.directive('{{kebabCase name}}', {{camelCase name}}());

