import { BaseValidateMixin } from "./../../../../../components/mixins/index";
import { Component, Watch } from "vue-property-decorator";
import TestMessages from "./test-messages/test-messages.vue";
import { split } from "lodash";

@Component({
  name: "message-summary",
  dependencies: [
    "$",
    "moment",
    "toastService",
    "spinnerService",
    "ScreenReaderAnnouncerService",
    "MassMailService",
  ],
  components: {
    TestMessages,
  },
  props: ["value"],
  filters: {
    formatSender(value) {
      if (!value) return "no-reply@email.unc.edu";
      return value;
    },
  },
})
export default class MessageSummary extends BaseValidateMixin {
  model = {};
  audienceOptions = [];
  includePopulation = "";
  excludePopulation = "";

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
    const $ = this.$;

    if (this.model) {
      let html = $(this.model.content.content);
      let images = html.find("img");

      //if images are greater than 600, the preview will crop the image,
      //set image to 100% if that happens
      images.each((_, img) => {
        if ($(img).width() >= 600) {
          $(img).width("100%");
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
    this.audienceOptions = await this.MassMailService.getAudienceCodeValueDisplayOrder();
    this.initializeSendingCriteriaDisplay();
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement(
      "Mass Mail Message Summary"
    );
  }

  initializeSendingCriteriaDisplay() {
    try {
      let reducer = (val, curVal) => {
        let respond = val.concat([curVal]);

        if (curVal.entities) {
          curVal.entities.forEach((c) => (c.parent = curVal));
          return respond.concat(curVal.entities);
        }
        return respond;
      };

      let included = JSON.parse(JSON.stringify(this.audienceOptions)).reduce(
        reducer,
        []
      );
      let excluded = JSON.parse(JSON.stringify(this.audienceOptions)).reduce(
        reducer,
        []
      );
      let audienceSelection = split(this.value.audienceSelection, ",");
      let excludeAudience = split(this.value.excludeAudience, ",");
      
      audienceSelection.forEach((pop) =>{
        if(pop)
          included.find((c) => c.codeValue == pop).selected = true;
      });
      excludeAudience.forEach((pop) =>{
        if(pop)
          excluded.find((c) => c.codeValue == pop).selected = true;
        
      });
      // this.value.audienceSelection.forEach((pop) => {
      //   included.find((c) => c.codeValue == pop).selected = true;
      // });
      // this.value.excludeAudience.forEach((pop) => {
      //   excluded.find((c) => c.codeValue == pop).selected = true;
      // });
    

      let parents = [
        ...new Set(
          included
            .filter(
              (c) =>
                c.selected == true && (c.parent != null || c.code === "TEST")
            )
            .map((c) => c)
        ),
      ];

      this.includePopulation = parents.map((c) => c.description).join(", ");

      parents = [
        ...new Set(
          excluded
            .filter((c) => c.selected == true && c.parent != null)
            .map((c) => c)
        ),
      ];
      this.excludePopulation = parents.map((c) => c.description).join(", ");
    } catch (e) {
       window.console.log(e);
      throw e;
    }
  }

  showPreview() {
    this.$refs.confirmPreview.show();
  }

  closePreview() {
    this.$refs.confirmPreview.hide();
  }
  isValid() {
    let errors = [];

    if (!this.model.subject) {
      errors.push("Subject empty");
    }
    if (!this.model.sendDate) {
      errors.push("Send Date required");
    }
    if (!this.model.expirationDate) {
      errors.push("Expiration Date required");
    }
    if (!this.model.sponsor) {
      errors.push("Sponsoring Office required");
    }
    if (!this.model.priority) {
      errors.push("Priority required");
    }

    let targetPopulationNull = !this.model.audienceSelection;

    if (targetPopulationNull) {
      errors.push("Target population required");
    }

    if (errors.length) {
      window.console.log(errors);
      this.toastService.error(errors.join(",<br/>"));

      return false;
    }

    return true;
  }
}
