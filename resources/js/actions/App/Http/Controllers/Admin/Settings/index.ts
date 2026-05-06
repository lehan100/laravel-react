import LocationController from './LocationController'
import HancmsTranslationController from './HancmsTranslationController'
import LayoutController from './LayoutController'
import LanguageController from './LanguageController'
import LabelController from './LabelController'

const Settings = {
    LocationController: Object.assign(LocationController, LocationController),
    HancmsTranslationController: Object.assign(HancmsTranslationController, HancmsTranslationController),
    LayoutController: Object.assign(LayoutController, LayoutController),
    LanguageController: Object.assign(LanguageController, LanguageController),
    LabelController: Object.assign(LabelController, LabelController),
}

export default Settings