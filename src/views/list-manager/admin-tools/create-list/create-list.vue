<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons" aria-hidden="true">create</i>
        </div>
        <h3>Create List</h3>
      </div>
      <div class="card-body">
        <div class="container">
          <div class="alert alert-warning">
            <div class="info">
              <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
            </div>
            <p class="my-4 p-2">
              Note: Open and Closed mailing lists have a subscriber cap of 250 members. For details on this policy visit the
              <a
                href="https://help.unc.edu/sp?id=kb_article&sys_id=1cf79a2cdb47b7c0227afe2139961957"
              >FAQ</a>
            </p>
          </div>
          <p>
            To begin creating your list, fill out the form below. The description field is optional; all others are required.
            Your list will be created upon submission. For information on the different list types, see the
            <a
              href="https://help.unc.edu/sp?id=kb_article&sys_id=aa4688d0db037380227afe21399619ba"
            >FAQ</a>
          </p>
          <p class="text-danger">
            A list name can contain only alphanumeric characters (no spaces),
            and must always have at least one administrator with an email address ending in unc.edu.
          </p>

          <tabbed-control tabs="Create New,Reinstate" :options="[{tab: 'tab_1', enabled: dormantList.length > 0}]">
            <tabbed-item slot="tab_0">
              <tab-create-new :emailAddresses="emailAddresses"></tab-create-new>
              
            </tabbed-item>
            <tabbed-item slot="tab_1">
              <tab-reinstate :emailAddresses="emailAddresses" :dormantList="dormantList"></tab-reinstate>
            </tabbed-item>
          </tabbed-control>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./create-list.js"></script>
<style lang="scss" src="./create-list.scss" ></style>
