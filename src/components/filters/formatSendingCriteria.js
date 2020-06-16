import Vue from "vue";


export default  function formatSendingCriteria(value, codeValues) {
  
  

  let reduced = codeValues.reduce((val, curVal)=> {
    let items =  val.concat([curVal]);
    if(curVal.entities.length) {

      curVal.entities.forEach(item=> {
        item.parent = curVal;
      })
      return  items.concat(curVal.entities);
    }
    return  items;
  }, [])

  

  let matching = reduced.filter(item => value.campaignAudienceSelections.includePopulations.includes(item.code));
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
