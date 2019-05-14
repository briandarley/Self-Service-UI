import Vue from "vue"


export default function toPrimaryDesignation(value) {
  if (value === undefined || value === null) return "";

  switch (value) {
    case 0:
      return "None";

    case 1:
      return "UNC";

    case 2:
      return "Hospital";

    case 3:
      return "UNC and Hospital";

    default:
      return "Oops?";


  }

}

Vue.filter("toPrimaryDesignation", toPrimaryDesignation);