import Vue from "vue";
import Toastr  from "vue-toastr";
import ProgressBar from './progress-bar/progress-bar.vue';
import TabbedControl from './tabbed-control/tabbed-control.vue';
import TabbedItem from './tabbed-control/tabbed-item.vue';
import ConfirmDialog from './dialogs/confirm-dialog.vue';
import TypeAhead from './type-ahead/type-ahead.vue';
import ToggleSwitch from './toggle-switch/toggle-switch.vue';
import DatePicker from './date-picker/date-picker.vue';
import UserListManagement from './user-list-management/user-list-management.vue';
import ManagerListManagement from './manager-list-management/manager-list-management.vue';
import './test/test-parent.vue';
import './test/test-child.vue';
import './pager/pager.vue';
export {default as VueRouter} from "vue-router";
import PopOver from './popover/popover.vue'
import RouteInfo from '../views/administration/route-management/route-info/route-info.vue';
import ChildRouteInfo from '../views/administration/route-management/child-route-info/child-route-info.vue';




Vue.component("vue-toastr", Toastr);
Vue.component("progress-bar", ProgressBar);
Vue.component("tabbed-control", TabbedControl);
Vue.component("tabbed-item", TabbedItem);
Vue.component("confirm-dialog", ConfirmDialog);
Vue.component("type-ahead", TypeAhead);
Vue.component("toggle-switch", ToggleSwitch);
Vue.component("date-picker", DatePicker);
Vue.component("user-list-management",  UserListManagement);
Vue.component("manager-list-management",  ManagerListManagement);
Vue.component("route-info",  RouteInfo);
Vue.component("child-route-info",  ChildRouteInfo);
Vue.component("pop-over",  PopOver);