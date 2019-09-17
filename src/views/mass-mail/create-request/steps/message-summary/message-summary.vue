<template>
  <form @submit.prevent.prevent class="container" autocomplete="off" ref="submitForm">
    <div class="border border-primary form-group">
      <div class="bg-primary text-white row-header">
        <div class="pl-3">Create Mass Mail - Message Summary</div>
      </div>

      <div class="container">
        <div class="two-column">
          <div class="form-group">
            <span class="label">Send Date</span>
            <span class="entity-value ml-3">{{model.sendDate | formatDate}}</span>
          </div>
          <div class="form-group">
            <span class="label">Expiration Date</span>
            <span class="entity-value ml-3">{{model.expirationDate | formatDate}}</span>
          </div>
        </div>
        <div class="one-column">
          <ul>
            <li>
              <span class="label">Send From</span>
              <span class="entity-value">{{model.sendFrom | formatSender}}</span>
            </li>
            <li>
              <span class="label">Reply To</span>
              <span class="entity-value">{{model.replyTo | formatSender}}</span>
            </li>
            <li>
              <span class="label">Subject</span>
              <span class="entity-value">{{model.subject}}</span>
            </li>
            <li>
              <span class="label">Sponsoring Organization</span>
              <span class="entity-value">{{model.sponsoringUniversity}}</span>
            </li>
            <li>
              <span class="label">Priority</span>
              <span class="entity-value">{{model.priority}}</span>
            </li>
            <li>
              <span class="label">Sending Criteria</span>
              <span class="entity-value">
                {{model.targetPopulation | formatSendingCriteria}}
                {{model.targetEmployee | formatEmployeeCriteria}}
              </span>
            </li>
          </ul>
        </div>


        <div class="submit d-flex justify-content-end my-4">
          <button class="btn btn-primary">
            <i class="fas fa-book-reader mr-3"></i>
            <span>Preview Message</span></button>
                    
        </div>
      </div>
    </div>
  </form>
</template>
<script src="./message-summary.js"></script>
<style lang="scss" src="./message-summary.scss" scoped></style>
