import Vue from "vue"


export default function toEmail(value) {
  if (value === undefined || value === null) return [];
  if(typeof value === 'string' )
  {
    return value.toUpperCase().startsWith("SMTP:") ? value.substring(5) : null;
  }
  else{
    let list = value.filter(c=> c.startsWith("smtp:")).map(c=> c.substring(5))
    return  list;
  }
  
}


Vue.filter("toEmail", toEmail);
