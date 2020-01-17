<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons" aria-hidden="true">subscriptions</i>
        </div>
        <h1>My Lyris Subscriptions</h1>
      </div>

      <div class="card-body">
        <div class="container" v-if="this.userSubscriptions.length > 0">
          <div class="row">
            <div class="col">
              <div class="alert alert-info">
                <div class="info">
                  <i class="fa fa-info-circle" aria-hidden="true"></i>
                </div>
                <div>
                  <p>
                    Below is a listing of each of your email aliases and their respective listserv subscriptions.
                    Remember, to be able to send to a listserv,
                    you must send from an email address that is subscribed to the list being sent to.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="subscription-info">
            <div class="row">
              <div class="col">

                <label class="text-primary" for="subscriber-email">Lyris Subscriber E-mail</label>

                <select name="select" id="subscriber-email" class="form-control" v-model="selectedEmail">
                  <option v-for="item in uniqueEmails" v-bind:key="item">{{item}}</option>
                </select>
              </div>
            </div>
            <div class="mt-3">
              <div class="list-container">
                <div class="header">
                  <span>Lists associated with e-mail</span>
                  <span>{{selectedEmail}}</span>
                </div>

                <div class="records mt-3">
                  <ul>
                    <li v-for="item in selectedList" :key="item.name">{{item.name}}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="container" v-else>
          <div class="alert alert-warning">
            <div class="info">
              <i class="far fa-stop-circle" aria-hidden="true"></i>
            </div>
            <div>
              <p>It appears you are not subscribed to any Lyris Lists.</p>
              <p>The system could not locate any Lyris Lists in which you are a subscriber.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./listserv-subscriptions.js"></script>
<style lang="scss" src="./listserv-subscriptions.scss" scoped></style>
