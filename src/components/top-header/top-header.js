import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
    name: 'top-header',
    dependencies: ['$','UserService','EventBus']
    
  })

export default class TopHeader extends Vue {
  name = "";
  async mounted() {
    let user = await this.UserService.get();
    if(user == null) return;
    this.name =  user.profile.preferred_username;
  }
  
  async signOut(){
      await this.UserService.logout();
  }

  
  showSideMenu(){
    this.EventBus.emit("toggle-side-menu");
    
   
  }
}


