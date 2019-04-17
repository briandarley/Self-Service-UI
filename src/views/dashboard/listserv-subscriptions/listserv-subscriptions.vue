<template>
  <div class="container">
    <div class="card card-icon" v-if="this.userSubscriptions.length > 0">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons">subscriptions</i>
        </div>
        <h3>My Lyris Subscriptions</h3>
      </div>

 

      <div class="card-body">
        <div class="row">
          <div class="col">
            <div class="alert alert-info">
              <div class="info">
                <i class="fa fa-info-circle"></i>
              </div>
              <p class="py-3">
                Below is a listing of each of your email aliases and their respective listserv subscriptions.
                Remember, to be able to send to a listserv,
                you must send from an email address that is subscribed to the list being sent to.
              </p>
            </div>
          </div>
        </div>





        <div class="subscription-info">
          <div class="row">
            <div class="col">
              <span class="text-primary">Lyris Subscriber E-mail</span>
              <select name="select" id="select" class="form-control" v-model="selectedEmail">
                <option v-for="item in uniqueEmails" v-bind:key="item">{{item}}</option>
              </select>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col">
              <span class="text-primary">Lists associated with e-mail <span class="strong">{{selectedEmail}}</span></span>

              <div class="list-container mt-3">
                <ul>
                  <li v-for="item in selectedList" :key="item.name">{{item.name}}</li>
                </ul>
              </div>
            </div>
          </div>

          
         

        </div>
      </div>
    </div>
  </div>
</template>
<script src="./listserv-subscriptions.js"></script>
<style lang="scss" src="./listserv-subscriptions.scss" scoped></style>
