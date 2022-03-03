import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"

type useCanParams = {
    permissions?: string[];
    roles?: string[]
}

export function useCan({ permissions, roles }: useCanParams) {
    const { user, isAuthenticated } = useContext(AuthContext)

    //verificando se o usuário está autenticado
    if(!isAuthenticated) {
        return false
    }

    // se o array de permissions tiver conteúdo, então, será verificado
    // para descobrir se a permission do usuário é a mesma configurada no backend
    if(permissions?.length > 0) {
        const hasAllPermissions = permissions.every(permission => {
            return user.permissions.includes(permission)
        })

        if(!hasAllPermissions) {
            return false
        }
    }

    if(roles?.length > 0) {
        const hasAllRoles = roles.some(role => {
            return user.roles.includes(role)
        })

        if(!hasAllRoles) {
            return false
        }
    }

    return true

}