import { useMutation } from "@apollo/client"

import GLOBALS from "../../Globals"
import ENGAGER_MANAGER from "../../services/engagerManager"
import { toastError, toastSuccess } from "../../Util"

import { Palier } from "../../world"
import { ModalProps } from "../LeftMenu"

import ModalTemplate from "./ModalTemplate"

export default ({ world, username, updateWorld }: ModalProps) => {

    const [engagerManager] = useMutation(ENGAGER_MANAGER,
        {
            context: { headers: { "x-user": username } },
            onError: (error) => toastError(error.message),
            onCompleted: ({ engagerManager }) => hireManager(engagerManager)
        }
    )

    const hireManager = (manager: Palier) => {
        if (world.money >= manager.seuil) {
            let newManager = world.managers.find(element => element.name === manager.name)
            if (newManager) newManager.unlocked = true
            let newProduct = world.products.find(element => element.id === manager.idcible)
            if (newProduct) newProduct.managerUnlocked = true
            world.money = world.money - manager.seuil
            updateWorld(world)
            toastSuccess(manager.name + ' unlocked successfully')
        }
    }

    return (<>
        {
            world.managers.filter(manager => !manager.unlocked).map(
                manager =>
                (<ModalTemplate
                    palier={manager}
                    nameCible={world.products[manager.idcible - 1].name}
                    typePalier={GLOBALS.MAIN_MODALS.MANAGERS}
                    buyDisabled={world.money < manager.seuil}
                    onClickBuy={() => engagerManager({ variables: { name: manager.name } })}
                />)

            )
        }
    </>)
}