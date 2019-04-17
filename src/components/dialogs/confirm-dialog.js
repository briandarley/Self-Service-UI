import Vue from "vue"
import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'confirm-dialog',
  dependencies: ['$', 'moment'],
  props: ['id', 'width']
})
export default class ConfirmDialog extends Vue {
  hide() {

    const $ = this.$;
    
    $('.modal').modal('hide') 
    .appendTo(this.$el);
  }

  show() {
    const $ = this.$;
    let element = $("#" + this.id);

    if (this.width) {
      element.modal('show').appendTo('body');
    } else {
      element.modal('show').appendTo('body');
    }
  

    if (this.width) {
      //$(".modal-dialog").css("max-width", `${this.width}px !important`);
      $(".modal-dialog").css("max-width", `${this.width}px`);
    } else {
      $(".modal-dialog").css("max-width", `500px`);
    }

  }


}