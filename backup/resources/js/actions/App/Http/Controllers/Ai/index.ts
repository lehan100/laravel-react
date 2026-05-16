import ProductAiController from './ProductAiController'
import CategoryAiController from './CategoryAiController'
import PostAiController from './PostAiController'
import LocaleTranslateController from './LocaleTranslateController'

const Ai = {
    ProductAiController: Object.assign(ProductAiController, ProductAiController),
    CategoryAiController: Object.assign(CategoryAiController, CategoryAiController),
    PostAiController: Object.assign(PostAiController, PostAiController),
    LocaleTranslateController: Object.assign(LocaleTranslateController, LocaleTranslateController),
}

export default Ai