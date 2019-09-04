<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons" aria-hidden="true">check_circle</i>
        </div>
        <h3>Check Subscriptions</h3>
      </div>
      <div class="card-body" v-if="this.userSubscriptions.length > 0">
        <div class="container">
          <div class="row">
            <div class="col">
              <div class="alert alert-info">
                <div class="info">
                  <i class="fa fa-info-circle" aria-hidden="true"></i>
                </div>
                <div>
                  <p>
                    Below is a listing of your listserv subscriptions.
                    Remember, to be able to send to a listserv,
                    you must send from an email address that is subscribed to the list being sent to.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="subscription-info">
            <div class="bg-primary text-white row-header">
              <div class="col">List Name</div>
            </div>
            <div class="list-container">
              <div class="result-grid" v-for="item in userSubscriptions" :key="item.name">
                <div class="col">{{item.name}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body" v-else>
        <div class="container">
          <div class="system-message">
            <div class="alert alert-warning">
              <div class="info">
                <i class="far fa-stop-circle" aria-hidden="true"></i>
              </div>
              <div>
                <p
                  class="pt-3 h4 text-secondary"
                >It appears you are not subscribed to any lists at this time.</p>
                <p>We've tried to retrieve your subscriptions but none were found</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./subscriptions.js"></script>
<style lang="scss" src="./subscriptions.scss" scoped></style>
