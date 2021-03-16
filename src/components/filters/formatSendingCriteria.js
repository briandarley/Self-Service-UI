import Vue from "vue";
import injector from "vue-inject";

export default  function formatSendingCriteria(value, codeValues) {
  let helper = injector.get("MassMailCodeValueHelperService");
  
  let reduced = helper.getCodeValueChildParentRelations(JSON.parse(JSON.stringify(codeValues)))

  let matching = reduced.filter(item => value.audienceSelection.includes(item.code));

  let displayValues = matching.map(item=> {
    if(item.parent)
    {
      return item.parent.description.substring(0, 3);
    }
    return item.description.substring(0, 3);

  });
  
  displayValues = displayValues.filter((v,i,a)=> a.indexOf(v)===i).join(",")
  
  return displayValues;
  
}

Vue.filter("formatSendingCriteria", formatSendingCriteria);
