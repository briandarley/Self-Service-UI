import Vue from "vue"
import Chartist from "chartist";
import {
  Component
} from "vue-property-decorator";
import Spinner from '@/components/spinner/spinner.vue';

@Component({
  name: 'ad-lock-widget',
  dependencies: ['$', 'moment', 'UserService', 'DashboardService', 'toastService', 'DataAnalyticsService'],
  components: {
    Spinner
  }

})

export default class AdLockWidget extends Vue {
  async mounted() {
    await this.getLockoutsToday();
  }
  async getLockoutsToday() {
    this.$refs.spinner.showSpinner();

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
      this.$refs.spinner.hideSpinner();
      let chart = new Chartist.Bar(".ad-lockouts-today", dataProvisionsChart, optionsProvisionsChart, responsiveOptions);
      this.startAnimationForBarChart(chart);
    }, 1000);


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
}