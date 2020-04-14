import Vue from 'vue';

export default function lowercase() {
  return {
    update: function(el) {
      el.value = el.value.toLowerCase();
    }
    
  }
}

Vue.directive('lowercase', lowercase());

