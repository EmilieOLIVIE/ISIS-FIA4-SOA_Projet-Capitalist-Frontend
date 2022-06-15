import { useMutation } from "@apollo/client"

import GLOBALS from "../../Globals"
import { ACHETER_CASH_UPGRADE } from "../../services"
import { toastError, toastSuccess } from "../../Util"
import { Palier } from "../../world"

import { ModalProps } from "../LeftMenu"

import ModalTemplate from "./ModalTemplate"

export default ({ world, username, updateWorld }: ModalProps) => {

    const [acheterCashUpgrade] = useMutation(ACHETER_CASH_UPGRADE,
        {
            context: { headers: { "x-user": username } },
            onError: (error) => toastError(error.message),
            onCompleted: ({ acheterCashUpgrade }) => buyCashUpgrade(acheterCashUpgrade)
        }
    )

    const buyCashUpgrade = (upgrade: Palier) => {
        if (world.money >= upgrade.seuil) {
            let newUpgrade = world.upgrades.find(element => element.name === upgrade.name)
            if (newUpgrade) newUpgrade.unlocked = true
            world.money = world.money - upgrade.seuil
            updateWorld(world)
            toastSuccess(upgrade.name + '\n Upgrade unlocked successfully')
        }
    }

    return (<>
        {
            world.upgrades.filter(upgrade => !upgrade.unlocked).map(
                upgrade =>
                (<ModalTemplate
                    palier={upgrade}
                    typePalier={GLOBALS.MAIN_MODALS.CASH_UPGRADES}
                    nameCible={world.products[upgrade.idcible - 1].name}
                    buyDisabled={world.money < upgrade.seuil}
                    onClickBuy={() => acheterCashUpgrade({ variables: { name: upgrade.name } })}
                />)
            )
        }
    </>)
}