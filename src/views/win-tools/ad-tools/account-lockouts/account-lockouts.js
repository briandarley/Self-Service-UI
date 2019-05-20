import Vue from "vue"
import {
  Component,
  Watch
} from "vue-property-decorator";

@Component({
  name: 'account-lockouts',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'ExchangeToolsService'],


})

export default class AccountLockouts extends Vue {

  pagedRecords = {};
  performedSearch = false;
  criteria = {
    pageSize: 10,
    index: 0,
    filterText: null

  };
  async search() {
    this.criteria.index = 0;
    await this.getRecords();
  }
  async getRecords() {
    this.spinnerService.show();
    try {


      this.pagedRecords = await this.ExchangeToolsService.getSplunk(this.criteria);

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve records")
    } finally {
      this.spinnerService.hide();
    }
  }
  async clear() {

    this.performedSearch = false;
    this.pagedRecords = {};
    this.criteria = {
      pageSize: 10,
      index: 0,
      filterText: null

    }
    await this.search();
  }

  async mounted() {
    this.toastService.set(this);
    await this.search();
  }
  async indexChanged(index) {
    this.criteria.index = index;
    await this.getRecords();
  }
}