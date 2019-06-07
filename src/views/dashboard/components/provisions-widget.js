import Vue from "vue"
import Chartist from "chartist";
import Spinner from '@/components/spinner/spinner.vue';
import {Component} from "vue-property-decorator";

@Component({
  name: 'provisions-widget',
  dependencies: ['$', 'moment', 'spinnerService', 'DataAnalyticsService'],
  components: {Spinner}

})

export default class ProvisionsWidget extends Vue {
  currentProvisionDate = new Date();

  addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  get provisionsDate() {
    return this.getBeginningDate(this.currentProvisionDate);
  }



  get isMaxDate() {

    let todaysBeginDate = this.moment(this.getBeginningDate(new Date()));
    let currentBeginDate = this.moment(this.getBeginningDate(this.currentProvisionDate));

    return todaysBeginDate.format("M/dd/YYY") <= currentBeginDate.format("M/dd/YYY");

  }

  getBeginningDate(dt) {

    let diff = (7 + (dt.getDay())) % 7;

    let beginDate = this.addDays(dt, (-1 * diff));
    //.toISOString()
    return beginDate;
  }

  async getProvisionsToday() {
    if(!this.$refs.spinner) return;
    this.$refs.spinner.showSpinner();


    let data = await this.DataAnalyticsService.getWeeklyProvisionAnalytics(this.provisionsDate);
    let series = data.map(c => c.count)
    let maxCount = data.sort((a,b)=> {
      if(a.count > b.count) return -1;
      else if(a.count < b.count) return 1;
      return 0;

    });
    
    let high = 80;
    if(maxCount.length){
      high = maxCount[0].count + 10;
    }


    if (this.isMaxDate) {
      //truncate any days if we're n the middle of the week
      let dt = new Date();
      let diff = 1 + (7 + (dt.getDay())) % 7;
      series.length = diff;
    }

    const dataProvisionsChart = {
      labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      series: [
        series
      ]
    };

    const optionsProvisionsChart = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: high,
      chartPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    };



    setTimeout(() => {

      let chart = new Chartist.Line(".provisions-today", dataProvisionsChart, optionsProvisionsChart);
      //document.querySelector('.provisions-today').__chartist__.update();
      this.startAnimationForLineChart(chart);
      if(!this.$refs.spinner) return;
      this.$refs.spinner.hideSpinner();
    }, 1000);

  }

  startAnimationForLineChart(chart) {
    let seq, delays, durations;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  }


  async mounted() {
    await this.getProvisionsToday();
  }

  async previous() {
    this.currentProvisionDate = this.addDays(this.currentProvisionDate, (-7));
    await this.getProvisionsToday();
  }
  async next() {
    if (this.isMaxDate) return;
    this.currentProvisionDate = this.addDays(this.currentProvisionDate, 7);
    await this.getProvisionsToday();
  }

}