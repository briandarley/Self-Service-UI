import Vue from 'vue';

export default function selectAll() {
  return {
    inserted: function (el) {
      if(!el || !el.addEventListener) return;
      el.addEventListener("focus", function() { 
        
        this.select() 
      
      });
      //console.log("Select all on focus inserted");
      el.focus();
    }
  }
}

Vue.directive('selectAll', selectAll());

