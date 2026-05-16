import LocationController from './LocationController'
import HancmsTranslationController from './HancmsTranslationController'
import LayoutController from './LayoutController'
import LanguageController from './LanguageController'
import LabelController from './LabelController'
import MailTemplateController from './MailTemplateController'

const Settings = {
    LocationController: Object.assign(LocationController, LocationController),
    HancmsTranslationController: Object.assign(HancmsTranslationController, HancmsTranslationController),
    LayoutController: Object.assign(LayoutController, LayoutController),
    LanguageController: Object.assign(LanguageController, LanguageController),
    LabelController: Object.assign(LabelController, LabelController),
    MailTemplateController: Object.assign(MailTemplateController, MailTemplateController),
}

export default Settings