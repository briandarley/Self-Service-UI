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
  dependencies: ['$', 'toastService', 'spinnerService', 'EventBus','ScreenReaderAnnouncerService'],
  components: {
    SideMenu,
    TopHeader,
    SiteFooter,
    Spinner
  }
})
export default class App extends Vue {
  currentRoute;
  groupCreateModel = {};

  @Watch("$route", {
    immediate: false
  })
  onRouteChanged() {
   
    this.spinnerService.hide();
    this.$refs.mainSpinner.hideSpinner();
    //$("body").focus();
    //$(".skip-main").focus();

    // setTimeout(()=> {
    //   this.toastService.success("Switching focus");
    //   $(".top-header").focus();
    // }, 1000);
  }

  printWelcome(){
    window.console.log(`
    
    
    


                                                                                                                                                                                                         
                                                                                                                                                                                                         
    UUUUUUUU     UUUUUUUUNNNNNNNN        NNNNNNNN        CCCCCCCCCCCCC                                                                                                         
    U::::::U     U::::::UN:::::::N       N::::::N     CCC::::::::::::C                                                                                                         
    U::::::U     U::::::UN::::::::N      N::::::N   CC:::::::::::::::C                                                                                                         
    UU:::::U     U:::::UUN:::::::::N     N::::::N  C:::::CCCCCCCC::::C                                                                                                         
     U:::::U     U:::::U N::::::::::N    N::::::N C:::::C       CCCCCC                                                                                                         
     U:::::D     D:::::U N:::::::::::N   N::::::NC:::::C                                                                                                                       
     U:::::D     D:::::U N:::::::N::::N  N::::::NC:::::C                                                                                                                       
     U:::::D     D:::::U N::::::N N::::N N::::::NC:::::C                                                                                                                       
     U:::::D     D:::::U N::::::N  N::::N:::::::NC:::::C                                                                                                                       
     U:::::D     D:::::U N::::::N   N:::::::::::NC:::::C                                                                                                                       
     U:::::D     D:::::U N::::::N    N::::::::::NC:::::C                                                                                                                       
     U::::::U   U::::::U N::::::N     N:::::::::N C:::::C       CCCCCC                                                                                                         
     U:::::::UUU:::::::U N::::::N      N::::::::N  C:::::CCCCCCCC::::C                                                                                                         
      UU:::::::::::::UU  N::::::N       N:::::::N   CC:::::::::::::::C                                                                                                         
        UU:::::::::UU    N::::::N        N::::::N     CCC::::::::::::C                                                                                                         
          UUUUUUUUU      NNNNNNNN         NNNNNNN        CCCCCCCCCCCCC                                                                                                         
    
          

      Self Service                                                                                                                                                                               
    
    `)

  }

  mounted() {
    this.printWelcome();
    let $ = this.$;
    this.$refs.mainSpinner.showSpinner();
   
    new SimpleBar($(".app-section")[0], {
      autoHide: false,
      height: "auto"
    });

    setTimeout(() => {
    
    this.EventBus.attachEvent("attach-scroll", this.attachScrollBar);  
    }, 50);
    
    

    this.EventBus.attachEvent('announcement-page-load', this.onAnnouncePageLoad);
    this.EventBus.attachEvent('announcement-send-announcement', this.onAnnounceMessage);
    this.EventBus.attachEvent('announcement-clear', this.onAnnounceClear);
    
  }

  onAnnouncePageLoad(page) {
    let announcer = window.document.getElementById("announcer");
    announcer.innerHTML = `${page} has loaded`;
    setTimeout(() => {
      this.onAnnounceClear();
    }, 500);
  }
  onAnnounceMessage(message) {
    let announcer = window.document.getElementById("announcer");
    announcer.innerHTML = message;

    setTimeout(() => {
      this.onAnnounceClear();
    }, 500);

  }
  onAnnounceClear() {
    let announcer = window.document.getElementById("announcer");
    announcer.innerHTML = "";
  }
 
  attachScrollBar() {
    let $ = this.$;
    
    new SimpleBar($(".app-section")[0], {
      autoHide: false,
      height: "auto"
    });
    
    
    
    //let height = simple.el.scrollHeight;
    //$('#appSpinner').height(height);
    //$('#appSpinner').height("100vh");
    
    $('#appSpinner').height($('#appSpinner').parent().height() );
    

    //execute every 100ms, then stop after 1sec
    let handle = setInterval(() => {
      //simple.recalculate();
      //height = simple.el.scrollHeight;
      //$('#appSpinner').height("100vh");
      $('#appSpinner').height($('#appSpinner').parent().height() );
      
    }, 100)

    setTimeout(() => {
      clearInterval(handle)
    }, 1000);




  }
  sideBarCollapsed = false;
  toggleMenu() {
    this.sideBarCollapsed = !this.sideBarCollapsed;
    let message = "Main menu is now ";
    if(this.sideBarCollapsed) {
      message += "  minimized";
    }
    else {
      message += " expanded";
    }
    this.ScreenReaderAnnouncerService.sendAnnouncement(message);
    
  }


}