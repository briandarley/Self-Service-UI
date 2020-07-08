import Vue from "vue"
import { Component,Watch } from "vue-property-decorator";
var numeral = require("numeral");

@Component({
    name: 'progress-notification',
    dependencies: ['$'],
    props:['campaign','progressNotications'],
    filters: {
      formatTime: function(value){
        if(!value) return "";
        let response = value;
        let isMin = false;
        if( response  > 100)
        {
          response  =  response /60;
          isMin = true;
        }

        if( isMin) {
          return numeral(response).format("0,0") + " min";
        }
        return numeral(response).format("0,0") + " sec";
      }

    }
    
    
  })

export default class ProgressNotification extends Vue {
  notification = {};

@Watch("progressNotications", {immediate:false, deep:true})
onProgressNoticationsChanged(entities){

  if(!entities.some(c=> c.campaignId == this.campaign.id)) return;
  let notification = entities.find(c=> c.campaignId == this.campaign.id);

  let totalMessages = notification.totalMessages;
  totalMessages = totalMessages ? totalMessages: 1;

  let messagesRemaining = notification.messagesRemaining;
  messagesRemaining =  messagesRemaining ?  messagesRemaining:0;

  let progress = Math.round(((totalMessages - messagesRemaining)/totalMessages) * 100);
  this.notification = notification;
  this.notification.progress = progress;



}



}

