import CategoryController from './CategoryController'
import AttributeController from './AttributeController'
import ProductController from './ProductController'
import PostController from './PostController'

const Catalog = {
    CategoryController: Object.assign(CategoryController, CategoryController),
    AttributeController: Object.assign(AttributeController, AttributeController),
    ProductController: Object.assign(ProductController, ProductController),
    PostController: Object.assign(PostController, PostController),
}

export default Catalog