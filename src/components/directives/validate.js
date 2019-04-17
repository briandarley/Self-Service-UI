/* eslint-disable */
import Vue from 'vue';

export default function validate() {
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

Vue.directive('validate', validate());

