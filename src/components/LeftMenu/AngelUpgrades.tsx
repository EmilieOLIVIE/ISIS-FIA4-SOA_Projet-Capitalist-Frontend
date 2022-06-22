import { useState } from "react"
import { useMutation } from "@apollo/client"

import { Palier } from "../../world"
import { ACHETER_ANGEL_UPGRADE } from "../../services"

import ModalTemplate from "./Common/ModalTemplate"
import ModalNav from "./Common/ModalNav"
import { ModalProps } from "../LeftMenu"

import GLOBALS from '../../Globals'
import { formatPhrase, toastError, toastSuccess } from "../../Util"

export default ({ world, username, updateWorld }: ModalProps) => {

    const [showUnlocked, setShowUnlocked] = useState(false)

    /**
     * Call backend function to buy given angel upgrade
     */
    const [acheterAngelUpgrade] = useMutation(ACHETER_ANGEL_UPGRADE,
        {
            context: { headers: { "x-user": username } },
            onError: (error) => toastError(error.message),
        }
    )

    /**
     * Get target name according to the idcible
     * @param angelUpgrade 
     * @returns Product name || Angels || All
     */
    const getTargetName = (angelUpgrade: Palier) => {
        if (angelUpgrade.idcible === -1) return "Angels"
        else if (angelUpgrade.idcible === 0) return "All"
        return world.products[angelUpgrade.idcible - 1].name
    }

    /**
     * Unlock the upgrade and update active angels number
     * then prompt parent to update the world
     * @param upgrade 
     */
    const buyAngelUpgrade = (upgrade: Palier) => {
        acheterAngelUpgrade({ variables: { name: upgrade.name } })
        if (world.activeangels >= upgrade.seuil) {
            let angelUpgrade = world.angelupgrades.find(element => element.name === upgrade.name)
            if (angelUpgrade) angelUpgrade.unlocked = true
            world.activeangels = world.activeangels - upgrade.seuil
            toastSuccess(formatPhrase(upgrade))
            updateWorld(world)
        }
    }

    return (
        <>
            <ModalNav onSelectKey={(isUnlocked) => setShowUnlocked(isUnlocked)} />
            {
                world.angelupgrades.filter(angelUpgrade => angelUpgrade.unlocked === showUnlocked).map(
                    angelUpgrade =>
                    (<ModalTemplate
                        key={angelUpgrade.name}
                        palier={angelUpgrade}
                        typePalier={GLOBALS.MAIN_MODALS.ANGEL_UPGRADES}
                        nameCible={getTargetName(angelUpgrade)}
                        buyDisabled={world.activeangels < angelUpgrade.seuil}
                        hideBuyButton={showUnlocked}
                        onClickBuy={() => buyAngelUpgrade(angelUpgrade)}
                    />)
                )
            }
        </>
    )
}