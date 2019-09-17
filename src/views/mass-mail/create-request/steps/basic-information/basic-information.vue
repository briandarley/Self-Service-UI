<template>
  <form @submit.prevent.prevent class="container" autocomplete="off" ref="submitForm">
    
    <div class="border border-primary">
      <div class="bg-primary text-white row-header">
        <div class="pl-3">Create Mass Mail - Basic Information</div>
      </div>
      <div class="two-column">
        <div class="form-group">
          <div class="label-info">
            <label for="dtSendDate">Send Date</label>
            <span class="required">Required</span>
          </div>

          <date-picker
            :selected-date.sync="model.sendDate"
            class="form-group"
            minDate="today"
            ref="dtSendDate"
            id="dtSendDate"
            v-validate="'required'"
            data-validation="{'name': 'Send Date Required','required': true}"
          ></date-picker>
        </div>

        <div class="form-group">
          <div class="label-info">
            <label for="dtExpirationDate">Expiration Date</label>
            <span class="required">Required</span>
          </div>

          <date-picker
            id="dtExpirationDate"
            class="form-group"
            :selected-date.sync="model.expirationDate"
            minDate="today"
            ref="dtExpirationDate"
            v-validate="'required'"
            data-validation="{'name': 'Expiration Date Required','required': true}"
          ></date-picker>
        </div>
      </div>
      <!-- Send From -->
      <div class="one-column-email">
        <div class="form-group">
          <label for="send-from">Send From</label>
          <div class="form-inline">
            <input
              type="text"
              id="send-from"
              class="form-control"
              ref="sendFrom"
              v-model="model.sendFrom"
              :placeholder="defaultMailAddress"
              data-validation="{'name': 'E-mail','type':'email'}"
              autocomplete="off"
            />

            <span
              class="input-group-addon btn btn-outline-light text-info border-secondary"
              @click="model.sendFrom = ''"
            >
              <i class="fa fa-at" aria-hidden="true"></i>
            </span>
          </div>
          <pop-over
            class="pop-over"
            title="Send From"
            autocomplete="off"
            :data-content="`If you do not wish to receive replies to your message, specify ${defaultMailAddress} in the 'Send From' field and leave the 'Reply To' field blank`"
            link-text="Don't want to receive replies?"
          ></pop-over>
          <!-- </div> -->
        </div>
      </div>
      <!-- Reply To -->
      <div class="one-column-email">
        <!-- <div class="form-field"> -->
        <div class="form-group">
          <label for="reply-to">Reply To (optional)</label>
          <div class="form-inline">
            <input
              type="text"
              id="reply-to"
              ref="replyTo"
              class="form-control"
              v-model="model.replyTo"
              :placeholder="defaultMailAddress"
              data-validation="{'name': 'E-mail','type':'email'}"
              autocomplete="off"
            />
            <span
              class="input-group-addon btn btn-outline-light text-info border-secondary"
              @click="model.replyTo = ''"
            >
              <i class="fa fa-at" aria-hidden="true"></i>
            </span>

            <pop-over
              title="Reply To"
              data-content="This is where e-mail replies will be delivered. This can be a shared folder or commercial mail account. If left blank, defaults to the same address as 'Send From'"
            ></pop-over>
          </div>
          <!-- </div> -->
        </div>
      </div>
      <!-- Subject -->
      <div class="one-column">
        <div class="form-group">
          <div class="label-info">
            <label for="subject">Mass Mail Subject</label>
            <span class="required mr-5">Required</span>
          </div>

          <div class="form-inline">
            <input
              type="text"
              id="subject"
              ref="subject"
              class="form-control"
              v-model="model.subject"
              v-validate="'required'"
              placeholder="Mass Mail Subject"
              autocomplete="off"
              data-validation="{'name': 'Subject Required','required': true}"
            />
            <pop-over
              title="Subject"
              data-content="The subject line for the message. When the message is sent, the subject line is prepended with wither INFORMATIONAL or FORMAL NOTICE, based on the selected priority."
            ></pop-over>
          </div>
        </div>
      </div>
      <!-- Sponsor -->
      <div class="one-column">
        <div class="form-group">
          <div class="label-info mr-1">
            <label for="subject">Sponsoring University</label>
            <span class="required mr-5">Required</span>
          </div>

          <div class="form-inline">
            <type-ahead
              :id="'sponsoringUniversity'"
              :placeHolder="'School or Department Name'"
              :value="model.sponsoringUniversity"
              ref="sponsoringUniversity"
              @change="onSponsorChanged"
              :service="getSchoolsDepartmentsLike"
              data-validation="{'name': 'Sponsor', 'error': 'Sponsoring Universitry/Department Required','required': true}"
            ></type-ahead>
            <pop-over
              title="Sponsor"
              data-content="Name of the UNC department, unit, or recognized student organiztion that is sponsoring this mass email message."
            ></pop-over>
          </div>
        </div>
      </div>
      <!-- Priority -->
      <div class="one-column">
        <div class="form-group">
          <div class="label-info">
            <label for="subject">Priority</label>
            <span class="required mr-5">Required</span>
          </div>

          <div class="form-inline">
            <select
              id="priority"
              class="form-control"
              v-model="model.priority"
              ref="priority"
              data-validation="{'name': 'Priority', 'error': 'Priority is Required','required': true}"
            >
              <option value="">--Select Priority--</option>
              <option value="Informational">Informational</option>
              <option value="Formal Notice">Formal Notice</option>
            </select>
            <pop-over
              title="Priority"
              data-content="There are two priority classes of mass e-mail: Formal Notice and Informational. The priority class of the message affects who receives the message."
            ></pop-over>
          </div>
        </div>
      </div>
      <div class="one-column-text-area mx-5 mt-5">
        <div class="form-group">
          <div class="label-info">
            <label for="message-comments">Comments (optional, not published)</label>
            <pop-over
              title="Comments"
              data-content="Special instructions or notes pertinent to the e-mail. Text entered in this field do not become part of the message that is e-mailed. It is appended to the comments log and is available each time the request is viewed."
            ></pop-over>
          </div>

          <textarea
            name="message-comments"
            id="message-comments"
            class="form-control"
            rows="5"
            v-model="model.comments"
          ></textarea>
        </div>
      </div>
    </div>
  </form>
</template>
<script src="./basic-information.js"></script>
<style lang="scss" src="./basic-information.scss" ></style>
