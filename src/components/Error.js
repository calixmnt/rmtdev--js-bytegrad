import {errorEl, errorTextEl} from '../common.js'

const renderError = (message = "An error occured", ms = 3500) => {
    errorTextEl.textContent = message;
    errorEl.classList.add('error--visible');
    setTimeout(() => errorEl.classList.remove("error--visible"), ms);
}

export default renderError;