<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fa-sign-in-alt"></i>
        </div>
        <h3>Lyris Log In</h3>
      </div>
      <div class="card-body">
        <transition-group tag="ul" name="fly_in" >
        
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
  dependencies: ["ConfigReaderService"]
})
export default class LyrisLogin extends Vue {
  links = [];
  data = [
     {
      title: "List Members",
      href: "read/my_forums"
    },
    {
      title: "List Administrators",
      href: "utilities/login"
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
