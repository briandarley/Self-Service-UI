import Vue from "vue";
import {
  Component,
  Watch
} from "vue-property-decorator";

@Component({
  name: "reinstate-tab",
  dependencies: ["_", "$", "moment", "toastService", "spinnerService"],
  props: ["emailAddresses", "dormantList"]
})
export default class TabReinstate extends Vue {
  deleted = [];
  certify = false;
  listToReinstate = null;
  emailAddress = "";

  groupedList = [];
  selectedList = null;


  model = {
    emailAddress: ""
  }
  @Watch('dormantList', {
    immediate: true
  })
  onDormantListChanged(value) {
    if (!value); {
      //this.selectedList = value[0];
      this.populateFields();
    }
  }


  populateFields() {

    let list = [];
    for (let i = 0; i < this.dormantList.length; i++) {
      let dl = this.dormantList[i];

      for (let j = 0; j < dl.subscriberDumps.length; j++) {
        let sd = dl.subscriberDumps[j];

        if (this.emailAddresses.indexOf(sd.subscriberEmail.toLowerCase()) > -1) {
          list.push({
            email: sd.subscriberEmail.toLowerCase(),
            listName: sd.listName
          });
        }

      }

    }
    let _ = this._;
    let val = _.chain(list)
      .groupBy(c => c.email)
      .map((value, key) => ({
        email: key,
        lists: value
      }))
      .value();

    this.groupedList = val;
    this.selectedList = val[0];
    if(this.selectedList){
      this.listToReinstate = this.selectedList.lists[0];
    }
    
    

  }

  async mounted() {
    this.toastService.set(this);
  }


  async submit() {
    let errors = this.validate();
    if (errors.length) {
      this.toastService.error(errors.join("<br/>"));
      this.$refs.validationModal.show();
      return;
    }

    this.spinnerService.show();
    let success = false;
    try {
      await this.ListManagerService.addNewList(this.model);
      success = true;
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to create new list");
    } finally {
      this.spinnerService.hide();
      if (success) {
        this.$router.push({
          name: "pm-tools-edit",
          params: { listName: this.model.listName }
        });
      }
    }
  }

}