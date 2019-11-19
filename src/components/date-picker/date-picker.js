import Vue from "vue"
import {
  Component,
  Watch
} from "vue-property-decorator";
// import {
//   timeout
// } from "q";

@Component({
  name: 'date-picker',
  dependencies: ['$', 'moment', 'CommonExtensions'],
  props: ['minDate', 'startDate', 'endDate', 'dateRange', 'selectedDate', 'label', 'id']
})

export default class DatePicker extends Vue {

  value = "";
  initialized = false;

  //Need to add a watch here to change the value
  //as when the parent changes 'selectedDate', the model will also need to be updated ensuring the 
  //text filed is updated via the bound model 'value'
  @Watch("selectedDate", {
    immediate: true
  })
  onSelectedDateChange(newValue) {
    
    let moment = this.moment;

    if (!newValue) {
      this.value = null;
      return;
    }
    let dt = null;
    if (newValue instanceof Date) {
      dt = moment(newValue);
    } else if (newValue.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/g)) {
      dt = moment(newValue, "MM/DD/YYYY");
    } else {
      dt = moment(newValue);
    }

    //let dt = moment(newValue,"MM/DD/YYYY");
    if (dt.isValid()) {
      this.value = dt.format("MM/DD/YYYY");
    } else if (newValue) {
      throw `Date ${newValue} is not a valid date`;
    }


  }
  _attachDateRangePicker() {
    const $ = this.$;

    $.fn.datepicker.defaults.autoclose = true;
    $.fn.datepicker.defaults.orientation = "bottom auto";


    let date = new Date();
    date.setDate(date.getDate());
    let minDate = null;

    if (this.minDate) {
      if (this.minDate === "today") {
        minDate = date;
      } else {
        minDate = this.minDate;
      }
    }


    let model = {
      opens: 'right',
      startDate: this.startDate,
      endDate: this.endDate,
      minDate: minDate
    };

    $(`#${this.id}`).daterangepicker(
        model, () => {}
        //model, (start, end, label) => {}
      )
      .on('change', e => {
        //selected-date

        $(`#${this.id}`).val(e.target.value);
        this.$emit('update:selectedDate', e.target.value);
        //this.value = e.target.value;
      });
  }
  _attachDatePickerBehaviour() {

    const $ = this.$;
    const moment = this.moment;

    $.fn.datepicker.defaults.autoclose = true;
    $.fn.datepicker.defaults.orientation = "bottom auto";

    let date = new Date();
    date.setDate(date.getDate());
    let minDate = null;

    if (this.minDate) {
      if (this.minDate === "today") {
        minDate = date;
      } else {
        minDate = this.minDate;
      }
    }


    let dateModel = {
      forceParse: false
    }

    if (minDate) {
      dateModel.startDate = minDate;
    }

    $(`#${this.id}`).datepicker(dateModel)
      .on('change', e => {
        
        if (!/^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/.test(e.target.value)) {
          return;
        }

        let isValid = moment(e.target.value, ['MM/DD/YYYY', 'M/D/YYYY'], true).isValid();
        


        if (isValid && minDate) {
          isValid = moment(e.target.value, ['MM/DD/YYYY', 'M/D/YYYY']).isSameOrAfter(moment(minDate, ['MM/DD/YYYY', 'M/D/YYYY']).startOf('day'))

        }

        if (!isValid) {
          e.target.value = "";
        } else {

          //Required because the desired syntax is ':selected-date.sync' 
          //this syntax makes consuming the component simpler where the consumer doesn't have to trap the event explicitly.
          this.$emit('update:selectedDate', e.target.value);
          this.$emit('date-changed', e.target.value);
          this.value = e.target.value;
        }

      });





  }

  async mounted() {
    if (this.dateRange === "true") {
      this._attachDateRangePicker();
    } else {
      this._attachDatePickerBehaviour();
    }

  }

  showCalendar() {
    const $ = this.$;

    if (this.dateRange) {
      $(`#${this.id}`).data('daterangepicker').toggle();
    } else {
      $(`#${this.id}`).datepicker("show");
    }
  }


  async controlUpdated() {
    //need to check initialization because if we modify the bound values, updated will be called causing an infinite loop

    if (this.initialized) return;
    this.initialized = true;

    const $ = this.$;
    const moment = this.moment;
    let date = new Date();
    date.setDate(date.getDate());
    let minDate = null;
    if(this.minDate)
    {
      minDate = this.minDate;
    }



    if (this.minDate) {
      if (this.minDate.toUpperCase() !== "TODAY") {
        minDate = moment(this.minDate, "MM/DD/YYYY").startOf('day').format("MM/DD/YYYY");
      }
    } else {
      minDate = null;
    }

    if (this.selectedDate) {
      this.value = moment(this.selectedDate, 'MM/DD/YYYY').startOf('day').format("MM/DD/YYYY");
    }


    $.fn.datepicker.defaults.autoclose = true;
    $.fn.datepicker.defaults.orientation = "bottom auto";
    //$.fn.datepicker.defaults.startDate = date;
    //$.fn.datepicker.defaults.opens = 'right';

    if (this.dateRange && this.dateRange.toString() == "true") {
      let model = {
        opens: 'right',
        startDate: this.startDate,
        endDate: this.endDate,
        minDate: minDate

      };

      $(`#${this.id}`).daterangepicker(
          model, () => {}
          //model, (start, end, label) => {}
        )
        .on('change', e => {

          this.$emit('update:selectedDate', e.target.value);
          this.value = e.target.value;

        });
    } else {
      let dateModel = {
        forceParse: false
      }

      if (minDate) {
        dateModel.startDate = minDate;
      }

      $(`#${this.id}`).datepicker(dateModel)
        .on('change', e => {

          if (!/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/.test(e.target.value)) {
            return;
          }


          let isValid = moment(e.target.value, 'MM/DD/YYYY', true).isValid();


          if (isValid && minDate) {
            isValid = moment(e.target.value, 'MM/DD/YYYY').isSameOrAfter(moment(minDate, 'MM/DD/YYYY').startOf('day'))

          }

          if (!isValid) {
            e.target.value = "";
          } else {

            //Required because the desired syntax is ':selected-date.sync' 
            //this syntax makes consuming the component simpler where the consumer doesn't have to trap the event explicitly.
            this.$emit('update:selectedDate', e.target.value);
            this.value = e.target.value;
          }

        });
    }


  }

}