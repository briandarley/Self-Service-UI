<template>
  <div id="testMessages">
    <div class="card">
      <div class="card-header bg-primary text-white">Send Test Message</div>
      <div class="card-body">
        <div class="form-group">
          <label for="emailTest">Email Address</label>
          <div class="form-inline">
            <input
              type="text"
              class="form-control w-50"
              id="emailTest"
              v-select-all
              v-model="email"
              v-on:keyup.13="add()"
            />
            <button class="btn btn-primary" type="button" @click="add()">Add</button>
            <button class="btn btn-secondary" type="button" @click="clear()">Clear</button>
          </div>
        </div>
        <div class="form-group" v-if="entities.length">
          <label>Recipients</label>
          <ul>
            <li v-for="(item, index) in entities" :key="index">
              <span>{{item.email}}</span>
              <span>
                <a href="#" @click.prevent="deleteFavoriteReviewer(item.email)">remove</a>
              </span>
            </li>
          </ul>
        </div>
        <div v-else>
          <div class="alert alert-info">
            <div class="info">
              <i class="fa fa-info-circle"></i>
            </div>
            <div>
              <p>To send a test message, add an email to the list</p>
              <p>For your convenience, the email addresses entered will be saved for future campaigns</p>
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer text-right bg-transparent">
        
          <button
            class="btn btn-primary mr-3"
            type="button"
            @click="sendTestMessage()"
            :class="{disabled: !entities.length}"
            :disabled="!entities.length"
          >
            <i class="fas fa-envelope-open-text mr-3"></i>
            <span>Send Test Message</span>
          </button>

      </div>
    </div>
   
  </div>
</template>
<script src="./test-messages.js"></script>
<style lang="scss" src="./test-messages.scss" scoped></style>
