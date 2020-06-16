import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

@Component({
  name: "read-only-view",
  dependencies: [
    "$",
    "moment",
    "toastService",
    "spinnerService",
    "MassMailService",
  ],
  props: ["campaign"],
  filters: {
    defaultNoReplyIfEmpty(value) {
      if (!value) return "no_reply@unc.edu";
      return value;
    },
  },
})
export default class ReadOnlyView extends Vue {
  model = {};
  comments = [];
  codeValues = [];
  selectedPopulations = [];
  excludedPopulations = [];
  @Watch("campaign", {
    immediate: true,
  })
  async onCampaignChanged(newValue) {
    this.model = newValue;
    if (newValue == null) return;

    this.formatContent();

    await this.getComments();
    await this.formatSelectedPopulations();
  }

  formatContent() {
    const $ = this.$;
    if (this.model && this.model.content) {
      let html = $(this.model.content.content);
      let images = html.find("img");

      //if images are greater than 600, the preview will crop the image,
      //set image to 100% if that happens
      images.each((_, img) => {
        let width = $(img).width() || img.width;
        if (width >= 600) {
          $(img).width("100%");
        }
        width = width || img.width;

        if ((width / 600) * 100 > 60) {
          $(img).css("margin-left", "auto");
          $(img).css("margin-right", "auto");
        }
      });
      this.model.content.content = html
        .get()
        .map(function(v) {
          return v.outerHTML;
        })
        .join("");
    }
  }
  async mounted() {
    this.toastService.set(this);
  }

  async getComments() {
    try {
      this.spinnerService.show();

      this.comments = await this.MassMailService.getComments(this.model.id);
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve comments");
    } finally {
      this.spinnerService.hide();
    }
  }

  hasAllEmployees() {
    if (!this.model || !this.model.targetEmployee) return false;
    return this.model.targetEmployee.indexOf("All Employees") > -1;
  }

  hasEmployeePopulation() {
    if (!this.model || !this.model.targetPopulation) return false;
    return this.model.targetPopulation.indexOf("EMPLOYEES") > -1;
  }

  hasStudentPopulation() {
    if (!this.model || !this.model.targetPopulation) return false;
    return this.model.targetPopulation.indexOf("STUDENTS") > -1;
  }

  async formatSelectedPopulations() {
    if(!this.model.campaignAudienceSelections) return;
    this.codeValues = await this.MassMailService.getAudienceCodeValudDisplayOrder();

    

    let reduced = this.codeValues.reduce((val, curVal) => {
      let items = val.concat([curVal]);
      if (curVal.entities.length) {
        curVal.entities.forEach((item) => {
          item.parent = curVal;
        });
        return items.concat(curVal.entities);
      }
      
      return items;
    }, []);

    let selectedCodes = reduced.filter((item) =>
      this.model.campaignAudienceSelections.includePopulations.includes(
        item.code
      )
    );

    let excludedCodes = reduced.filter((item) =>
      this.model.campaignAudienceSelections.excludePopulations.includes(
        item.code
      )
    );

    let parentSelectedCodes = selectedCodes
      .filter((item) => item.parent || item.code === "TEST")
      .filter((v, i, a) => a.indexOf(v) === i)
      .map(c=> c.parent || c);
      
      let parentExcludedCodes = excludedCodes
      .filter((item) => item.parent )
      .filter((v, i, a) => a.indexOf(v) === i)
      .map(c=> c.parent);

      parentSelectedCodes = parentSelectedCodes.filter((v,i,a)=> a.indexOf(v) === i)
      parentExcludedCodes = parentExcludedCodes.filter((v,i,a)=> a.indexOf(v) === i)

      
    parentSelectedCodes.forEach((parent) => {
      parent.children = selectedCodes.filter(c => {
        if(!c.parent) return false;
        return c.scope === parent.code
      }
      );
    });
    parentExcludedCodes.forEach((parent) => {
      parent.children = excludedCodes.filter(c => {
        if(!c.parent) return false;
        return c.scope === parent.code
      }
      );
    });

    parentSelectedCodes = parentSelectedCodes.map(c=> {
      return {
        description: c.description,
        children: c.children.map(d=> d.description)
      }
    });

    parentExcludedCodes = parentExcludedCodes.map(c=> {
      return {
        description: c.description,
        children: c.children.map(d=> d.description)
      }

    });

    this.selectedPopulations = parentSelectedCodes;
    this.excludedPopulations = parentExcludedCodes;
  }
}
