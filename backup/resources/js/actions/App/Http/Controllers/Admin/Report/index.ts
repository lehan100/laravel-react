import ReportRevenueController from './ReportRevenueController'
import ReportProductController from './ReportProductController'
import ReportInventoryController from './ReportInventoryController'
import ReportPromotionController from './ReportPromotionController'

const Report = {
    ReportRevenueController: Object.assign(ReportRevenueController, ReportRevenueController),
    ReportProductController: Object.assign(ReportProductController, ReportProductController),
    ReportInventoryController: Object.assign(ReportInventoryController, ReportInventoryController),
    ReportPromotionController: Object.assign(ReportPromotionController, ReportPromotionController),
}

export default Report