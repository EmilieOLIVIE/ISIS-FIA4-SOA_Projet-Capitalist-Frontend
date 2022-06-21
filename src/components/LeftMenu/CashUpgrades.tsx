import { useState } from "react"
import { useMutation } from "@apollo/client"

import { Palier } from "../../world"
import { ACHETER_CASH_UPGRADE } from "../../services"

import ModalTemplate from "./Common/ModalTemplate"
import ModalNav from "./Common/ModalNav"
import { ModalProps } from "../LeftMenu"

import { customToast, formatPhrase, toastError, updateProduct } from "../../Util"
import GLOBALS from "../../Globals"

export default ({ world, username, updateWorld }: ModalProps) => {

    const [showUnlocked, setShowUnlocked] = useState(false)

    /**
     * Call backend function to buy given cash upgrade
     */
    const [acheterCashUpgrade] = useMutation(ACHETER_CASH_UPGRADE,
        {
            context: { headers: { "x-user": username } },
            onError: (error) => toastError(error.message),
            onCompleted: ({ acheterCashUpgrade }) => buyCashUpgrade(acheterCashUpgrade)
        }
    )

    /**
     * Unlock the upgrade and update user money
     * then prompt parent to update the world
     * @param upgrade 
     */
    const buyCashUpgrade = (upgrade: Palier) => {
        if (world.money >= upgrade.seuil) {
            let newUpgrade = world.upgrades.find(element => element.name === upgrade.name)
            if (newUpgrade) newUpgrade.unlocked = true
            world.money = world.money - upgrade.seuil

            if(upgrade.idcible === 0) {
                world.products.forEach(product => {
                    product = updateProduct(product, upgrade)
                })
            } else {
                let product = world.products.find(element => element.id === upgrade.idcible)
                if(product) product = updateProduct(product, upgrade)
            }
            customToast(formatPhrase(upgrade))

            updateWorld(world)
        }
    }

    return (
        <>
            <ModalNav onSelectKey={(isUnlocked) => setShowUnlocked(isUnlocked)} />
            {
                world.upgrades.filter(upgrade => upgrade.unlocked === showUnlocked).map(
                    upgrade =>
                    (<ModalTemplate
                        key={upgrade.name}
                        palier={upgrade}
                        typePalier={GLOBALS.MAIN_MODALS.CASH_UPGRADES}
                        nameCible={world.products[upgrade.idcible - 1].name}
                        buyDisabled={world.money < upgrade.seuil}
                        hideBuyButton={showUnlocked}
                        onClickBuy={() => acheterCashUpgrade({ variables: { name: upgrade.name } })}
                    />)
                )
            }
        </>
    )
}