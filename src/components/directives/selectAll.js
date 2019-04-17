import Vue from 'vue';

export default function selectAll() {
  return {
    inserted: function (el) {
      el.addEventListener("focus", function() { this.select() });
      //console.log("Select all on focus inserted");
      el.focus();
    }
  }
}

Vue.directive('selectAll', selectAll());

