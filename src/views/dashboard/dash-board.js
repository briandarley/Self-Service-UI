import Vue from "vue"
import Chartist from "chartist";
import {
  Component

} from "vue-property-decorator";



@Component({
  name: 'dash-board',
  dependencies: ['$', 'moment', 'UserService', 'DashboardService'],
  components: {}
  //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
})

export default class DashBoard extends Vue {
  nextGalSync = "";

  pad(num, size) {
    var s = "0" + num;
    return s.substr(s.length - size);
  }

  async calculateGalSync() {
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


      // If the count down is finished, write some text 
      if (distance < 0) {
        clearInterval(x);
        that.nextGalSync = "";
        await this.calculateGalSync();
      }
    }, 1000);
  }

  async getProvisionsToday() {


    const dataProvisionsChart = {
      labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      series: [
        [2, 21, 13, 18, 17, 10, 4]
      ]
    };

    const optionsProvisionsChart = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 30,
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

    }, 1000);

  }

  async getLockoutsToday() {
    const dataProvisionsChart = {
      labels: ['12', '2', '4', '6', '8', '10', '12', '2', '4', '6', '8', '10'],
      series: [
        [122, 110, 98, 142, 235, 300, 143, 81, 73, 65, 110, 88]
      ]
    };

    const optionsProvisionsChart = {

      axisX: {
        showGrid: false
      },
      low: 0,
      high: 400,
      chartPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    };

    const responsiveOptions = [
      ['screen and (max-width: 440px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];


    setTimeout(() => {

      let chart = new Chartist.Bar(".ad-lockouts-today", dataProvisionsChart, optionsProvisionsChart, responsiveOptions);
      this.startAnimationForBarChart(chart);
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
  startAnimationForBarChart(chart) {
    let seq2, delays2, durations2;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq2 = 0;
  }


  async mounted() {
    //console.log(this.UserService);

    //child views are 'mounted' before parent is 'mounted' 
    this.calculateGalSync();
    this.getProvisionsToday();
    this.getLockoutsToday();
    
  }
  async created() {
    //called before child views are mounted
  }
}