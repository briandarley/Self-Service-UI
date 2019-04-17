<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fa-question-circle"></i>
        </div>
        <h3>Lyris Information</h3>
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
  name: "lyris-information",
})
export default class LyrisInformation extends Vue {
  links = [];
  data = [
    {
      title: "FAQ-Administrators ",
      href: "http://help.unc.edu/help/listserv-administrators-faq-collection/"
    },
    {
      title: "FAQ-Subscribers",
      href: "https://help.unc.edu/help/listserv-subscribers-faq-collection/"
    },
    {
      title: "Get Help",
      href: "http://help.unc.edu/help/olhr/"
    },
    {
      title: "Managing a List",
      href: "http://help.unc.edu/45"
    },
    {
      title: "Subscribing to a List",
      href: "http://help.unc.edu/62#d0e86"
    }
  ];
  async mounted() {
  
  
    setTimeout(() => {
      this.links = this.data;
    }, 500);
  }
  
}
</script>
<style scoped>
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
ul {
  margin-left: 50px;
}
li {
  margin: 30px 0;
}
a {
  font-size: 1.5em;
  text-decoration: underline;
}
</style>
