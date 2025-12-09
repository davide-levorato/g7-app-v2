// import { ref, onMounted } from "vue";
import _ from "lodash";

const useFormFieldFn = function () {
  function error (v, fName) {
    /* if (!_.get(v, fName + ".$dirty", false) || _.get(v, fName + ".$pending", false)) {
      return true
    } */
    return _.get(v, fName + ".$error", false)
  }

  function message(v, fName) {
    const isError = _.get(v, `${fName}.$error`, false)
    if (!isError) { return null }
    if (_.get(v, `${fName}.$pending`, false)) {
      return null
    }
    return _.get(v, `${fName}.$errors[0]`, '')
  }

  return {
    error,
    message,
  }
}

export { useFormFieldFn as useFormField }
