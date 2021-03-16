<template>
  <div class="accordion" :id="id">
    <div class="d-flex">
      <div>
        {{ description }}
      </div>

      

      <div class="ml-auto text-right">
        <a @click.prevent="toggleExandAll()" class="text-primary alert-link">
          <span v-if="!exapandAll">Expand All</span>
          <span v-else>Collapse All</span>
        </a>
      </div>
    </div>

  <div
        class="ml-3 pt-2 custom-control custom-checkbox "
        v-if="enableSelectAll"
      >
        <input type="checkbox" id="chkSelectAll" class="custom-control-input" @change="toggleSelectAll()" />
        <label
          for="chkSelectAll"
          class="font-weight-bolder text-primary custom-control-label"
          >Select All</label
        >
      </div>
    <div v-for="entity in entities" :key="entity.code" class="card">
      <div
        class="card-header p-1 pl-3 d-flex flex-row justify-content-between audience-pannel"
        :id="`heading${id}_${entity.code}`"
      >
        <div class="mb-0 pt-2 custom-control custom-checkbox">
          <input
            type="checkbox"
            :id="`chk${id}_${entity.code}`"
            class="custom-control-input"
            v-model="entity.selected"
            @change="selectPopulation(entity)"
          />

          <label
            class="font-weight-bolder text-primary custom-control-label"
            :for="`chk${id}_${entity.code}`"
            >{{ entity.description }}</label
          >
        </div>

        <div class="p-2 " v-if="entity.entities.length">
          <a
            @click.prevent="toggleSection(entity.code)"
            class="rounded-border align-text-bottom align-self-end"
            ><i class="fa fa-angle-double-down m-0 more-info"></i
          ></a>
        </div>
        <div class="p-4 " v-else></div>
      </div>
      <div
        :id="`collapse${entity.code}`"
        class="collapse p-0 m-0"
        :aria-labelledby="`heading${id}_${entity.code}`"
      >
        <hr class="p-0 m-0" />
        <div class="card-body p-0 m-0">
          <ul class="list-group">
            <li
              v-for="child in entity.entities"
              :key="child.code"
              class="list-group-item border-0 p-1 ml-4"
            >
              <div class="mb-0 pt-2 custom-control custom-checkbox">
                <input
                  type="checkbox"
                  :id="`chk${id}_${entity.code}_${child.code}`"
                  v-model="child.selected"
                  @change="selectPopulation(child)"
                  class="mr-2 custom-control-input"
                />

                <label
                  class="custom-control-label"
                  :for="`chk${id}_${entity.code}_${child.code}`"
                  >{{ child.description }}</label
                >
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./audience-selection.js"></script>
<style lang="scss" src="./audience-selection.scss" scoped></style>
