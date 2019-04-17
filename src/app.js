import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import SideMenu from "@/components/side-menu/side-menu.vue";
import TopHeader from "@/components/top-header/top-header.vue";
import SiteFooter from "@/components/footer/site-footer.vue";
import Spinner from '@/components/spinner/spinner.vue';
import SimpleBar from "simplebar"; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import "simplebar/dist/simplebar.css";

@Component({
  name: "App",
  dependencies: ['$','toastService','spinnerService'],
  components: { SideMenu,TopHeader,SiteFooter,Spinner }
})
export default class App extends Vue {
  currentRoute;
  @Watch("$route", { immediate: false })
  onRouteChanged() {
    //newValue, oldValue
    this.spinnerService.hide();
  }
  mounted() {
    let $ = this.$;
    setTimeout(() => {
      new SimpleBar($(".app-section")[0],{ autoHide: false, height: "auto" });
    }, 1000);
  }
  
}