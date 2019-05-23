import Vue from "vue";
import {
  Component,
  Watch
} from "vue-property-decorator";
import SideMenu from "@/components/side-menu/side-menu.vue";
import TopHeader from "@/components/top-header/top-header.vue";
import SiteFooter from "@/components/footer/site-footer.vue";
import Spinner from '@/components/spinner/spinner.vue';
import SimpleBar from "simplebar"; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import "simplebar/dist/simplebar.css";

@Component({
  name: "App",
  dependencies: ['$', 'toastService', 'spinnerService', 'EventBus'],
  components: {
    SideMenu,
    TopHeader,
    SiteFooter,
    Spinner
  }
})
export default class App extends Vue {
  currentRoute;
  @Watch("$route", {
    immediate: false
  })
  onRouteChanged() {
    //newValue, oldValue
    this.spinnerService.hide();
    this.$refs.mainSpinner.hideSpinner();
  }
  mounted() {
    let $ = this.$;
    this.$refs.mainSpinner.showSpinner();
    let simple = new SimpleBar($(".app-section")[0], {
      autoHide: false,
      height: "auto"
    });
    // let height = simple.contentEl.scrollHeight;
    // setTimeout(() => {
    //   simple.recalculate();
    //   height = simple.contentEl.scrollHeight;
    //   $('.spinner').height(height);
    // }, 2000);

    this.EventBus.attachEvent("attach-scroll", this.attachScrollBar);
  }
  attachScrollBar() {
    let $ = this.$;
    let simple = new SimpleBar($(".app-section")[0], {
      autoHide: false,
      height: "auto"
    });
    let height = simple.contentEl.scrollHeight;
    $('.spinner').height(height);

    //execute every 100ms, then stop after 1sec
    let handle = setInterval(() => {
      simple.recalculate();
      height = simple.contentEl.scrollHeight;
      $('.spinner').height(height);
    }, 100)

    setTimeout(() => {
      clearInterval(handle)
    }, 1000);




  }

  created() {}

}