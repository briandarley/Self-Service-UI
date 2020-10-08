<template>
  <div class="">
    <div class="progress-container">
      <div class="position-absolute w-100 container-fluid " style="top:0" @click="hideProgress()" v-if="!hideProgressBar">
        <div class="progress">
          <div
            class="progress-bar progress-bar-striped bg-success"
            role="progressbar"
            
            :style="'width:' + width + '%'"
            :aria-valuenow="width"
            
          >
            {{progressMessage}}
          </div>
        </div>
      </div>
    </div>

    <confirm-dialog
      id="groupCreated"
      ref="groupCreated"
      width="800"
      @close="onClose()"
    >
      <div slot="modal-title" class="text-white">
        Group Successfully Created
      </div>
      <div slot="modal-body">
        <div class="lookup-result">
          <div class="alert ">
            <div class="info mt-5" style="align-self: self-start;">
              <i class="fas fa-exclamation-circle"></i>
            </div>
            <div>
              <h4 class="my-4 p-2">
                Group {{ adGroupQueue.name }} has been successfully created.
              </h4>
              <p>
                Please note that the group creation process hasn't fully
                completed as associated mailbox and group rights are still being
                assigned, but you may begin managing members at this time.
              </p>
              <p class="bold">Details</p>
              <ul>
                <li>Name: {{ adGroupQueue.name }}</li>
                <li>GroupTypeCode: {{ adGroupQueue.groupTypeCode }}</li>
                <li>DistinguishedName: {{ adGroupQueue.distinguishedName }}</li>
                <li>Display Name: {{ adGroupQueue.displayName }}</li>
                <li>Ou Name: {{ adGroupQueue.ouName }}</li>
                <li v-if="adGroupQueue.description">
                  Description: {{ adGroupQueue.description }}
                </li>
                <li v-if="adGroupQueue.replyToAddress">
                  Reply To Address: {{ adGroupQueue.replyToAddress }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="onConfirmgroupCreatedClick()">
          edit group
        </button>
        <button class="btn btn-secondary" @click="onCancelgroupCreatedClick()">
          cancel
        </button>
      </div>
    </confirm-dialog>
  </div>
</template>
<script src="./group-create-status.js"></script>
<style lang="scss" src="./group-create-status.scss" scoped></style>
