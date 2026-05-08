import Promotion from './Promotion'
import AuthController from './AuthController'
import Catalog from './Catalog'
import Media from './Media'
import ExchangeRateController from './ExchangeRateController'
import Dashboard from './Dashboard'
import Settings from './Settings'
import Users from './Users'
import PageManager from './PageManager'
import Report from './Report'
import Sales from './Sales'

const Admin = {
    Promotion: Object.assign(Promotion, Promotion),
    AuthController: Object.assign(AuthController, AuthController),
    Catalog: Object.assign(Catalog, Catalog),
    Media: Object.assign(Media, Media),
    ExchangeRateController: Object.assign(ExchangeRateController, ExchangeRateController),
    Dashboard: Object.assign(Dashboard, Dashboard),
    Settings: Object.assign(Settings, Settings),
    Users: Object.assign(Users, Users),
    PageManager: Object.assign(PageManager, PageManager),
    Report: Object.assign(Report, Report),
    Sales: Object.assign(Sales, Sales),
}

export default Admin