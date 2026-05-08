import ProductAiController from './ProductAiController'
import CategoryAiController from './CategoryAiController'
import LocaleTranslateController from './LocaleTranslateController'
import PostAiController from './PostAiController'

const Ai = {
    ProductAiController: Object.assign(ProductAiController, ProductAiController),
    CategoryAiController: Object.assign(CategoryAiController, CategoryAiController),
    LocaleTranslateController: Object.assign(LocaleTranslateController, LocaleTranslateController),
    PostAiController: Object.assign(PostAiController, PostAiController),
}

export default Ai