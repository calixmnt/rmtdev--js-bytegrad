import  {spinnerJobDetailsEl,spinnerSearchEl} from '../common.js'

const renderSpinner  = whichSpinner => {
    const el = whichSpinner === 'search' ? spinnerSearchEl : spinnerJobDetailsEl;
    el.classList.toggle('spinner--visible');
}

export default renderSpinner;
