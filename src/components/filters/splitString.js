import Vue from "vue"


export default function splitString(value, character) {
  if(!value) return [];
  return value.split(character);
}


Vue.filter("splitString", splitString);
