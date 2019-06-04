import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
    name: 'bearer-token-widget',
    dependencies: ['$','moment','toastService','spinnerService','UserService']
    
  })

export default class BearerTokenWidget extends Vue {
  async mounted() { 
    this.toastService.set(this);
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

