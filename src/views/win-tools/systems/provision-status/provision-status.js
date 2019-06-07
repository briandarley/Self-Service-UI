import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
    name: 'provision-status',
    dependencies: ['$','moment','CommonExtensions','toastService','spinnerService','ExchangeToolsService']
    
  })

export default class ProvisionStatus extends Vue {
  provisionSelection = "1";
  provisionRecords = {entities: []}
  criteria = {
    excludedStatuses: [],
    submittedFromDate: null,
    submittedThruDate: null, 
    pageSize: 10,
    index: 0,
    sort: 'Id',
    listSortDirection: 1
  }

  async mounted() { 
    this.toastService.set(this);
    this.criteria.submittedFromDate = this.moment(this.CommonExtensions.addDays(new Date(), -90)).format('MM/DD/YYYY')
    

    await this.fetchProvisionRecords();
    this.clearCriteria();

  }
  async search(){
    this.criteria.index = 0;
    //we do this serialization because of the binding behaviour of vue
    //this.criteria  = JSON.parse(JSON.stringify(this.criteria));
    await this.fetchProvisionRecords();
  }
  clearCriteria(){
    this.criteria = {
      excludedStatuses: [],
      submittedFromDate: null,
      submittedThruDate: null,
      pageSize: 10,
      index: 0, 
      sort: 'Id',
      listSortDirection: 1
    }
    this.provisionSelection = "1";
  }
  async indexChanged(index){
    this.criteria.index = index;
    await this.fetchProvisionRecords();
  }
  async fetchProvisionRecords(){
    
    try{
      this.spinnerService.show();
      this.criteria.excludedStatuses = [];
      if(this.provisionSelection === "1"){
        this.criteria.excludedStatuses = ["Deprovisioned", "Completed","Rejected"]
      }


      let response = await this.ExchangeToolsService.getProvisionHistories(this.criteria);

      if(response.status === false){
        throw "Unexpected status of false when querying provision history";
      }
      this.provisionRecords = response;

      
      
      

    } catch(e){
      window.console.log(e);
      this.toastService.error("Failed to retrieve provision records")
    }
    finally{
      this.spinnerService.hide();
    }
  }
  
}

