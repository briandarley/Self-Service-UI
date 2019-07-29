<template>
  <form @submit.prevent.prevent class="container validation-form" autocomplete="off">
    <div class="border border-primary">
      <div class="bg-primary text-white row-header">
        <div class="pl-3">Create Mass Mail - Basic Information</div>
      </div>
      <div class="two-column">
        <div class="form-field">
          <date-picker
            label="Send Date"
            :selected-date.sync="model.sendDate"
            minDate="today"
            ref="dtSendDate"
            v-validate="'required'"
            data-validation="{'name': 'Send Date Required','required': true}"
          ></date-picker>
        </div>
        <div class="form-field">
          <date-picker
            label="Expiration Date"
            :selected-date.sync="model.expirationDate"
            minDate="today"
            ref="dtExpirationDate"
            v-validate="'required'"
            data-validation="{'name': 'Expiration Date Required','required': true}"
          ></date-picker>
        </div>
      </div>
      <!-- Send From -->
      <div class="one-column">
        <div class="form-field">
          <div class="form-group form-inline">
            <label for="send-from">Send From</label>
            <div>
              <input
                type="text"
                id="send-from"
                class="form-control"
                ref="sendFrom"
                v-model="model.sendFrom"
                :placeholder="defaultMailAddress"
                data-validation="{'name': 'E-mail','type':'email'}"
              />

              <span
                class="input-group-addon btn btn-outline-light text-info border-secondary"
                @click="model.sendFrom = ''"
              >
                <i class="fa fa-at"></i>
              </span>

              <pop-over
                class="col-pos-2"
                title="Send From"
                autocomplete="off"
                :data-content="`If you do not wish to receive replies to your message, specify ${defaultMailAddress} in the 'Send From' field and leave the 'Reply To' field blank`"
                link-text="Don't want to receive replies?"
              ></pop-over>
            </div>
          </div>
        </div>
      </div>
      <!-- Reply To -->
      <div class="one-column">
        <div class="form-field">
          <div class="form-group form-inline">
            <label for="reply-to">Reply To (optional)</label>
            <div class="field-icon-grp">
              <input
                type="text"
                id="reply-to"
                ref="replyTo"
                class="form-control"
                v-model="model.replyTo"
                autocomplete="off"
                :placeholder="defaultMailAddress"
                data-validation="{'name': 'E-mail','type':'email'}"
              />
              <span
                class="input-group-addon btn btn-outline-light text-info border-secondary"
                @click="model.replyTo = ''"
              >
                <i class="fa fa-at"></i>
              </span>

              <pop-over
                title="Reply To"
                data-content="This is where e-mail replies will be delivered. This can be a shared folder or commercial mail account. If left blank, defaults to the same address as 'Send From'"
              ></pop-over>
            </div>
          </div>
        </div>
      </div>
      <!-- Subject -->
      <div class="one-column">
        <div class="form-field">
          <div class="form-group form-inline">
            <label for="subject required">Mass Mail Subject</label>
            <div class="standard-text">
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
      </div>
      <!-- Sponsor -->
      <div class="one-column">
        <div class="form-field">
          <div class="form-group form-inline">
            <label for="subject">Sponsoring University</label>
            <div class="standard-text">
              
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
      </div>
      <!-- Priority -->
      <div class="one-column">
        <div class="form-field">
          <div class="form-group form-inline">
            <label for="subject">Priority</label>
            <div class="standard-text">
              <select
                id="priority"
                class="form-control"
                v-model="model.priority"
                ref="priority"
                data-validation="{'name': 'Priority', 'error': 'Priority is Required','required': true}"
              >
                <option value>--Select Priority--</option>
                <option>Informational</option>
                <option>Formal Notice</option>
              </select>
              <pop-over
                title="Priority"
                data-content="There are two priority classes of mass e-mail: Formal Notice and Informational. The priority class of the message affects who receives the message."
              ></pop-over>
            </div>
          </div>
        </div>
      </div>
      <div class="one-column-text-area">
        <div class="form-field">
          <div class="form-group">
            <div class="label-pop-over-grp">
              
                <label for="message-comments">Comments (optional, not published)</label>
                <pop-over
                  title="Comments"
                  data-content="Special instructions or notes pertinent to the e-mail. Text entered in this field do not become part of the message that is e-mailed. It is appended to the comments log and is available each time the request is viewed."
                ></pop-over>
              
            </div>
            <textarea name="message-comments" id="message-comments" class="form-control" rows="5" v-model="model.comments"></textarea>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
<script src="./basic-information.js"></script>
<style lang="scss" src="./basic-information.scss" ></style>
