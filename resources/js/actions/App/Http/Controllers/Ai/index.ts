import ProductAiController from './ProductAiController'
import CategoryAiController from './CategoryAiController'

const Ai = {
    ProductAiController: Object.assign(ProductAiController, ProductAiController),
    CategoryAiController: Object.assign(CategoryAiController, CategoryAiController),
}

export default Ai