type User = {
  permissions?: string[];
  roles?: string[];
};

type validateUserPermissionsParams = {
  user: User;
  permissions?: string[];
  roles?: string[];
};

export function validateUserPermissions({
  user,
  permissions,
  roles,
}: validateUserPermissionsParams) {

    // se o array de permissions tiver conteúdo, então, será verificado
    // para descobrir se a permission do usuário é a mesma configurada no backend
    if(permissions?.length > 0) {
        const hasAllPermissions = permissions.every(permission => {
            return user.permissions.includes(permission)
        })

        if(!hasAllPermissions) {
            return null
        }
    }

    if(roles?.length > 0) {
        const hasAllRoles = roles.some(role => {
            return user.roles.includes(role)
        })

        if(!roles) {
            return null
        }
    }

    return true
}
