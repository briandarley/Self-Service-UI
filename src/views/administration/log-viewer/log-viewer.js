import Vue from "vue"
import {
  Component,
  Watch
} from "vue-property-decorator";
import SearchCriteria from "./search-criteria/search-criteria.vue";
@Component({
  name: 'log-viewer',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService','AdministrationService'],
  components: {
    SearchCriteria
  }

})

export default class LogViewer extends Vue {
  _currentCol = "id";
  _currentSortDir = 1;
  pagedResponse = {};
  entities = [];
  criteria = {
    pageSize: 20,
    index: 0,
    filterText: "",
    application: "",
    level: "",
    sort: "id",
    createDateFrom: null,
    createDateThru: null

  };

  async indexChanged(index) {
    this.criteria.index = index;
    await this.search();
  }

  async mounted() {
    this.toastService.set(this);
  }


  async search() {
    try {
      this.spinnerService.show();
      
      this.pagedResponse = await this.AdministrationService.getLoggingEntries(this.criteria)

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
      filterText: "",
      level: "",
      sort: this._currentCol,
      createDateFrom: null,
      createDateThru: null,
      sort: "id",
      application: "",
      listSortDirection: this._currentSortDir
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


}