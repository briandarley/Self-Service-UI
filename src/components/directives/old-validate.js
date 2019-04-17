import Vue from 'vue';
import injector from 'vue-inject'
//https://vuejs.org/v2/guide/custom-directive.html
//Dealing with events
//https://weblog.west-wind.com/posts/2010/May/27/NonDom-Element-Event-Binding-with-jQuery


export default function validate() {
  return {
    bind: bind,
    inserted: function () {},
    update: function () {},
    componentUpdated: componentUpdated,
    unbind: function () {}
  }
}

var bind = injector.encase(['$'],  $ =>  (el, binding) => {
    validateProperties($, el, binding);
  }
);
var componentUpdated = injector.encase(['$'],  $ =>  (el, binding) => {
    validateProperties($, el, binding);
  }
);

function validateProperties($, el, binding) { 
  
  const targetProperty = binding.value.model.property || el.id;

  $(binding.value.model).bind("validate", function () {
     $(el).remove(".invalid-feedback");


    const error = binding.value.error || `${targetProperty} is required.`;
    const target = getTarget($, el);

    initializeErrorCollection(binding, error);
    initializeForm($, el);
    initializeTargetFeedback($, target);

    setCustomValidity($, target);



    if (!binding.value.model[targetProperty]) {


      if (binding.value.model.errors.indexOf(error) === -1) {
        binding.value.model.errors.push(error);
      }
      target.setCustomValidity("invalid");
      $(el).find("input[type='text']").each(function () {
        if ($(this).get(0)) {
          $(this).get(0).setCustomValidity("invalid");
        }
      });
      $(target)
        .parent()
        .append($(`
              <div class="invalid-feedback">
                ${error}
              </div>
          `));


    }
  });



}

function initializeErrorCollection(binding, error) {
  binding.value.model.errors = [];

  if (binding.value.model.errors.indexOf(error) > -1) {
    binding.value.model.errors.splice(binding.value.model.errors.indexOf(error), 1);
  }
}

function initializeTargetFeedback($, target) {
  $(target)
    .parent()
    .find(".invalid-feedback")
    .remove();
}

function initializeForm($, el) {
  const form = $(el).closest("form");
  form.removeClass("needs-validation");
  form.addClass("was-validated");
}

function getTarget($, el) {
  let target = $(el).attr("type") === "text" ? el : $(el).find("input[type='text']")[0];
  if (el.tagName === "SELECT") {
    target = el;
  }
  return target;
}

function setCustomValidity($, target) {
  $(target).on("change", function () {
    if ($(this).val()) {
      target.setCustomValidity("");
    }
  });
  target.setCustomValidity("");
}


Vue.directive('validate', validate());