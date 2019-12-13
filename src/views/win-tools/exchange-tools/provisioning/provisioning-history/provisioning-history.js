import Vue from "vue"
import {
  Component
} from "vue-property-decorator";
import SearchCriteria from "./search-criteria/search-criteria.vue";
@Component({
  name: 'provisioning-history',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService',
    "ExchangeToolsService",
    "UserService",
    "ValidationService",
    "ScreenReaderAnnouncerService"
  ],
  components: {SearchCriteria}


})

export default class ProvisioningHistory extends Vue {
  _currentCol = "id";
  _currentSortDir = 1;
  pagedResponse = {};
  entity = {};
  criteria = {
    pageSize: 20,
    index: 0,
    sort: this._currentCol,
    listSortDirection: this._currentSortDir
  }

  async mounted() {
    this.toastService.set(this);
    await this.search();
  }

  async indexChanged(index) {
    this.criteria.index = index;
    await this.search();
  }

  async search() {
    try {
      this.spinnerService.show();

      this.pagedResponse = await this.ExchangeToolsService.getProvisionHistories(this.criteria);

    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to retrieve record');
    } finally {
      this.spinnerService.hide();
    }
  }
  _resetCriteria() {
    this.criteria = {
      pageSize: 20,
      index: 0,
      sort: 'id',
      listSortDirection: 1
    };
  }

  async clear() {
    this._resetCriteria();
    await this.search();
  }

  async sort(column) {

    if (this._currentCol === column) {
      this._currentSortDir *= -1;
    } else {
      this._currentSortDir = 1;
    }
    this._currentCol = column;

    this.criteria.index = 0;
    this.criteria.sort = this._currentCol;
    this.criteria.listSortDirection = this._currentSortDir;
    await this.search();



  }

  async reprovisionAccount() {
    try {
      this.spinnerService.show();

      this.entity.status = 'Submitted';

      let respose = await this.ExchangeToolsService.updateProvisionRecord(this.entity)

      if (respose.status) {
        this.toastService.success("Successfully updated provisioning record");
        
        await this.search();
      } else {
        this.toastService.error("Failed to update provisioning record, not found");
        
        
      }
      this.closeConfirmAction();


    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to update provisioning');
    } finally {
      this.spinnerService.hide();
    }

  }
  confimReprovisionAccount(entity) {
    this.entity = entity;
    this.$refs.confirmAction.show();
  }
  closeConfirmAction() {
    this.$refs.confirmAction.hide();
  }
}