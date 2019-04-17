import Vue from "vue"
var numeral = require("numeral");

export default function formatNumber(value) {
  return numeral(value).format("0,0");
}


Vue.filter("formatNumber", formatNumber);
