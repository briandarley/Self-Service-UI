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
    
    
    $(`#${this.id}`).modal('hide') 
    .appendTo(this.$el);

    /* Optional?
$("#myModal").removeClass("in");
$(".modal-backdrop").remove();
$('body').removeClass('modal-open');
$('body').css('padding-right', '');
$("#myModal").hide();
    */
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
      $(`#${this.id} .modal-dialog`).css("max-width", `${this.width}px`);
    } else {
      $(`#${this.id} .modal-dialog`).css("max-width", `500px`);
    }

  }


}