<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fa-user-cog" aria-hidden="true"></i>
        </div>
        <h1>User Tools</h1>
      </div>
      <div class="card-body">
        <transition-group tag="ul" name="fly_in">
          <li v-for="item in links" :key="item.title">
            <a :href="item.href" target="_blank">{{item.title}}</a>
          </li>
        </transition-group>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
  name: "lyris-login",
  dependencies: ["ConfigReaderService","ScreenReaderAnnouncerService"]
})
export default class LyrisLogin extends Vue {
  links = [];
  data = [
     {
      title: "Browse Lists",
      href: "read/all_forums"
    },
    {
      title: "Reset Password",
      href: "lists.unc.edu/emailpassword.tml"
    }
  ]
  async mounted() {
    const listmanagerSettings = await this.ConfigReaderService.getConfigurationSetting(
      "listmanager"
    );
    const basePath = listmanagerSettings.lyris_list_base_path;

   this.data.forEach(c => {
      c.href = `${basePath}${c.href}`;
    });

    setTimeout(() => {
      this.links = this.data;
    }, 500);

    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Lyris User Tools");
  }
  
}
</script>
<style scoped>
ul, li{
  list-style: none;
  margin: 0;
  padding: 0;
}
ul{
  margin-left: 50px;
}
li{
  margin: 30px 0;
}
a{
  font-size: 1.5em;
  text-decoration: underline;
}
</style>
