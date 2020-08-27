import Vue from "vue"
import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'group-management',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'EventBus'],
  props: ['criteria', 'service','requireCriteria']

})

export default class GroupManagement extends Vue {
  entities = [];
  performedSearch = false;
  lookupEntityModel = null;
  groupMemberCriteria = {

  }
  //criteria is passed from parent
  async loadEntities(criteria) {
    
    if (!this.service) {
      throw 'Service is required'
    }

    if(this.requireCriteria)
    {
      if (!this.criteria.filterText && !this.criteria.managedBy) {
        this.toastService.error("Criteria too vague, please specify a criteria to search by");
        return;
      }
      if (!this.criteria.managedBy && this.criteria.filterText.length < 3) {
        this.toastService.error("Criteria too vague, please specify a criteria to search by");
        return;
      }
    }

    await this.getRecords(criteria);


  }

  async getRecords(criteria) {
    this.spinnerService.show();
    try {
      this.lookupEntityModel = null;
      
      this.entities = [];
       let pagedResponse = await this.service.getMyManagedGroups(this.criteria);
       this.entities = pagedResponse.entities;
       

      if (pagedResponse.totalRecords === 0 && !criteria) {
        this.toastService.warn("No records found matching criteria");
      }
      else if(pagedResponse.totalRecords === 0 && criteria && criteria.initialLoad)
      {
        this.toastService.warn("Attempted to load 'My Groups', but you have no groups to manage");
      }

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve records")
    } finally {
      this.spinnerService.hide();
      this.EventBus.emit("attach-scroll");
    }
  }

  async toggleUsers(entity) {

    let samAccountName = entity.samAccountName;

    if (entity.showUsers) {
      entity.showUsers = false;
      return;
    }

    for (let i = 0; i < this.entities.length; i++) {
      if (this.entities[i].samAccountName !== samAccountName) {
        this.entities[i].showUsers = false;
      }
    }


    this.spinnerService.show();

    try {
      
      this.groupMemberCriteria.groupSamAccountName = entity.samAccountName;
      
      let pagedResponse = await this.service.getMyManagedGroupMembers(this.groupMemberCriteria);
            
      entity.detail = pagedResponse;
      
      entity.detail.entities.sort((a, b) => {
        if(!a.samAccountName)
        {
          a.samAccountName = a.name;
        }
        if(!b.samAccountName)
        {
          b.samAccountName = b.name;
        }

        let item1 = a.samAccountName.toLowerCase();
        let item2 = b.samAccountName.toLowerCase();

        if (item1 < item2) return -1;
        if (item2 > item1) return 1;
        return 0;
      })

      entity.showUsers = !entity.showUsers;

      await this.rebindGrid();

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve member/manager data");
    } finally {
      this.spinnerService.hide();
      this.EventBus.emit("attach-scroll");
    }

  }

  

  async mounted() {
    this.toastService.set(this);
  }

  async rebindGrid() {
    this.entities = JSON.parse(JSON.stringify(this.entities));
  }

  async clear() {

    this.performedSearch = false;
    this.entities = [];
    
    this.lookupEntityModel = null;
    
  }

  async onManagerListLoaded() {
    
    //getDistributionGroupManagers
    //getDistributionGroupMembers
    //await this.$refs.groupManagers.populateEntities(entity);
    
  }

  async onGroupUserListLoaded() {

  }
}