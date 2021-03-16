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
    "MassMailCodeValueHelperService",
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
  populations = "";
  
  @Watch("campaign", {
    immediate: true,
  })
  async onCampaignChanged(newValue) {
    this.model = newValue;
    if (newValue == null) return;

    this.formatContent();

    await this.getComments();
    this.populations = await this.formatSelectedPopulations();
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
    if (!this.model ) return false;
    //check audience
    
    return true;
    //return this.model.targetEmployee.indexOf("All Employees") > -1;
  }

  hasEmployeePopulation() {
    
    let targetPopulationIsNull =
      !this.model.audienceSelection;
    //will need to pull the population, reduce to get parents
    if(targetPopulationIsNull) return false;

    let employees = ["STAFF", "FACULTY", "DDD", "RETIREES", "VOLUNTEERS", "CONSULTANTS", "VISITING_SCHOLAR" ];
    
    employees.map(c=> {
      if(this.model.audienceSelection.some(d=> d === c))
      {
        return c;
      }
      return null;
    }).filter(c=> c == null);

    return employees.length > 0;
  }

  hasStudentPopulation() {
    
    let targetPopulationIsNull =
      !this.model.audienceSelection;

      if(targetPopulationIsNull) return false;

      let students = ["UNDERGRADUATES", "GRADUATES" ];

      students.map(c=> {
        if(this.model.audienceSelection.some(d=> d === c))
        {
          return c;
        }
        return null;
      }).filter(c=> c == null);

    
    return students.length > 0;
  }
  formatCodeValues(codeValues) {
    let reduced = codeValues.reduce((val, curVal) => {
      val.push(curVal);
      if (curVal.entities.length) {
        curVal.entities.forEach((c) => {
          c.parent = JSON.parse(JSON.stringify(curVal));
          c.parent.entities = null;
        });

        val = val.concat(curVal.entities);
      }
      return val;
    }, []);

    return reduced;
  }

  async formatSelectedPopulations() {
    if (!this.model.campaignAudienceSelections) return;
    this.codeValues = await this.MassMailService.getAudienceCodeValueDisplayOrder();
    this.codeValues = this.formatCodeValues(this.codeValues);

    



    let values = this.model.audienceSelection.map(
      (cv) => {
        let code = this.codeValues.find((c) => c.code == cv);
        return code.parent ? code.parent.description : code.description;
      }
    );
    //remove duplicates
    values = [...new Set(values.map((c) => c))];

    
    let matches =  values
      .map((c) => {            return c;      })
      .join(",");

    return matches;
  }
}
