import { BaseValidateMixin } from "./../../../../../components/mixins/index";
import { Component, Watch } from "vue-property-decorator";
import { CountUp } from "countup.js";
import AudienceSelection from "./audience-selection/audience-selection.vue";
import AudienceCheck from "./audience-check/audience-check.vue";

@Component({
  name: "audience-criteria",
  dependencies: [
    "$",
    "moment",
    "toastService",
    "spinnerService",
    "MassMailService",
    "ScreenReaderAnnouncerService",
  ],
  components: {
    AudienceSelection,
    AudienceCheck
  },
  props: ["value"],
})
export default class AudienceCriteria extends BaseValidateMixin {
  audienceCheckResult = "";
  validationErrors = [];
  model = {
    targetPopulation: "",
    employeeCriteria: "",
    campaignAudienceSelections : {
      includePopulations: []}
  };
  onyen = "";
  audienceOptions = [];
  audienceSelectOptions = [];
  audienceDeselectOptions = [];

  audienceSizeModel = {};

  audienceSize = 0;
  beginAudienceSize = 0;

  @Watch("model", {
    immediate: false,
    deep: true,
  })
  onModelChanged(newValue) {
    this.$emit("input", newValue);
  }
  @Watch("value", {
    immediate: true,
    deep: true,
  })
  onValueChanged(newValue) {
    this.model = newValue;
  }

  async employeeCriteriaChanged() {
    await this.calculateAudience();
  }

  async calculateAudience() {
    this.beginAudienceSize = this.audienceSize;
    this.audienceSize = 0;

    //First get counts for the selected, then subtract from
    let selectedItems = (val, curVal) => {
      if (curVal.selected) {
        let selected = curVal.entities.filter((c) => c.selected);

        val = val.concat(selected);

        return val;
      }
      return val;
    };

    let selectedValues = this.audienceSelectOptions
      .reduce(
        selectedItems,
        this.audienceSelectOptions.filter((c) => c.selected)
      )
      .map((c) => c.code);

    let audienceCountM = 0;
    let audienceCount = 0;

    selectedValues.forEach((code) => {
      switch (code) {
        case "UNDERGRADUATES":
          audienceCount += this.audienceSizeModel.undergraduates;
          audienceCountM += this.audienceSizeModel.mUndergraduates;
          break;
        case "GRADUATES":
          audienceCount += this.audienceSizeModel.graduates;
          audienceCountM += this.audienceSizeModel.mGraduates;
          break;
        case "STAFF":
          audienceCount += this.audienceSizeModel.staff;
          audienceCountM += this.audienceSizeModel.mStaff;
          break;
        case "FACULTY":
          audienceCount += this.audienceSizeModel.faculty;
          audienceCountM += this.audienceSizeModel.mFaculty;
          break;
        case "DDD":
          audienceCount += this.audienceSizeModel.ddd;
          audienceCountM += this.audienceSizeModel.mDdd;
          break;
        case "RETIREES":
          audienceCount += this.audienceSizeModel.retirees;
          audienceCountM += this.audienceSizeModel.mRetirees;
          break;
        case "VOLUNTEERS":
          audienceCount += this.audienceSizeModel.volunteers;
          audienceCountM += this.audienceSizeModel.mVolunteers;
          break;
        case "CONSULTANTS":
          audienceCount += this.audienceSizeModel.contractors;
          audienceCountM += this.audienceSizeModel.mContractors;
          break;
        case "VISITING_SCHOLAR":
          audienceCount += this.audienceSizeModel.visitingScholars;
          audienceCountM += this.audienceSizeModel.mVisitingScholars;
          break;
      }
    });

    this.audienceSize =
      this.model.priority === "Formal Notice" ? audienceCount : audienceCountM;

    this._beginCounterAnnimation();
  }

  _beginCounterAnnimation() {
    const easingFn = function(t, b, c, d) {
      const ts = (t /= d) * t;
      const tc = ts * t;
      return b + c * (tc + -3 * ts + 3 * t);
    };

    const options = {
      useEasing: true,
      easingFn: easingFn,
      useGrouping: true,
      separator: ",",
      decimal: ".",
      startVal: this.beginAudienceSize,
    };

    const couter = new CountUp(
      "targetAudience",
      this.audienceSize,
      options,
      0,
      1.5
    );

    if (!couter.error) {
      couter.start();
    } else {
      window.console.error(couter.error);
    }
  }

  async bindPopulationLists() {
    if (!this.audienceSelectOptions.length) {
      let audienceRaw = JSON.parse(JSON.stringify(this.audienceOptions));
      this.audienceSelectOptions = audienceRaw;

      audienceRaw = JSON.parse(JSON.stringify(this.audienceOptions));

      let testPopulation = audienceRaw.filter((c) => c.code == "TEST")[0];

      let indexOfTestPopulation = audienceRaw.indexOf(testPopulation);

      if (indexOfTestPopulation > -1) {
        audienceRaw.splice(indexOfTestPopulation, 1);
      }

      this.audienceDeselectOptions = JSON.parse(JSON.stringify(audienceRaw));
    } else {
      this.audienceSelectOptions = JSON.parse(
        JSON.stringify(this.audienceSelectOptions)
      );
      this.audienceDeselectOptions = JSON.parse(
        JSON.stringify(this.audienceDeselectOptions)
      );
    }
  }

  async onPopulationSelected(entity) {
    //allow sister component to properly unselect coresponding values
    this.$refs.audienceDeselectOptions.deselectOptions(entity);

    if (!entity.selected) {
      this.calculateAudience();
    }

    this.setModelPopulationSelection();
  }

  async onPopulationExcluded(entity) {
    //allow sister component to properly unselect coresponding values
    this.$refs.audienceSelectOptions.deselectOptions(entity);

    if (!entity.selected) {
      this.calculateAudience();
    }
    this.setModelPopulationSelection();
  }

  onRebindList() {
    //ensures that the current values are properly displayed
    this.audienceSelectOptions = JSON.parse(
      JSON.stringify(this.audienceSelectOptions)
    );
    this.audienceDeselectOptions = JSON.parse(
      JSON.stringify(this.audienceDeselectOptions)
    );

    this.calculateAudience();

    //public List<string> IncludePopulations { get; set; }
    //public List<string> ExcludePopulations { get; set; }
  }

  setModelPopulationSelection() {
    let selectedItems = (val, curVal) => {
      if (curVal.selected && !curVal.entities.length) {
        val = val.concat([curVal]);
      } else if (curVal.selected) {
        let selected = curVal.entities.filter((c) => c.selected);

        val = val.concat(selected);

        return val;
      }
      return val;
    };

    let selectedValues = this.audienceSelectOptions.reduce(selectedItems, []);
    let deselectedValues = this.audienceDeselectOptions.reduce(
      selectedItems,
      []
    );

    this.model.campaignAudienceSelections = {
      includePopulations: selectedValues
        .filter((c) => c.selected)
        .map((c) => c.code),
      excludePopulations: deselectedValues
        .filter((c) => c.selected)
        .map((c) => c.code),
    };
    //window.console.log(this.model.campaignAudienceSelections);
  }

  isValid() {
    let errors = [];

    if (!this.model.campaignAudienceSelections || !this.model.campaignAudienceSelections.includePopulations.some(c=> c)
    ) {
      this.toastService.error("Must include one population group or select 'Test'");
      errors.push("Must include one population group or select 'Test'");
    }
    if (errors.length) {
      return false;
    }

    errors = this.validate(this.$refs.submitForm);
    if (!errors || !errors.length) return true;
    return false;
  }

  async mounted() {
    this.toastService.set(this);

    this.audienceOptions = await this.MassMailService.getAudienceCodeValueDisplayOrder();

    await this.bindPopulationLists();

    this.audienceSizeModel = await this.MassMailService.getMassMailAudienceTotals();

    this.initializePopSelections();
    this.initializeAudienceSize();
    this.calculateAudience();
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement(
      "Mass Mail Audience Criteria"
    );
  }

  async initializeAudienceSize() {
    const $ = this.$;

    this.audienceSize = 0;

    const audienceSize = this.$options.filters.formatNumber(this.audienceSize);

    $("#targetAudience").html(audienceSize);
  }

  initializePopSelections() {
    let includePops = [];
    let excludePops = [];
    if(this.model.campaignAudienceSelections)
    {
      includePops = this.model.campaignAudienceSelections.includePopulations;
      excludePops = this.model.campaignAudienceSelections.excludePopulations;
    }
    

    //reduce all entities to a single list of values
    let reduce = (val, curVal) => {
      if (!curVal.entities.length) {
        return val.concat([curVal]);
      }
      if (curVal.entities.length) {
        curVal.entities.forEach((c) => (c.parent = curVal));
        return val.concat(curVal.entities);
      }
      return val;
    };

    let selections = this.audienceSelectOptions.reduce(reduce, []);
    let deselections = this.audienceDeselectOptions.reduce(reduce, []);

    //Select the population as well as the parent
    includePops.forEach((code) => {
      let entity = selections.find((c) => c.code == code);
      entity.selected = true;
      if (entity.parent) {
        entity.parent.selected = true;
      }
    });
    excludePops.forEach((code) => {
      let entity = deselections.find((c) => c.code == code);
      entity.selected = true;
      if (entity.parent) {
        entity.parent.selected = true;
      }
    });
    //avoiding circular reference issues when deserializing
    this.audienceSelectOptions = JSON.parse(
      JSON.stringify(this.audienceSelectOptions, (_, value) => {
        if (value && value.parent) {
          value.parent = null;
        }
        return value;
      })
    );
    //avoiding circular reference issues when deserializing
    this.audienceDeselectOptions = JSON.parse(
      JSON.stringify(this.audienceDeselectOptions, (_, value) => {
        if (value && value.parent) {
          value.parent = null;
        }
        return value;
      })
    );
  }
}
