<template>
  
    <confirm-dialog id="confirmCampaignActionDialog" ref="confirmCampaignActionDialog" width="900">
      <div slot="modal-title" class="text-white">{{messageAction.title}}</div>
      <div slot="modal-body">
        <textarea
          name="campaignActionMessage"
          id="campaignActionMessage"
          class="form-control"
          rows="10"
          v-model="messageAction.message"
        ></textarea>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="confirm()">Send Request</button>
        <button class="btn btn-secondary" @click="hide()">Cancel</button>
      </div>
    </confirm-dialog>
  
</template>
<script src="./campaign-communications.js"></script>
<style lang="scss" src="./campaign-communications.scss" scoped></style>
