import WarehouseController from './WarehouseController'
import OrderController from './OrderController'
import PaymentMethodController from './PaymentMethodController'
import ShippingMethodController from './ShippingMethodController'

const Sales = {
    WarehouseController: Object.assign(WarehouseController, WarehouseController),
    OrderController: Object.assign(OrderController, OrderController),
    PaymentMethodController: Object.assign(PaymentMethodController, PaymentMethodController),
    ShippingMethodController: Object.assign(ShippingMethodController, ShippingMethodController),
}

export default Sales