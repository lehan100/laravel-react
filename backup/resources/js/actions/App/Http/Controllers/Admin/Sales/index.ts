import OrderController from './OrderController'
import WarehouseController from './WarehouseController'
import PaymentMethodController from './PaymentMethodController'
import ShippingMethodController from './ShippingMethodController'

const Sales = {
    OrderController: Object.assign(OrderController, OrderController),
    WarehouseController: Object.assign(WarehouseController, WarehouseController),
    PaymentMethodController: Object.assign(PaymentMethodController, PaymentMethodController),
    ShippingMethodController: Object.assign(ShippingMethodController, ShippingMethodController),
}

export default Sales