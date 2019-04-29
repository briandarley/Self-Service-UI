<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fa-user-circle-o"></i>
        </div>
        <h3>My Aliases</h3>
      </div>
      <div class="card-body">
        <tabbed-control tabs="My Aliases,Add Alias,Remove Alias">
          <tabbed-item slot="tab_0">
            <div class="container">
              <div class="row">
                <div class="col">
                  <div class="alert alert-info">
                    <div class="info">
                      <i class="fa fa-info-circle"></i>
                    </div>
                    <p>
                      The aliases listed are associated to mail account, {{model.email}}.
                      Mail may be addressed using any of the addresses listed and will be delivered to your inbox.
                      Your primary alias is used by UNC systems when sending e-mail.                      
                    </p>
                    <p class="strong">To change your primary alias, select an alias from the list and click save.</p>
                  </div>
                </div>
              </div>

              <div class="row mt-5">
                <div class="col">
                  <div class="control-group">
                    <label class="control control--radio">
                      bdarley@email.unc.edu
                      <input type="radio" name="radio" checked="checked">
                      <div class="control__indicator"></div>
                    </label>
                    <label class="control control--radio">
                      bdarley@unc.edu
                      <input type="radio" name="radio">
                      <div class="control__indicator"></div>
                    </label>
                    <label class="control control--radio">
                      bdarley-listserv@unc.edu
                      <input type="radio" name="radio">
                      <div class="control__indicator"></div>
                    </label>
                  </div>
                </div>
              </div>
              <div class="row my-3">
                <div class="col">
                  <div class="submit">
                    <button class="btn btn-primary pull-right" @click="save()">save</button>
                  </div>
                </div>
              </div>
            </div>
          </tabbed-item>
          <tabbed-item slot="tab_1">
            <div class="container">
              <div class="row">
                <div class="col">
                  <span>Primary Alias: {{model.email}}</span>
                </div>
              </div>

              <div class="row">
                <div class="col mb-3">
                  <form @submit.prevent.prevent class="validation-form" autocomplete="off">
                    <div class="form-group" :class="{'not-empty': model.email.length}">
                      <div class="form-inline">
                        <div class="input-group">
                          <input type="text" class="form-control" v-on:keyup.13="click()">
                          <label class="animated-label"></label>
                          <div class="input-group-append">
                            <span class="input-group-text">@</span>
                          </div>
                        </div>
                        <select class="form-control">
                          <option selected="selected" value>Choose...</option>
                          <option value="unc.edu">unc.edu</option>
                        </select>
                      </div>
                      <div class="mt-5 my-5">
                        <button class="btn btn-primary pull-right" @click="click()">submit</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </tabbed-item>
          <tabbed-item slot="tab_2">
            <div class="row">
              <div class="col">
                
              </div>
            </div>

          </tabbed-item>
        </tabbed-control>
      </div>
    </div>
  </div>
</template>
<script src="./my-aliases.js"></script>
<style lang="scss" src="./my-aliases.scss" scoped></style>
