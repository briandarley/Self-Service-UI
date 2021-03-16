import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
  name: "audience-selection",
  dependencies: ["$", "moment", "toastService", "spinnerService"],
  props: ["entities", "id", "description", "enableSelectAll"],
})
export default class AudienceSelection extends Vue {
  exapandAll = false;
  toggleAll = false;

  async mounted() {
    this.toastService.set(this);
    this.addPannelBehavior();
  }
  toggleExandAll() {
    const $ = this.$;
    this.exapandAll = !this.exapandAll;

    $(`#${this.id} .collapse`).collapse(this.exapandAll ? "show" : "hide");
  }

  toggleSelectAll() {
    this.toggleAll = !this.toggleAll;

    this.entities.forEach((c) => {
      if (c.code !== "TEST") {
        c.selected = this.toggleAll;
        if (c.entities) {
          c.entities.forEach((d) => (d.selected = this.toggleAll));
        }
      }
    });
    
    this.$emit("toggleSelection", this.entities);
    
  }

  addPannelBehavior() {
    const $ = this.$;

    $(`#${this.id}`).on("show.bs.collapse", (elm) => {
      const icon = $(elm.target)
        .parent()
        .find("i");

      $(icon).removeClass("collapsed");
      $(icon).addClass("expanded");
    });

    $(`#${this.id}`).on("hide.bs.collapse", (elm) => {
      const icon = $(elm.target)
        .parent()
        .find("i");

      $(icon).removeClass("expanded");
      $(icon).addClass("collapsed");
    });
  }

  toggleSection(code) {
    const $ = this.$;
    const pannel = $(`#${this.id} #collapse${code}`);
    pannel.collapse("toggle");
  }

  clearAllSelections() {
    this.entities.forEach((entity) => {
      if (entity.code !== "TEST") {
        entity.selected = false;

        entity.entities.forEach((child) => {
          child.selected = false;
        });
      }
    });
  }

  clearTestSelection() {
    let testItem = this.entities.filter((c) => c.code === "TEST");
    if (testItem.length) {
      testItem[0].selected = false;
    }
  }

  selectPopulation(entity) {
    if (entity.code === "TEST" && entity.selected) {
      this.clearAllSelections();
    } else {
      this.clearTestSelection();
    }
    if (!entity.entities || entity.entities.length == 0) {
      let parent = this.entities.reduce((val, curVal) => {
        if (curVal.code == entity.code) {
          val = val = val.concat([curVal]);
          return val;
        }
        if (curVal.entities && curVal.entities.length) {
          let children = curVal.entities.filter((c) => c.code == entity.code);

          if (children.length) {
            return [curVal];
          }
          return val;
        }
        return val;
      }, this.entities)[0];

      if (parent && parent.entities) {
        parent.selected = parent.entities.some((c) => c.selected);
      }
    }

    if (entity.entities) {
      entity.entities.forEach((child) => {
        child.selected = entity.selected;
      });
    }

    this.$emit("populationSelected", entity);
  }

  //Called from parent after sister component is changed
  deselectOptions(entity) {
    if (entity.code === "TEST" && entity.selected) {
      this.clearAllSelections();
      this.$emit("rebindList");
      return;
    } else if (entity.code !== "TEST" && entity.selected) {
      if (this.entities.some((c) => c.code === "TEST")) {
        this.clearTestSelection();
      }
    }
    if (!entity.selected) {
      return;
    }
    let entities = JSON.parse(JSON.stringify(this.entities));
    //need to get all entities into single branch
    let reduced = entities
      .reduce((val, curVal) => {
        if (curVal.entities) {
          curVal.entities.forEach((c) => (c.parent = curVal));
          return val.concat(curVal.entities);
        }
        return val;
      }, this.entities)
      .find((c) => c.code === entity.code);

    if (reduced.parent) {
      let parent = this.entities.find((c) => c.code === reduced.parent.code);
      let child = parent.entities.find((c) => c.code === reduced.code);
      child.selected = false;
      if (!parent.entities.some((c) => c.selected)) {
        parent.selected = false;
      }
    } else {
      let target = this.entities.find((c) => c.code === reduced.code);
      target.selected = false;
      target.entities.forEach((c) => (c.selected = false));
    }

    this.$emit("rebindList");
  }
}
