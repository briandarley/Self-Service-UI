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

    const $ = this.$;

    if ($(element).hasClass("date-picker")) {
      value = $(element).find("input").val();
    } else if ($(element).find(".typeahead").length > 0) {
      
      let inputs = $(element).find("input");
      //convert to array from htmlcollection -> select just value -> only where there is a value
      inputs = Array.prototype.slice.call(inputs).map(c => c.value).filter(c=> c);

      if (inputs.length) {
        value = inputs[0];
      }
      
    }

    return value;
  }

  _removeInputError(element) {
    let $ = this.$;
    element[0]
    let isComponent = element instanceof Vue;

    let el = null;
    if (isComponent) {
      el = $(element.$el);
    } else {
      el = $(element)[0];
    }

    //el = $(el).closest(".form-group");

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
        el = $formGroup.find(".input-error");
        $(el).removeClass("input-error");
      }
    } else if (el.is("input")) {

      $formGroup = $(el.closest(".form-group"))
      el.removeClass("input-error");

    } else {
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
    if (!validation.required) return message;
    //if (!validation.minLength && !validation.maxLength) {
    if (!value || !value.length || value === "false") {
      message = "value required";
      let name = validation.name || "";
      name = name + " ";
      // if (validation.name) {
      //   message = name + message
      // }

      if (validation.message) message = validation.message;
      errors.push(name + message);
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
    if (!value) return message;
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
      if ($(element).is("input")) {
        el = $(element);
      } else {
        el = $([element[0]]);
      }

    }

    let $form = null;
    if (el.tagName === "FORM") {
      $form = el;
    } else {

      if ($(element).is("input")) {
        $form = $(element).closest(".form-group"); //.find(".form-error")
      } else {
        $form = $(el.closest("form.validation-form"));
      }

    }


    $form.removeClass("form-error");

    let $formGroup = $(el.closest(".form-group"));

    let $validationError = $formGroup.find(".validation-error");
    $validationError.remove();

  }
  _clearFormError2(element) {
    const $ = this.$;

    let isComponent = element instanceof Vue;

    let el = null;
    if (isComponent) {
      el = $(element.$el);
    } else {
      el = $([element[0]]);
    }

    let $form = null;
    if (el.tagName === "FORM") {
      $form = el;
    } else {
      $form = $(el.closest("form.validation-form"));
    }


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
      let isCalendar = $(el).hasClass("date-picker");
      //let isTypeAhead = $(el).find(".tt-input").length > 0;
      let isTypeAhead = $(el).find(".typeahead").length > 0;

      if (isCalendar) {
        el = $(el).find('.calendar-control')
        isStandInputs = true;
      }


      if (el.type === "checkbox" || (!isStandInputs && !isTypeAhead)) {
        $(el)
          .parent()
          .addClass("input-error");
      } else {
        if (isTypeAhead) {
          $($(el).find(".typeahead")).addClass("input-error");
        } else {
          $(el).addClass("input-error");
        }


      }
    } else if (el.is("input")) {
      $formGroup = $(el.closest(".form-group"))
      el.addClass("input-error");
    } else {
      $formGroup = $(el.find("input").closest(".form-group"))
      el.find("input").addClass("input-error");
    }
    if (this.$options._scopeId) {
      $formGroup.append(
        `<span class="validation-error text-danger" ${this.$options._scopeId}>${message}</span>`
      );
    } else {
      $formGroup.append(
        `<span class="validation-error text-danger">${message}</span>`
      );
    }


  }
  _hasFormGroup(element) {
    const $ = this.$;
    let isComponent = element instanceof Vue;

    let el = null;
    if (isComponent) {
      el = $(element.$el);
    } else {
      el = $(element)[0];
    }


    if ($(el).hasClass("form-group")) {
      return true;
    }
    let $formGroup = $(el.closest(".form-group"));

    return $formGroup.length > 0;
  }
  _clearErrorsOnFocus(element) {
    //Clear any errors once the user sets focus to element
    let $ = this.$;
    //let isTypeAhead = $(element).find(".tt-input").length > 0;
    let isTypeAhead = $(element).find(".typeahead").length > 0;

    let isComponent = element instanceof Vue;

    let el = null;
    if (isComponent) {
      el = $(element.$el);
    } else {
      el = $(element);
    }

    let isCalendar = $(el).hasClass("date-picker");
    if (isCalendar) {
      //el = $(el).find('.calendar-control')
      el = $(el).find('input')

    } else if (isTypeAhead) {
      //tt-input
      el = $(el).find('.typeahead')
    }

    const that = this;
    el.focus(function () {
      that._clearFormError(this);
      that._removeInputError(this)
    });
  }

  validate(form) {
    try {
      //1) clear existing errors (Removing elements with class 'validation-error')
      //2) remove class 'input-error' from input elements
      //3) get validation elements
      //4) get validation attributes
      //5) iterate over validation logic, append to errors
      //6) Append all errors to single string
      //7) Append error to element
      //8) Add clear error on focus event
      if (form == null) {
        throw "Form passed is undefined";
      }
      let errors = [];
      const $ = this.$;
      //1) clear existing errors (Removing elements with class 'validation-error')
      $(form).find(".validation-error").remove();

      //2) remove class 'input-error' from input elements
      let inputErrors = $(form).find(".input-error");
      for (let i = 0; i < inputErrors.length; i++) {
        $(inputErrors[i]).removeClass("input-error");
      }

      //3) get validation elements
      let validationElements = $(form).find("[data-validation]");


      let validations = [
        this._setMissingValueValidationError,
        this._setMaxLengthValidationError,
        this._setMinLengthValidationError,
        this._setRegExValidationError,
        this._setEmailValidationError,
      ];
      let messages = [];
      for (let i = 0; i < validationElements.length; i++) {
        let validationElement = $(validationElements[i]);
        
        let rawRule =  validationElement
                          .attr("data-validation")
                          .replace(/'/g, "\"");

        let validation = JSON.parse(rawRule);
        
        // if(!validation.name)
        // {
        //   validation.name = $(validationElement)[0].name || $(validationElement)[0].id;
        // }
        let value = this._getValue(validationElement);

        let currentValidation = [];
        for (let j = 0; j < validations.length; j++) {
          currentValidation.push(validations[j](validation, errors, value));
          //messages.push(validations[j](validation, errors, value))
        }
        messages = messages.concat(currentValidation)
        let hasError = currentValidation.some(c => c.length);
        if (!hasError) continue;

        let message = currentValidation.filter(c => c.length).join();

        this._appendErrorIndicator(validationElement, message);

        this._clearErrorsOnFocus(validationElement);

      }


      return errors;
    } catch (e) {
      window.console.log(e);
      this.toastService.error("An error occurred validating form");
    }
  }


}