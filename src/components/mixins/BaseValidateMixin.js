import Vue from "vue";
import {
  Component
} from "vue-property-decorator";

@Component({
  name: "base-validate-mixin"
})
export default class BaseValidateMixin extends Vue {
  //model = {};
  //{ name: "sendDate", label: "Send Date" }
  requiredFields = [];

  _getEmptyMissingRequiredFields(requiredFields) {
    const invalidProperties = Object.keys(this.model).filter(c => {
      const index = requiredFields.map(c => c.name).indexOf(c);
      if (index > -1) {
        return !this.model[c];
      }
    });
    return requiredFields.filter(c =>
      invalidProperties.some(d => d === c.name)
    );
  }

  getInvalidFields() {
    return this._getEmptyMissingRequiredFields(this.requiredFields);
  }
  clearValidation() {
    let $ = this.$;

    let refs = Object.keys(this.$refs);

    for (let i = 0; i < refs.length; i++) {
      let $element = $(this.$refs[refs[i]]);

      let data = $element.attr("data-validation");
      let $form = null;
      let formErrorCleared = false;
      if (data) {

        data = data.replace(/'/g, '"');
        let validation = JSON.parse(data);

        if (!validation) continue;

        if (!formErrorCleared) {
          $form = $($($element).parents("form.validation-form")[0]);
          $form.removeClass("form-error");
          formErrorCleared = true;
        }

        let $validationError = $form.find(".validation-error");
        $validationError.remove();
        let currentRef = null;
        let refs = Object.keys(this.$refs);
        for (let i = 0; i < refs.length; i++) {
          currentRef = this.$refs[refs[i]];
          let $element = $(currentRef);
          if (
            $element[0].type === "checkbox" ||
            ($element[0].tagName !== "INPUT" && $element[0].tagName !== "SELECT")
          ) {
            $($element[0])
              .parent()
              .removeClass("input-error");
          } else {
            $($element[0]).removeClass("input-error");
          }

        }
      }
    }
  }
  validate() {
    try {
      let errors = [];
      let $ = this.$;

      let refs = Object.keys(this.$refs);
      let formErrorCleared = false;
      let $form = null;
      let currentRef = null;
      for (let i = 0; i < refs.length; i++) {
        currentRef = this.$refs[refs[i]];
        let $element = $(currentRef);

        if (!formErrorCleared) {
          $form = $($($element).parents("form.validation-form")[0]);
          $form.removeClass("form-error");
          formErrorCleared = true;
        }

        let $formGroup = $($element.parents(".form-group")[0]);

        if (!$formGroup) {
          continue;
        }

        if (
          $element[0].type === "checkbox" || ($element[0].tagName !== "INPUT" && $element[0].tagName !== "SELECT")
        ) {
          $($element[0])
            .parent()
            .removeClass("input-error");
        } else {
          $($element[0]).removeClass("input-error");
        }

        let $validationError = $formGroup.find(".validation-error");
        $validationError.remove();
        //let test = $element.attr("data-test");

        //let data = $element.attr("data-validation");
        let data = $element.attr("data-validation");
        if (data) {
          //validation = JSON.parse(data);
          data = data.replace(/'/g, '"');
          let validation = JSON.parse(data);

          if (!validation) continue;
          let message = "";
          let value = $element.val();

          if (value) {
            value = value.trim()
          }

          if ($element[0].tagName !== "INPUT" && $element[0].tagName !== "SELECT") {
            value = $element.attr("model");
          }

          if (validation.maxLength) {
            if (value.length > validation.maxLength) {
              message = "value too long";
              if (validation.message) message = validation.message;
              errors.push(validation.name + " " + message);
            }
          }
          if (validation.minLength) {
            if (value.length < validation.minLength) {
              message = "value too short";
              if (validation.message) message = validation.message;
              errors.push(validation.name + " " + message);
            }
          }
          if (!validation.minLength && !validation.maxLength) {
            if (!value || !value.length || value === "false") {
              message = "value required";
              if (validation.message) message = validation.message;
              errors.push(validation.name + " " + message);
            }
          }
          
          if (validation.regex) {
            let regex = new RegExp(validation.regex);
            if (!regex.test(value)) {
              message = "invalid characters";
              if (validation.message) message = validation.message;
              errors.push(validation.name + " " + message);
            }
          }

          const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          switch (validation.type) {
            case "email":
              if (!re.test(String(value).toLowerCase())) {
                message = "invalid";
                if (validation.message) message = validation.message;
                errors.push(validation.name + " " + message);
              }
              break;
          }

          if (!message.length) continue;

          message = validation.name + " " + message;

          if (
            $element[0].type === "checkbox" ||
            ($element[0].tagName !== "INPUT" && $element[0].tagName !== "SELECT")
          ) {
            $($element[0])
              .parent()
              .addClass("input-error");
          } else {
            $($element[0]).addClass("input-error");
          }
          $formGroup.append(
            `<span class="validation-error text-danger">${message}</span>`
          );

          $element.focus(function () {
            let $form = $($(this).parents("form.validation-form")[0]);
            $form.removeClass("form-error");

            let $validationError = $formGroup.find(".validation-error");
            $validationError.remove();
          });
        }
      }

      return errors;
    } catch (e) {
      window.console.log(e);
      this.toastService.error("An error occurred validating form");
    }
  }
}