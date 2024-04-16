import './styles/resets.scss'
import './styles/base.scss'
import './styles/footer.scss'
import './styles/form.scss'
import './styles/header.scss'
import './styles/style.scss'

import { validateInputs } from './js/validateInput'
import { handleAddTripClick } from './js/formHandler'
import { initializeInputs } from './js/initInputs'
import { countDownDays } from './js/calculate'
import { displayTripInformation } from './js/formHandler'



initializeInputs();

export {
    validateInputs, countDownDays, handleAddTripClick, displayTripInformation
}






