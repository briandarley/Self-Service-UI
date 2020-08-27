import Vue from "vue";
import {
  Component,
  Watch
} from "vue-property-decorator";
import Spinner from "@/components/spinner/spinner.vue";
import AddEntity from "./add-entity/add-entity.vue";

@Component({
  name: "user-list-management",
  dependencies: ["$", "moment", "toastService", "spinnerService"],
  components: {
    Spinner,
    AddEntity
  },
  props: ["group", "headerLabels", "autoLoadEntities", "service"]
})
export default class UserListManagement extends Vue {
  userId = "";
  _currentCol = "samAccountName";
  _currentSortDir = 1;
  originalList = [];
  filter = {};
  entities = [];
 
  groupMemberCriteria = {

  };

  //Called from parent controller
  async populateEntities(parentGroup) {
  }

  

  

  @Watch("filter", {
    immediate: false,
    deep: true
  })
  onFilterChanged(newValue) {
    
    let list = this.originalList.filter(c => {
      return (
        !newValue.user || (c.samAccountName || c.name).toUpperCase().includes(newValue.user.toUpperCase()) 
      );
    });
    list = list.filter(
      c =>
        !newValue.emailAddress || (c.emailAddress || "").toUpperCase().startsWith(newValue.emailAddress.toUpperCase())
    );
    list = list.filter(
      c =>
        !newValue.displayName ||
        c.displayName.toUpperCase().includes(newValue.displayName.toUpperCase())
    );
     
    this.entities = list;
    

    if (this._currentCol) {
      this._currentSortDir *= -1;
      this.sort(this._currentCol);
    }
  }

  sort(column) {
    if (this._currentCol === column) {
      this._currentSortDir *= -1;
    } else {
      this._currentSortDir = 1;
    }
    this._currentCol = column;

    switch (column) {
      case "user":
        this.entities.sort((a, b) => {
          let val1 = a.samAccountName || a.name;
          let val2 = b.samAccountName || a.name;

          if (val1.toLowerCase() > val2.toLowerCase())
            return this._currentSortDir;
          if (val1.toLowerCase() < val2.toLowerCase())
            return this._currentSortDir * -1;
          return 0;
        });
        break;
      case "emailAddress":
      case "displayName":
        this.entities.sort((a, b) => {
          if (a[column].toLowerCase() > b[column].toLowerCase())
            return this._currentSortDir;
          if (a[column].toLowerCase() < b[column].toLowerCase())
            return this._currentSortDir * -1;
          return 0;
        });
        break;
    }
  }

  async mounted() {
    this.toastService.set(this);
    this.$emit("controlLoaded");

    if (this.autoLoadEntities) {
      try {
        this.showSpinner();
        
        this.groupMemberCriteria.groupSamAccountName = this.group.samAccountName;
        let pagedResponse = await this.service.getMyManagedGroupMembers(this.groupMemberCriteria);

        
        this.entities = pagedResponse.entities;

        

        this.entities.map(c => {
          if (!c.id) {
            c.id = c.distinguishedName;
          }
          return c;
        });

        this.originalList = this.entities;

      } catch (e) {
        window.console.log(e);
        this.toastService.error("Failed to retrieve members entities");
      } finally {
        this.hideSpinner();
      }
    }
  }

  async onAddToGroupMembers(entity) {
    this.spinnerService.show();
    try {
      
      let response = await this.service.addMemberToGroup(this.group.distinguishedName, entity.distinguishedName);

      if(response.status === false ) {
        this.toastService.error(response.message);
        return;
      }

      this.entities.push(entity);
      

      this.toastService.success(`Successfully added member ${entity.cn}`);

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Error for user");
    }
    finally {
      this.spinnerService.hide();
    }

  }

  async removeEntity(entity) {
    try {
      this.showSpinner();
      
      let response = await this.service.removeGroupMemberFromGroup(this.group.distinguishedName, entity.distinguishedName);

      if(response.status === false) {
        this.toastService.error(`Failed to remove entity from group, ${response.message}`);
        return;

      }
      
      let index = this.entities.findIndex(c => c.distinguishedName == entity.distinguishedName);
      
      this.entities.splice(index, 1);
      this.entities =JSON.parse(JSON.stringify(this.entities));
      
      this.toastService.success("Successfully removed entity");
      this.$emit("entityRemoved", entity);
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to remove entity");
    } finally {
      this.hideSpinner();
    }
  }


  showSpinner() {
    if (!this.$refs.spinnerMmbrList) return;
    this.$refs.spinnerMmbrList.showSpinner();
  }

  hideSpinner() {
    if (!this.$refs.spinnerMmbrList) return;
    this.$refs.spinnerMmbrList.hideSpinner();
  }

  toggleSpinner() {
    if (!this.$refs.spinner) return;
    this.$refs.spinner.toggleSpinner();
  }

}
