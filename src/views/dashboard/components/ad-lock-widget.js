import Vue from "vue"
import Chartist from "chartist";
import {
  Component
} from "vue-property-decorator";
import Spinner from '@/components/spinner/spinner.vue';
import { isUndefined } from "util";

@Component({
  name: 'ad-lock-widget',
  dependencies: ['$', 'moment', '_', 'UserService', 'DashboardService', 'toastService', 'DataAnalyticsService'],
  components: {
    Spinner
  }

})

export default class AdLockWidget extends Vue {
  currentDate = new Date();
  get isMaxDate() {


    let todaysBeginDate = this.moment(new Date());
    let currentBeginDate = this.moment(this.currentDate);

    return todaysBeginDate.format("M/dd/YYY") <= currentBeginDate.format("M/dd/YYY");

  }
  async previous() {
    this.currentDate = this.addDays(this.currentDate, -1);
    await this.getLockoutsToday();
  }
  async next() {
    if (this.isMaxDate) return;
    this.currentDate = this.addDays(this.currentDate, 1);
    await this.getLockoutsToday();
  }

  addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  async mounted() {
    await this.getLockoutsToday();
  }
  async getLockoutsToday() {
    this.$refs.spinner.showSpinner();

    let data = await this.DataAnalyticsService.getLockoutAnalytics(this.currentDate);

    /*
    To pretty up the grid and not over pack with hour labels make all odd hour intervals even
    */
    let response = data.map(c => {
      if ((c.lockHour % 2) > 0) {
        c.lockHour -= 1;
      }
      return c;
    });

    /*
    Perform reduce to group the lockHours and sum them up
    */
    let times = [];
    let groups = [];
    if (response.length > 0) {
      groups = response.reduce((res, value) => {
        if (!res[value.lockHour]) {
          res[value.lockHour] = {
            lockHour: value.lockHour,
            count: 0
          };
          times.push(res[value.lockHour])
        }
        res[value.lockHour].count += value.count;
        return res;
      });
    }

    /*
      Convert the lockHours into the 12 hour standard, making 0 hour 12 am, and subtract anything over 12 by 12
    */
    groups = times.map(c => {
      if (c.lockHour == 0) {
        c.lockHour = 12;
      }
      if (c.lockHour > 12) {
        c.lockHour -= 12;
      }
      return c;
    })

    /*
    We now have our basic labels and points for our grid
    */
    let labels = groups.map(c => c.lockHour);
    let series = groups.map(c => c.count);

    /*
    Round the max value up to the nearest 100
    */
    let max = Math.ceil(Math.max.apply(Math, series) / 100) * 100;

    if(isNaN(max) || !isFinite(max)){
      max = 100;
    }
    /*
    It's likely that not all labels possible will be in the series set, so fill in where it's missing
    */
   
    var expected = [12, 2, 4, 6, 8, 10, 12, 2, 4, 6, 8, 10];
    for (let i = 0; i < expected.length; i++) {

      if (labels[i] != expected[i]) {
        labels.splice(i, 0, expected[i]);
        series.splice(i, 0, 0);

      }
    }

    /*
    Construct our chart
    */
    const dataProvisionsChart = {
      labels: labels,
      series: [
        series
      ]
    };

    const optionsProvisionsChart = {

      axisX: {
        showGrid: false
      },
      low: 0,
      high: max,
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