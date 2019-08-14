import Vue from "vue";
import SimpleBar from "simplebar";

import { Component } from "vue-property-decorator";
import { timeout } from "q";

@Component({
  name: "list-deletions",
  dependencies: [
    "$",
    "moment",
    "toastService",
    "spinnerService",
    "ListManagerService"
  ],
  components: {}
})
export default class ListDeletions extends Vue {
  deletionList = {};
  criteria = {};
  listName = "";

  clearCriteria() {
    this.deletionList = {};
    this.criteria = {
      pageSize: 100,
      index: 0
    };
  }
  async reset() {
    this.clearCriteria();
    this.listName = "";
    await this.loadDeletions();
  }
  async search() {
    this.clearCriteria();
    this.criteria.filterText = this.listName;
    await this.loadDeletions();
  }

  async loadDeletions() {
    this.spinnerService.show();
    try {
      //Sort=deleteDate&ListSortDirection=1
      this.criteria.sort = "deleteDate,listName";
      this.criteria.listSortDirection = 1;
      let response = await this.ListManagerService.getDeletionList(
        this.criteria
      );
      response.entities = response.entities.map(c => {
        c.expanded = false;
        return c;
      });
      this.deletionList = response;
    } catch (e) {
      this.toastService.error("Failed to retrieve records");
    } finally {
      this.spinnerService.hide();
    }
  }

  async mounted() {
    this.toastService.set(this);
    this.clearCriteria();
    await this.loadDeletions();
  }
  async indexChanged(index) {
    this.criteria.index = index;
    await this.loadDeletions();
  }
  toggleSubscribers(entity) {
    if(entity.subscriberCount === 0)
    {
      return;
    }
    
    entity.expanded = !entity.expanded;
    
    
    const $ = this.$;
    function showScroll() {
      setTimeout(() => {
        $(".sdd-grid").each(item => {
          new SimpleBar($(".sdd-grid")[item], {
            autoHide: false,
            classNames: {
              scrollbar: "sb-scrollbar"
            }
          });
        });
      }, 500);
    }
    if (entity.expanded) {
      if (!entity.subscriberDump) {
        entity.subscriberLoading = true;
        this.ListManagerService.getSubscriberDump(entity.listName)
          .then(data => {
            entity.subscriberDump = data.entities;
            entity.subscriberLoading = false;

            if (data.entities) {
              showScroll();
            }
          })
          .catch(e => {
            window.console.log(e);
            this.toastService.error("Failed to load subsciber dump");
          })
          .finally(() => {
            this.deletionList = JSON.parse(JSON.stringify(this.deletionList));
          });
      } else {
        showScroll();
      }
    }
  }
  downloadCsv(entity) {

    let csvContent = "data:text/csv;charset=utf-8,ListName,SubscriberEmail,SubscriberFullName,IsListAdmin,ModifiedDate\r\n";
    
    entity.subscriberDump.forEach(r=>{
      let row =  [entity.listName]
                  .concat(Object.values(r))
                  .join(",");
      
      csvContent += row + "\r\n";

    });



    var encodedUri = encodeURI(csvContent);
    const $ = this.$;

    let link = $("<a></a>")
        .attr("href", encodedUri)
        .attr("download", `${entity.listName}-subsciber-dump.csv`)
    
    $("body").append(link);
    $(link)[0].click()
    $(link).remove();

    

    

  }
}
