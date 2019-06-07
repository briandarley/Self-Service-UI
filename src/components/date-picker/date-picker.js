import Vue from "vue"
import {
  Component,Watch
} from "vue-property-decorator";

@Component({
  name: 'date-picker',
  dependencies: ['$', 'moment', 'CommonExtensions'],
  props: ['minDate', 'startDate', 'endDate', 'dateRange', 'selectedDate']
})

export default class DatePicker extends Vue {
  id = ""
  value = "";
  initialized = false;

  //Need to add a watch here to change the value
  //as when the parent changes 'selectedDate', the model will also need to be updated ensuring the 
  //text filed is updated via the bound model 'value'
  @Watch("selectedDate", {immediate:false})
  onSelectedDateChange(newValue){
    this.value = newValue;
  }

  async mounted() {
    this.id = this.CommonExtensions.uuid4();
  }
  showCalendar() {
    const $ = this.$;
    $(`#${this.id}`).datepicker("show");
  }
  async updated() {
    //need to check initialization because if we modify the bound values, updated will be called causing an infinite loop
    
    if(this.initialized) return;
    this.initialized = true;

    const $ = this.$;
    const moment = this.moment;
    let date = new Date();
    date.setDate(date.getDate());
    let minDate = date;
    
    
    if(this.minDate)
    {
      if(this.minDate.toUpperCase() !== "TODAY")
      {
        minDate = moment(this.minDate, "MM/DD/YYYY").format("MM/DD/YYYY");
      }
    }
    else{
      minDate = null;
    }

    if (this.selectedDate) {
      this.value = moment(this.selectedDate,'MM/DD/YYYY').format("MM/DD/YYYY");
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
      .on('change', e => 
      {
        this.$emit('update:selectedDate', e.target.value);
        this.value = e.target.value;
        
      }
      );
    } else {
      let dateModel = {
        forceParse: false
      }
      
      if(minDate){
        dateModel.startDate = minDate;
      }

      $(`#${this.id}`).datepicker(dateModel)
      .on('change', e => {
        
        if(!/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/.test(e.target.value))
        {
          return;
        }
        

        let isValid = moment(e.target.value, 'MM/DD/YYYY', true).isValid();
        
               
        if(isValid && minDate){
          isValid = moment(e.target.value, 'MM/DD/YYYY').isSameOrAfter(moment(minDate, 'MM/DD/YYYY'))
          
        }
        
        if(!isValid)
        {
          e.target.value = "";
        }
        else{
          
          //Required because the desired syntax is ':selected-date.sync' 
          //this syntax makes consuming the component simpler where the consumer doesn't have to trap the event explicitly.
          this.$emit('update:selectedDate', e.target.value);
          this.value = e.target.value;
        }

      });
    }


  }

}