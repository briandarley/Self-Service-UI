import Vue from "vue";
import Toastr  from "vue-toastr";
import ProgressBar from './progress-bar/progress-bar.vue';
import TabbedControl from './tabbed-control/tabbed-control.vue';
import TabbedItem from './tabbed-control/tabbed-item.vue';
import ConfirmDialog from './dialogs/confirm-dialog.vue';
import TypeAhead from './type-ahead/type-ahead.vue';
import ToggleSwitch from './toggle-switch/toggle-switch.vue';
import './test/test-parent.vue';
import './test/test-child.vue';
import './pager/pager.vue';
export {default as VueRouter} from "vue-router";
//export {default as Toastr}  from "vue-toastr";
//export {default as ProgressBar} from './progress-bar/progress-bar.vue';




Vue.component("vue-toastr", Toastr);
Vue.component("progress-bar", ProgressBar);
Vue.component("tabbed-control", TabbedControl);
Vue.component("tabbed-item", TabbedItem);
Vue.component("confirm-dialog", ConfirmDialog);
Vue.component("type-ahead", TypeAhead);
Vue.component("toggle-switch", ToggleSwitch);
