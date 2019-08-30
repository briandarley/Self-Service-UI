import Vue from "vue"
import {
  Component,
  Watch
} from "vue-property-decorator";
import Criteria from '../criteria/criteria.vue';

@Component({
  name: 'alias-list',
  dependencies: ['$', '_', 'moment', 'toastService', 'spinnerService', 'ExchangeToolsService'],
  components: { Criteria}
  //props: ['entities']

})

export default class AliasList extends Vue {
  aliasDomains = [];
  selectedDomain = null;
  newAliasManager= "";
  criteria = {};

  
  sortChildren(children) {
    const _ = this._;
    return _.orderBy(children, 'uid', 'asc');
  }

  async mounted() {
    this.toastService.set(this);
    await this.getAliasDomains();
  }

  async getAliasDomains() {
    try {
      this.spinnerService.show();

      let aliasDomains = await this.ExchangeToolsService.getAliasDomains();

      if (this.criteria.domain) {
        aliasDomains = aliasDomains.filter(c => c.name === this.criteria.domain);
      }
      if(this.criteria.onyen){
        aliasDomains = aliasDomains.filter(c => c.aliasManagers.some(c=> c.uid.toUpperCase() === this.criteria.onyen.toUpperCase()));
      }

      this.aliasDomains = aliasDomains;

    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to load alias domains');
    } finally {
      this.spinnerService.hide();
    }
  }


  async removeChild(parentEntity, child) {
    try {
      this.spinnerService.show();
      await this.ExchangeToolsService.removeAliasManager([parentEntity.id], child.uid)

      let alias = this.aliasDomains.filter(c => c.id == parentEntity.id)[0];
      let children = alias.aliasManagers.filter(c => c.uid != child.uid)
      alias.aliasManagers = children;
      if (children.length === 0) {
        alias.expanded = false;
      }

      this.aliasDomains = JSON.parse(JSON.stringify(this.aliasDomains));

      this.toastService.success("Successfully removed alias manager");

    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to remove child entity');
    } finally {
      this.spinnerService.hide();
    }
  }


  toggleShowDomains(entity) {
    if (!entity.aliasManagers.length) {
      entity.expanded = false;
    } else {
      entity.expanded = !entity.expanded;
    }


    for (let i = 0; i < this.aliasDomains.length; i++) {
      if (this.aliasDomains[i].id != entity.id) {
        this.aliasDomains[i].expanded = false;
      }
    }
    this.aliasDomains = JSON.parse(JSON.stringify(this.aliasDomains));
  }

  async onConfirmAddMemberClick() {
    try {
      this.spinnerService.show();
      
      let alias = this.aliasDomains.filter(c => c.id == this.selectedDomain.id)[0];
      
      if(alias.aliasManagers.some(c=> c.uid === this.newAliasManager)){
        this.toastService.error("Duplicate entry found");
        this.newAliasManager = "";
        this.$refs.confirmAddManager.hide();
        
        return;
      }
      
      await this.ExchangeToolsService.addAliasManager([this.selectedDomain.id], this.newAliasManager)

      alias.aliasManagers.push({uid : this.newAliasManager});
      this.aliasDomains = JSON.parse(JSON.stringify(this.aliasDomains));

      this.newAliasManager = "";
      this.$refs.confirmAddManager.hide();

      this.toastService.success("Successfully added alias manager");

    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to add Alias Manager');
    } finally {
      this.spinnerService.hide();
    }
  }

  onCancelConfirmClick() {
    this.newAliasManager = "";
    this.parentEntity= null;
    this.$refs.confirmAddManager.hide();
  }

  showAddManager(parentEntity) {
    this.selectedDomain = parentEntity;
    this.$refs.confirmAddManager.show();

  }

  async onSearch(criteria){
    this.criteria = criteria;
    
    await this.getAliasDomains();
  }
}