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
  
  performedSearch = false;
  lookupEntityModel = null;
  pagedResponse = {};
  groupMemberCriteria = {

  }
  //criteria is passed from parent
  async loadEntities(criteria) {
    
    if (!this.service) {
      throw 'Service is required'
    }

    if(this.requireCriteria)
    {
      if (!this.groupMemberCriteria.filterText && !this.groupMemberCriteria.managedBy) {
        this.toastService.error("Criteria too vague, please specify a criteria to search by");
        return;
      }
      if (!this.groupMemberCriteria.managedBy && this.groupMemberCriteria.filterText.length < 3) {
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
      
      
       this.pagedResponse = await this.service.getMyManagedGroups(this.groupMemberCriteria);
      
       

      if (this.pagedResponse.totalRecords === 0 && !criteria) {
        this.toastService.warn("No records found matching criteria");
      }
      else if(this.pagedResponse.totalRecords === 0 && criteria && criteria.initialLoad)
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

    
    for (let i = 0; i < this.pagedResponse.entities.length; i++) {
     let group = this.pagedResponse.entities[i];

      if (group.samAccountName !== samAccountName) {
        group.showUsers = false;
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
   
    this.groupMemberCriteria = this.criteria;
    this.groupMemberCriteria.index = 0;
    this.groupMemberCriteria.pageSize = 10;
    
    this.toastService.set(this);
  }

  async rebindGrid() {
    this.pagedResponse = JSON.parse(JSON.stringify(this.pagedResponse));
    
  }

  async clear(criteria) {

    this.performedSearch = false;
    this.pagedResponse.entities = [];
    
    this.lookupEntityModel = null;
    if(criteria)
    {
      this.groupMemberCriteria = criteria;
    }

  }

  async onManagerListLoaded() {
    
    
    
  }

  async onGroupUserListLoaded() {

  }

  async indexChanged(index) {
    this.groupMemberCriteria.index = index;
    this.groupMemberCriteria = JSON.parse(JSON.stringify(this.groupMemberCriteria));
    await this.getRecords(this.groupMemberCriteria);
  }
}