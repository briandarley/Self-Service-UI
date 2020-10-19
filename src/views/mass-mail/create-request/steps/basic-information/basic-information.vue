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
            @date-changed="onSendDateChanged"
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
      <!-- 10/19/2020, removed fields 'Send From' and 'Reply To' because of privacy concerns 
      Process sends messages in batches of 100 and must be in BCC to avoid privacy issues when the recipients are in the To field.
      Otherwise we have to send requests one at a time which would slow everything dowd immensely
      --> 

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
            <label for="subject">Sponsoring Office</label>
            <span class="required mr-5">Required</span>
          </div>
            <div class="form-inline">
            <input
              type="text"
              id="sponsoringUniversity"
              ref="sponsoringUniversity"
              class="form-control"
              v-model="model.sponsoringUniversity"
              v-validate="'required'"
              placeholder="School or Department Name"
              autocomplete="off"
              v-select-all
              data-validation="{'name': 'Sponsor', 'error': 'Sponsoring Office/Department Required','required': true}"
            />
            <pop-over
              title="Sponsor"
              data-content="Name of the UNC department, unit, or recognized student organization that is sponsoring this mass email message."
            ></pop-over>
          </div>
          <!-- <div class="form-inline">
            <type-ahead
              :id="'sponsoringUniversity'"
              :placeHolder="'School or Department Name'"
              :value="model.sponsoringUniversity"
              ref="sponsoringUniversity"
              @change="onSponsorChanged"
              :service="getSchoolsDepartmentsLike"
              data-validation="{'name': 'Sponsor', 'error': 'Sponsoring University/Department Required','required': true}"
            ></type-ahead>
            <pop-over
              title="Sponsor"
              data-content="Name of the UNC department, unit, or recognized student organiztion that is sponsoring this mass email message."
            ></pop-over>
          </div> -->
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
