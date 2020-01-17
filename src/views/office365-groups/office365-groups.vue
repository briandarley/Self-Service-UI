<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons" aria-hidden="true">group</i>
        </div>
        <h1>Office365 Groups</h1>
      </div>
      <div class="card-body">
        <div class="border border-primary">
        <div class="alert alert-info">
          <div class="info">
            <i class="fa fa-info-circle" aria-hidden="true"></i>
          </div>
          <p
            class="my-4 pb-3"
          >Welcome to the Office 365 Groups Site. Below you will find some links to pertinent information for Office 365 Groups.</p>
        </div>

        <transition-group tag="ul" name="fly_in">
          <li v-for="item in links" :key="item.title">
            <a :href="item.href" target="_blank">{{item.title}}</a>
          </li>
        </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./office365-groups.js"></script>
<style lang="scss" src="./office365-groups.scss" scoped></style>
