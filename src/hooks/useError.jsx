import { useState } from "react";
import useInput from "./use-input";


const useError = () => {
    const [errorMessage, setErrorMessage] = useState('')
    const [showError, setShowError] = useState(false)


    const displayError = () => {
      if (errorMessage) {
        setShowError(true);
      }
    };
    // console.log(showError)
    return {
        errorMessage,
        setErrorMessage,
        showError,
        displayError
    }
}

export default useError;