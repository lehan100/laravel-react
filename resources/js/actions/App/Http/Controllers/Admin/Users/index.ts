import RoleController from './RoleController'
import UserController from './UserController'

const Users = {
    RoleController: Object.assign(RoleController, RoleController),
    UserController: Object.assign(UserController, UserController),
}

export default Users