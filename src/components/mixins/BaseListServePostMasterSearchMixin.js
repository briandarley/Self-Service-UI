import Vue from "vue";
import {
  Component,
  Watch
} from "vue-property-decorator";

@Component({
  name: "base-list-serve-post-master-search-mixin",
  dependencies: ["$", "moment", "toastService", "spinnerService"]
})
export default class BaseListServePostMasterSearchMixin extends Vue {
  currentAction = "";

  model = {};
  data = [];
  noResult = false;

  @Watch("currentAction", {
    immediate: false
  })
  onCurrentAction() {
    this.data = [];
    this.model = {};
  }
  @Watch("model", {
    immediate: false,
    deep: true
  })
  onFilterChange() {
    this.noResult = false;
  }
  click(mnu, event) {
    let $ = this.$;
    this.currentAction = mnu;
    this._clearCaretIcon();
    $(event.target).prepend($("<i class='fa fa-caret-right'></i>"));
  }
  clear() {
    this.model = {};
  }
  _clearCaretIcon() {
    let $ = this.$;
    Object.keys(this.$refs).forEach(key => {
      let element = this.$refs[key];
      if (element.tagName === "A") {
        $(element)
          .find("i")
          .remove();
      }
    });
  }
  _maxFieldSize() {
    let sizes = Object.keys(this.model).map(key => {
      return this.model[key].length;
    })
    if(!sizes) return 0;
    sizes.sort((a,b)=> a - b);
    if(sizes.length == 0) return 0;
    return sizes[0];
  }
  _getObject(params){
    if(params.length === 0) return;
    if(params.length === 1) return this.model[params[0]];
    let response = {};
    params.map(key=>{
      response[key] = this.model[key];
    })
    return response
  }
  _addProperties(params){
    params.forEach(param=> {
      if(!this.model[param])
      {
        this.model[param] = "";
      }
      
    })
  }

  async search(searchMethod, params) {
    let criteria = {};
    
    
    this._addProperties(params);
    if (this._maxFieldSize() < 3) {
      this.toastService.error("Search too vague");
      return [];
    }
    this.spinnerService.show();
    try {
      criteria = this._getObject(params);
      let data = await searchMethod(criteria);
      
      this.noResult = data.length === 0;
      return data;
    } catch (e) {
      window.console.log({
        title: "Criteria passed",
        criteria: criteria,
        exception: e
      });
      
      this.toastService.error("Error retrieving list");
    } finally {
      this.spinnerService.hide();
    }
  }
  async _mounted() {}
  async mounted() {
    this.toastService.set(this);
    await this._mounted();
  }
}