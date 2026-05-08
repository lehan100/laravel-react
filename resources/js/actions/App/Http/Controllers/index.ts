import Api from './Api'
import Admin from './Admin'
import ImageUploadController from './ImageUploadController'
import Ai from './Ai'

const Controllers = {
    Api: Object.assign(Api, Api),
    Admin: Object.assign(Admin, Admin),
    ImageUploadController: Object.assign(ImageUploadController, ImageUploadController),
    Ai: Object.assign(Ai, Ai),
}

export default Controllers