import Vue from "vue"
import { Component, Watch } from "vue-property-decorator";
import Spinner from '@/components/spinner/spinner.vue';

@Component({
    name: 'gal-sync-widget',
    dependencies: ['$','moment','toastService','spinnerService','DashboardService'],
    components: {Spinner}    
    
  })

export default class GalSyncWidget extends Vue {
  nextGalSync = "";

  async mounted() { 
    this.toastService.set(this);
    await this.calculateGalSync();
  }

  pad(num, size) {
    var s = "0" + num;
    return s.substr(s.length - size);
  }

  async calculateGalSync() {
    if(this.$refs && this.$refs.spinner)
    {
      this.$refs.spinner.showSpinner();
    }
    
    this.nextGalSync = "...";
    let val = await this.DashboardService.getNextGalSync();

    let countDownDate = val; //val.format("hh:mm");
    let that = this;
    // Update the count down every 1 second
    let x = setInterval(async () => {
      // Get todays date and time
      var now = new Date().getTime();
      // Find the distance between now and the count down date
      var distance = countDownDate - now;
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      that.nextGalSync = `${minutes}:${this.pad(seconds,2)}`;
      
      if(that.$refs && that.$refs.spinner)
      {
        that.$refs.spinner.hideSpinner();
      }
      
      // If the count down is finished, write some text 
      if (distance < 0) {
        clearInterval(x);
        that.nextGalSync = "";
        if(that.$refs && that.$refs.spinner)
        that.$refs.spinner.showSpinner();

        await that.calculateGalSync();
        
        if(that.$refs && that.$refs.spinner)
        that.$refs.spinner.hideSpinner();
      }
    }, 1000);
  }
}

