<template>
  <form
    @submit.prevent.prevent
    class="container"
    autocomplete="off"
    ref="submitForm"
  >
    <div class="border border-primary form-group">
      <div class="bg-primary text-white row-header">
        <div class="pl-3">Create Mass Mail - Message Summary</div>
      </div>

      <div class="container">
        <div class="summary">
          <div class="two-column header">
            <div>Send Date</div>
            <div>Expiration Date</div>
          </div>
          <div class="two-column">
            <div>{{ model.sendDate | formatDate }}</div>
            <div>{{ model.expirationDate | formatDate }}</div>
          </div>
          <div class="two-column header mt-3">
            <div>Send From</div>
            <div>Reply To</div>
          </div>
          <div class="two-column">
            <div>{{ model.sendFrom | formatSender }}</div>
            <div>{{ model.replyTo | formatSender }}</div>
          </div>

          <div class="one-column header mt-3">
            <div>Subject</div>
          </div>
          <div class="one-column">
            <div>{{ model.subject }}</div>
          </div>

          <div class="one-column header mt-3">
            <div>Sponsoring Organization</div>
          </div>
          <div class="one-column">
            <div>{{ model.sponsoringUniversity }}</div>
          </div>

          <div class="one-column header mt-3">
            <div>Priority</div>
          </div>
          <div class="one-column">
            <div>{{ model.priority }}</div>
          </div>

          <div class="one-column header mt-3">
            <div>Sending Criteria</div>
          </div>
          <div class="one-column">
            <div>
              <div class="ml-4">
                Included Populations: <span class="ml-3">{{ includePopulation }}</span>
              </div>
              
            </div>
          </div>
          <div class="one-column">
            <div>
              <div class="ml-4">
                Excluded Populations: <span class="ml-3" v-if="excludePopulation">{{ excludePopulation }}</span><span class="ml-3" v-else>None</span>
              </div>
            </div>
          </div>

          
        </div>

        <div class="submit d-flex justify-content-end my-4">
          <button class="btn btn-primary" type="button" @click="showPreview()">
            <i class="fas fa-book-reader mr-3"></i>
            <span>Preview Message</span>
          </button>
        </div>

        <test-messages></test-messages>
      </div>
    </div>

    <confirm-dialog id="confirmPreview" ref="confirmPreview" width="800">
      <div slot="modal-title" class="text-white">Preview: Preview Message</div>
      <div slot="modal-body">
        <div class="message-preview" v-html="model.content"></div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="closePreview()">Ok</button>
      </div>
    </confirm-dialog>
  </form>
</template>
<script src="./message-summary.js"></script>
<style lang="scss" src="./message-summary.scss" scoped></style>
