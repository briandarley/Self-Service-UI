<template>
  <div v-if="notification.campaignId">
    <div v-if="notification.messageAction== 'PROCESSING'">
      <h3 class="text-primary">Batch processing initiated...</h3>
    </div>
    <div v-if="notification.messageAction == 'INITIAL_CAMPAIGN_BATCH_SENT'">
        <h3 class="text-primary">MassMail distributing...</h3>
    </div>
    <div v-if="notification.messageAction == 'DELIVERY_REPORT_REQUESTED'">
        <h3 class="text-primary">MassMail processing complete. Creating delivery report.</h3>
    </div>
    <div v-if="notification.messageAction == 'ERRORED'">
        <h3 class="text-primary">MassMail processing encountered an error, requeing.</h3>
    </div>
    
    <div v-if="notification.messageAction == 'CAMPAIGN_BATCH_SENT' || notification.messageAction == 'INITIAL_CAMPAIGN_BATCH_SENT'">
      <div class="stats">
        <div>
          <span>Total Messages</span>
          <span>{{ notification.totalMessages | formatNumber }}</span>
        </div>
        <div>
          <span>Messages Remaining</span>
          <span>{{ notification.messagesRemaining | formatNumber }}</span>
        </div>
        <div>
          <span>Process Time (Per Batch)</span>
          <span>{{ notification.processTimeSeconds | formatTime }}</span>
        </div>
        <div>
          <span>Estimated Completion Time</span>
          <span>{{
            notification.estimatedCompletionSeconds | formatTime
          }}</span>
        </div>
      </div>

      <div class="progress">
        <div
          class="progress-bar"
          role="progressbar"
          aria-valuenow="75"
          aria-valuemin="0"
          aria-valuemax="100"
          :style="{ width: notification.progress + '%' }"
        ></div>
      </div>
    </div>
    
  </div>
</template>
<script src="./progress-notification.js"></script>
<style lang="scss" src="./progress-notification.scss" scoped></style>
