import PageController from './PageController'
import FieldGroupController from './FieldGroupController'

const PageManager = {
    PageController: Object.assign(PageController, PageController),
    FieldGroupController: Object.assign(FieldGroupController, FieldGroupController),
}

export default PageManager