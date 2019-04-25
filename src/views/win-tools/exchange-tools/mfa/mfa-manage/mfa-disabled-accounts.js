import Vue from "vue"
import {
  Component
  
} from "vue-property-decorator";
//import { timingSafeEqual } from "crypto";

@Component({
  name: 'mfa-disabled-accounts',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'ExchangeToolsService', 'CommonExtensions']

})

export default class MfaDisabledAccounts extends Vue {
  filter = "";
  selectedRecord = null;
  pagedRecords = {};
  eventTarget = null;
  criteria = {
    pageSize: 10,
    index: 0,
    filterText: null,
    incidentNumber: null,
    mfaEnabled: false
  };
  async loadGrid(){
    this.clear();
    await this.search();
  }
  async search() {
    this.spinnerService.show();
    try {
      this.criteria.mfaEnabled = false;
      this.pagedRecords = await this.ExchangeToolsService.getMfaDisabledRecords(this.criteria);


    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve records");

    } finally {
      this.spinnerService.hide();
    }
    /*
      {"pageSize":10,"index":0,"totalRecords":15,"entities":
      [{
          "id":31270,
          "uid":"manutd",
          "pid":730131708,
          "displayName":"Al-Hashimi, Hussein Sabah",
          "mfaEnabled":false,
          "mfaExemptBeginDate":null,
          "mfaExemptEndDate":null,
          "createDate":"2018-09-28T12:53:12.73",
          "changeDate":"2018-09-28T12:53:12.73",
          "createUser":null,
          "changeUser":"rajita",
          "reason":"3869988 because user don't have a cellphone or any other device for two-step"}
          ,{"id":49174,"uid":"armitage","pid":700092255,"displayName":"Armitage, Christopher","mfaEnabled":false,"mfaExemptBeginDate":null,"mfaExemptEndDate":null,"createDate":"2018-10-30T09:46:36.853","changeDate":"2018-10-30T09:46:36.853","createUser":null,"changeUser":"garrett1","reason":"phone will not power on ticket 3870793"},{"id":43499,"uid":"wwc94","pid":720286450,"displayName":"Cochran, Wesley William","mfaEnabled":false,"mfaExemptBeginDate":null,"mfaExemptEndDate":null,"createDate":"2018-10-28T01:30:10.913","changeDate":"2018-10-28T01:30:10.913","createUser":null,"changeUser":"AD\\its_improv.svc","reason":null},{"id":33929,"uid":"niaeve","pid":730021865,"displayName":"Everette, Niadiquay","mfaEnabled":false,"mfaExemptBeginDate":null,"mfaExemptEndDate":"2019-05-15T00:00:00","createDate":"2018-09-28T12:53:12.73","changeDate":"2018-09-28T12:53:12.73","createUser":null,"changeUser":"lee217","reason":"Please see ticket 3955069"},{"id":221,"uid":"uncopr","pid":720430952,"displayName":"ITS Operations Center, Unc","mfaEnabled":false,"mfaExemptBeginDate":null,"mfaExemptEndDate":null,"createDate":null,"changeDate":null,"createUser":null,"changeUser":null,"reason":"Service Account"},{"id":70167,"uid":"janicec","pid":730310198,"displayName":"janicec","mfaEnabled":true,"mfaExemptBeginDate":null,"mfaExemptEndDate":"2019-04-22T01:30:02.54","createDate":"2019-04-23T01:30:02.54","changeDate":"2019-04-23T01:30:02.54","createUser":null,"changeUser":null,"reason":"LDAP Record Re-enabled"},{"id":39493,"uid":"jonesp","pid":708234347,"displayName":"Jones, Paul E","mfaEnabled":false,"mfaExemptBeginDate":null,"mfaExemptEndDate":null,"createDate":"2018-10-16T10:30:30.757","changeDate":"2018-10-16T10:30:30.757","createUser":null,"changeUser":"AD\\its_improv.svc","reason":null},{"id":36842,"uid":"malandaj","pid":730076620,"displayName":"Malanda, Joyce Nzengolo","mfaEnabled":false,"mfaExemptBeginDate":null,"mfaExemptEndDate":null,"createDate":"2018-09-28T12:53:12.73","changeDate":"2018-09-28T12:53:12.73","createUser":null,"changeUser":"AD\\its_improv.svc","reason":null},{"id":7944,"uid":"hpaerl","pid":704289785,"displayName":"Paerl, Hans W.","mfaEnabled":false,"mfaExemptBeginDate":null,"mfaExemptEndDate":"2019-05-06T00:00:00","createDate":null,"changeDate":null,"createUser":null,"changeUser":"lee217","reason":"User is abroad until 5-6-19"},{"id":30833,"uid":"mgr","pid":730006881,"displayName":"Ritter, Molly Grey","mfaEnabled":false,"mfaExemptBeginDate":null,"mfaExemptEndDate":null,"createDate":"2018-09-28T12:53:12.73","changeDate":"2018-09-28T12:53:12.73","createUser":null,"changeUser":"AD\\its_improv.svc","reason":null}]}

      */

  }
  async clear() {
    this.criteria = {
      pageSize: 10,
      index: 0,
      filterText: "",
      sort: "",
      listSortDirection: "",
      uid: "",
      incidentNumber: null,
      mfaEnabled: false
    };
    await this.search();
  }
  async indexChanged(index) {
    this.criteria.index =index;
    await this.search();
  }

  async onEnableMfa(){

    this.spinnerService.show();
    try {
      let model = this.selectedRecord;
      model.mfaExemptBeginDate = null;
      model.mfaExemptEndDate = null;
      model.reason = null;
      model.enabled = true;
      model.onyen = model.uid;
      
      await this.ExchangeToolsService.updateMfaAccountStatus(model);
      this.toastService.success("Successfully enabled record");
      this.eventTarget.checked = false;
      this.criteria.index = 0;


      await this.search();

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to enable account");
    } finally {
      this.spinnerService.hide();
      this.$refs.confirmReEnableMfa.hide();
    }
  }
  async enableMfa(model, event) {
    this.eventTarget = event.target;
    this.selectedRecord = JSON.parse(JSON.stringify(model));
    this.$refs.confirmReEnableMfa.show();
  }
  cancelEnableMfa(){

    this.eventTarget.checked = false;
    this.selectedRecord = null;
    this.$refs.confirmReEnableMfa.hide();
  }

  async mounted() {
    this.toastService.set(this);
    //await this.search();
  }

}