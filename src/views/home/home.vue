<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons">home</i>
        </div>
        <h3>Self Service Home</h3>
      </div>
      <div class="card-body">
        <div class="border border-primary">
          <div class="alert alert-info">
            <div class="info">
              <i class="fa fa-info-circle"></i>
            </div>
            <div>
              <p>
                Welcome to the ITS Email Self Service Site. Use the buttons on this site to perform
                actions such as creating an email account, requesting an alias or automating calendar events.
              </p>
              <p>
                If you've requested an e-mail account and would like to access your account, navigate to
                <a
                  href="http://heelmail.unc.edu"
                  target="_blank"
                >heelmail.unc.edu</a> enter your Onyen user name and password when prompted.
              </p>
            </div>
          </div>

          <div class="user-actions">
            <div class="action">
              <router-link :to="{name: 'emailsignup'}" class="btn btn-outline-primary">
                <i class="material-icons">email</i>
                <span>Email Sign-Up</span>
              </router-link>
            </div>
            <div class="action">
              <router-link :to="{name: 'listserv-subscriptions'}" class="btn btn-outline-primary">
                  <i class="material-icons">subscriptions</i>
                  <span>Listserv Subscriptions</span>
              </router-link>
            </div>
            <div class="action">
              <router-link :to="{name: 'my-aliases'}" class="btn btn-outline-primary">
                  <i class="material-icons">person_outline</i>
                  <span>My Aliases</span>
              </router-link>
            </div>
            <div class="action">
              <router-link :to="{name: 'my-ad-groups'}" class="btn btn-outline-primary">
                  <i class="material-icons">group_work</i>
                  <span>My AD Groups</span>
              </router-link>
            </div>
            <div class="action">
              <router-link :to="{name: 'my-resources'}" class="btn btn-outline-primary">
                  <i class="fa fa-book"></i>
                  <span>My Resources</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./home.js"></script>
<style lang="scss" src="./home.scss" scoped></style>
