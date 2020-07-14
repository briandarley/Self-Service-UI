<template>
  <form
    @submit.prevent.prevent
    class="container validation-form"
    autocomplete="off"
    ref="submitForm"
  >
    <div class="border border-primary">
      <div class="bg-primary text-white row-header">
        <div class="pl-3">Create Mass Mail - Audience Criteria</div>
      </div>
      <div class="m-3">
        <h2 class="text-primary">
          Audience Size:
          <span id="targetAudience"></span>
        </h2>
      </div>
      <!-- E-mail target population -->
      <div class="one-column">
        <div class="form-group w-75">
          <tabbed-control tabs="Include Populations, Exclude Populations">
            <tabbed-item slot="tab_0">



              <audience-selection
                :id="'includeAudience'"
                :entities="audienceSelectOptions"
                :description="'Include E-mail Population'"
                :enable-select-all="true"
                v-on:populationSelected="onPopulationSelected"
                v-on:rebindList="onRebindList"
                ref="audienceSelectOptions"
                
              ></audience-selection>

              <!-- Check Audience -->
              <transition name="fade">
                <audience-check :model="value" v-if="model.campaignAudienceSelections.includePopulations.length"></audience-check>
              </transition>
            </tabbed-item>
            <tabbed-item slot="tab_1">
              <audience-selection
                :id="'excludeAudience'"
                :entities="audienceDeselectOptions"
                :description="'Exclude E-mail Population'"
                v-on:populationSelected="onPopulationExcluded"
                v-on:rebindList="onRebindList"
                ref="audienceDeselectOptions"
              ></audience-selection>
            </tabbed-item>
          </tabbed-control>
        </div>
      </div>
    </div>
  </form>
</template>
<script src="./audience-criteria.js"></script>
<style lang="scss" src="./audience-criteria.scss"></style>
