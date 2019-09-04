import Vue from "vue";
import {
  Component
} from "vue-property-decorator";

@Component({
  name: "base-validate-mixin"
})
export default class BaseValidateMixin extends Vue {
  
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

      let refName = Object.keys(this.$refs)[i];
      let ref = this.$refs[refName];
      let isComponent = ref instanceof Vue;

      let $element = isComponent ? ref : $(ref);

      let validation = this._getDataValidation($element);

      if (!validation) continue;


      let formErrorCleared = false;

      if (!formErrorCleared) {
        this._clearFormError($element);
        formErrorCleared = true;
      }

      this._removeInputError($element);


    }
  }

  _getDataValidation(element) {
    const $ = this.$;
    let isComponent = element instanceof Vue;

    let data = isComponent ? element.$attrs : $(element[0]).attr("data-validation");

    if (!data) {
      return null;
    }
    
    let validation = null;
    if (isComponent && data instanceof Object && data["data-validation"]) {
      validation = JSON.parse(data["data-validation"].toString().replace(/'/g, "\""));
    } else if (!isComponent) {
      data = data.replace(/'/g, '"');
      validation = JSON.parse(data);
    }
    return validation;

  }

  _getValue(element) {
    let isComponent = element instanceof Vue;
    let value = isComponent ? element.value : element.val();

    if (isComponent) {
      return value ? value.trim() : value;
    }
    const stdInputs = ["TEXTAREA", "INPUT", "SELECT"]
    if (stdInputs.indexOf(element[0].tagName) === -1) {
      value = element.attr("model");
    }


    return value;
  }

  _removeInputError(element) {
    let $ = this.$;

    let isComponent = element instanceof Vue;

    let el = null;
    if (isComponent) {
      el = $(element.$el);
    } else {
      el = $(element)[0];
    }



    let $formGroup = null;
    if (!isComponent) {
      $formGroup = $(el.closest(".form-group"));
      const stdInputs = ["TEXTAREA", "INPUT", "SELECT"]
      let isStandInputs = stdInputs.indexOf(el.tagName) > -1;

      if (el.type === "checkbox" || !isStandInputs) {
        $(el)
          .parent()
          .removeClass("input-error");
      } else {
        $(el).removeClass("input-error");
      }
    } 
    else if(el.is("input")){
      $formGroup = $(el.closest(".form-group"))
      el.removeClass("input-error");

    }
    else {
      $formGroup = $(el.find("input").closest(".form-group"))
      el.find(".input-error").removeClass("input-error");
    }
    let $validationError = $formGroup.find(".validation-error");
    $validationError.remove();
  }
  _setMaxLengthValidationError(validation, errors, value) {
    let message = "";

    if (validation.maxLength) {
      if (value.length > validation.maxLength) {
        message = "value too long";

        if (validation.name) {
          message = validation.name + ' ' + message
        }

        if (validation.message) message = validation.message;
        errors.push(validation.name + " " + message);
      }
    }

    return message;

  }
  _setMinLengthValidationError(validation, errors, value) {
    let message = "";

    if (validation.minLength) {
      if (value.length < validation.minLength) {
        message = `value too short`;

        if (validation.name) {
          message = validation.name + ' ' + message
        }

        if (validation.message) message = validation.message;
        errors.push(validation.name + " " + message);
      }
    }

    return message;
  }
  _setMissingValueValidationError(validation, errors, value) {
    let message = "";
    if(!validation.required) return message;
    //if (!validation.minLength && !validation.maxLength) {
    if (!value || !value.length || value === "false") {
      message = "value required";

      if (validation.name) {
        message = validation.name + ' ' + message
      }

      if (validation.message) message = validation.message;
      errors.push(validation.name + " " + message);
    }
    //}

    return message;
  }
  _setRegExValidationError(validation, errors, value) {
    let message = "";
    if (validation.regex) {
      let regex = new RegExp(validation.regex);
      if (!regex.test(value)) {
        message = "invalid characters";

        if (validation.name) {
          message = validation.name + ' ' + message
        }

        if (validation.message) message = validation.message;
        errors.push(validation.name + " " + message);
      }
    }
    return message;
  }
  _setEmailValidationError(validation, errors, value) {
    let message = "";
    if(!value) return message;
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    switch (validation.type) {
      case "email":
        if (!re.test(String(value).toLowerCase())) {
          message = "invalid";

          if (validation.name) {
            message = validation.name + ' ' + message
          }

          if (validation.message) message = validation.message;
          errors.push(validation.name + " " + message);
        }
        break;
    }

    return message;
  }
  _clearFormError(element) {
    const $ = this.$;

    let isComponent = element instanceof Vue;

    let el = null;
    if (isComponent) {
      el = $(element.$el);
    } else {
      el = $(element)[0];
    }


    let $form = $(el.closest("form.validation-form"));

    $form.removeClass("form-error");

    let $formGroup = $(el.closest(".form-group"));

    let $validationError = $formGroup.find(".validation-error");
    $validationError.remove();

  }

  _appendErrorIndicator(element, message) {
    const $ = this.$;
    let isComponent = element instanceof Vue;

    let el = null;

    if (isComponent) {
      el = $(element.$el);
    } else {
      el = $(element)[0];
    }



    let $formGroup = null;
    if (!isComponent) {
      $formGroup = $(el.closest(".form-group"));
      const stdInputs = ["TEXTAREA", "INPUT", "SELECT"]
      let isStandInputs = stdInputs.indexOf(el.tagName) > -1;

      if (el.type === "checkbox" || !isStandInputs) {
        $(el)
          .parent()
          .addClass("input-error");
      } else {
        $(el).addClass("input-error");
      }
    } 
    else if(el.is("input")){
      $formGroup = $(el.closest(".form-group"))
      el.addClass("input-error");
    }
    else {
      $formGroup = $(el.find("input").closest(".form-group"))
      el.find("input").addClass("input-error");
    }
    $formGroup.append(
      `<span class="validation-error text-danger" ${this.$options._scopeId}>${message}</span>`
    );

  }
  _hasFormGroup(element) {
    const $ = this.$;

    let el = $(element instanceof Vue ? element.$el : element);
    let $formGroup = $(el.closest(".form-group"));

    return $formGroup.length > 0;
  }
  _clearErrorsOnFocus(element){
    //Clear any errors once the user sets focus to element
    let $ = this.$;

    let isComponent = element instanceof Vue;
    
    let el = null;
    if(isComponent)
    {
      el = $(element.$el);
    }
    else{
      el = $(element);
    }
    
    const that = this;
    el.focus(function () {
      that._clearFormError(this);
      that._removeInputError(this)
    });
  }
  validate() {
    try {
      let errors = [];
      let $ = this.$;

      let refs = Object.keys(this.$refs);
      let formErrorCleared = false;

      let currentRef = null;
      for (let i = 0; i < refs.length; i++) {
        currentRef = this.$refs[refs[i]];
        let $element = currentRef instanceof Vue ? currentRef : $(currentRef);

        if (!formErrorCleared) {
          this._clearFormError($element);
          formErrorCleared = true;
        }

        let hasFormGroup = this._hasFormGroup(currentRef);

        if (!hasFormGroup) {
          continue;
        }

        this._removeInputError($element);

        let validation = this._getDataValidation($element);

        if (!validation) continue;

        let value = this._getValue($element);

        let messages = [];

        messages.push(this._setMissingValueValidationError(validation, errors, value));
        if (!errors.length) {
          // messages.push(this._setMaxLengthValidationError(validation, errors, value));
          // messages.push(this._setMinLengthValidationError(validation, errors, value));
          // messages.push(this._setRegExValidationError(validation, errors, value));
          // messages.push(this._setEmailValidationError(validation, errors, value));
        }
        messages.push(this._setMaxLengthValidationError(validation, errors, value));
        messages.push(this._setMinLengthValidationError(validation, errors, value));
        messages.push(this._setRegExValidationError(validation, errors, value));
        messages.push(this._setEmailValidationError(validation, errors, value));
        let hasError = messages.some(c => c.length);
        if (!hasError) continue;

        let message = messages.filter(c => c.length).join()
        this._appendErrorIndicator($element, message);

        this._clearErrorsOnFocus($element)
       

      }

      return errors;
    } catch (e) {
      window.console.log(e);
      this.toastService.error("An error occurred validating form");
    }
  }
}