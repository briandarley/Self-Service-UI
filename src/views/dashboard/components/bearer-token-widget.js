import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
    name: 'bearer-token-widget',
    dependencies: ['$','moment','toastService','spinnerService','UserService']
    
  })

export default class BearerTokenWidget extends Vue {
  authTime = null; 
  expiresAt = null;
  async mounted() { 
    this.toastService.set(this);
    let user = (await this.UserService.get());
    
    this.authTime = new Date(user.profile.auth_time * 1000).toLocaleString("en-US", {timeZone: "America/New_York"});
    this.expiresAt = new Date(user.expires_at * 1000).toLocaleString("en-US", {timeZone: "America/New_York"});

    
  }
  async copyToken() {
    let token = (await this.UserService.get()).access_token;
    
    
    let $ = this.$;

    let $element = $('<input id="copy-element">').val("Bearer " + token).appendTo('body').select()

    window.document.execCommand("copy");

    $($element).remove();

    this.toastService.success("Successfully copied Bearer token to clipboard");
  }
}

