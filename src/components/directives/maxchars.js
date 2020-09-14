import Vue from 'vue';

export default function maxchars() {
  return {
    bind: function(el, binding) {
      var max_chars = binding.expression;
      var handler = function(e) {
        if (e.target.value.length > max_chars) {
          e.target.value = e.target.value.substr(0, max_chars);
        }
      };
      el.addEventListener("input", handler);
    }
  }
}

Vue.directive('maxchars', maxchars());

