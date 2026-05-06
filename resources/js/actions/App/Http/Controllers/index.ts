import Api from './Api'
import ImageUploadController from './ImageUploadController'
import Admin from './Admin'
import Ai from './Ai'

const Controllers = {
    Api: Object.assign(Api, Api),
    ImageUploadController: Object.assign(ImageUploadController, ImageUploadController),
    Admin: Object.assign(Admin, Admin),
    Ai: Object.assign(Ai, Ai),
}

export default Controllers