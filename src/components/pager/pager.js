import Vue from "vue"
import {
  Component,
  Watch
} from "vue-property-decorator";

@Component({
  name: 'pager',
  dependencies: ['$'],
  components: {},
  props: ["criteria", "btnCount", "totalRecords"]

})
export default class Pager extends Vue {
  pageInfo = {
    pageSize: 5,
    index: 0
  }
  buttons = [];

  get isIndexLessThanButtonCount() {
    let btnCount = parseInt(this.btnCount);
    return this.pageInfo.index >= btnCount;
  }
  get isLessThanMax() {
    
    return ((this.pageInfo.index + 1) * this.criteria.pageSize) < (Math.floor(this.totalRecords / this.criteria.pageSize))
  }
  get nextDisabled() {
    return ((this.pageInfo.index + 1) * this.criteria.pageSize)  >= this.totalRecords
  }

  @Watch("criteria", {
    immediate: true,
    deep: true
  })
  onCriteriaChanged(newValue) {
    this.pageInfo = {
      pageSize: 5,
      index: 0
    };
    if (!newValue) return;


    this.pageInfo = {
      pageSize: newValue.pageSize,
      index: newValue.index
    }

    this.populateButtonCount();

  }
  @Watch("totalRecords", {
    immediate: false
  })
  onTotalRecordsChanged(newValue) {
    if (!newValue) return;

    this.populateButtonCount();
  }
  populateButtonCount() {
    this.buttons = [];
    if (!this.btnCount) {
      return;
    }

    let btnCount = parseInt(this.btnCount);
    let index = this.pageInfo.index;
    
    if (index === undefined) {
      return;
    }

    let lowerIndex = 0;
    let startIndex = 1;

    if (index >= btnCount) {
      lowerIndex = Math.floor(index / btnCount);
      startIndex = ((lowerIndex * btnCount) + 1);
    }

    for (let i = startIndex; i < (startIndex + btnCount); i++) {

      if (i < Math.ceil(this.totalRecords / btnCount)) {
        this.buttons.push(i);
      }

    }

  }

  next(count) {

    let newIndex = this.pageInfo.index;

    if (count) {
      let btnCount = parseInt(this.btnCount);
      let pageIndex = this.pageInfo.index;

      let index = Math.ceil((pageIndex + 1) / btnCount);

      index *= btnCount;

      newIndex = index;

    } else {
      newIndex = this.pageInfo.index + 1;
    }

    this.$emit('indexChanged', newIndex);
  }

  previous(count) {
    let newIndex = this.pageInfo.index;

    if (count) {
      let btnCount = parseInt(this.btnCount);
      let pageIndex = this.pageInfo.index;

      let index = Math.floor((pageIndex) / btnCount);
      index--;
      index *= btnCount;

      newIndex = index;


    } else {
      newIndex = this.pageInfo.index - 1;
    }

    this.$emit('indexChanged', newIndex);
  }

  pageTo(index) {
    this.$emit('indexChanged', index - 1);
  }

  async mounted() {

  }

}

Vue.component("pager", Pager);