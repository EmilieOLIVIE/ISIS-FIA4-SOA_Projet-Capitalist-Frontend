import { useState } from "react"
import { useMutation } from "@apollo/client"

import { Palier } from "../../world"
import { ENGAGER_MANAGER } from "../../services"

import ModalTemplate from "./Common/ModalTemplate"
import ModalNav from "./Common/ModalNav"
import { ModalProps } from "../LeftMenu"

import GLOBALS from "../../Globals"
import { toastError, toastSuccess } from "../../Util"

export default ({ world, username, updateWorld }: ModalProps) => {

    const [showUnlocked, setShowUnlocked] = useState(false)

    /**
     * Call backend function to buy given manager
     */
    const [engagerManager] = useMutation(ENGAGER_MANAGER,
        {
            context: { headers: { "x-user": username } },
            onError: (error) => toastError(error.message),
        }
    )

    /**
     * Unlock the manager and update user money
     * then prompt parent to update the world
     * @param manager 
     */
    const hireManager = (manager: Palier) => {
        engagerManager({ variables: { name: manager.name } })
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

    return (
        <>
            <ModalNav onSelectKey={(isUnlocked) => setShowUnlocked(isUnlocked)} />
            {
                world.managers.filter(manager => manager.unlocked === showUnlocked).map(
                    manager =>
                    (<ModalTemplate
                        key={manager.name}
                        palier={manager}
                        nameCible={world.products[manager.idcible - 1].name}
                        typePalier={GLOBALS.MAIN_MODALS.MANAGERS}
                        buyDisabled={world.money < manager.seuil || world.products[manager.idcible - 1].quantite === 0}
                        hideBuyButton={showUnlocked}
                        onClickBuy={() => hireManager(manager)}
                    />)

                )
            }
        </>
    )
}