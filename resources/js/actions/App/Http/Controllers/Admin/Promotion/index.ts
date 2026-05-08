import PromotionCampaignController from './PromotionCampaignController'
import SaleOfferController from './SaleOfferController'
import CouponController from './CouponController'
import BuyToGiftController from './BuyToGiftController'

const Promotion = {
    PromotionCampaignController: Object.assign(PromotionCampaignController, PromotionCampaignController),
    SaleOfferController: Object.assign(SaleOfferController, SaleOfferController),
    CouponController: Object.assign(CouponController, CouponController),
    BuyToGiftController: Object.assign(BuyToGiftController, BuyToGiftController),
}

export default Promotion