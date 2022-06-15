import { useMutation } from "@apollo/client"

import { Palier } from "../../world"
import { toastError, toastSuccess } from "../../Util"
import { ACHETER_ANGEL_UPGRADE } from "../../services"

import GLOBALS from '../../Globals'

import ModalTemplate from "./ModalTemplate"
import { ModalProps } from "../LeftMenu"

export default ({ world, username, updateWorld }: ModalProps) => {

    const [acheterAngelUpgrade] = useMutation(ACHETER_ANGEL_UPGRADE,
        {
            context: { headers: { "x-user": username } },
            onError: (error) => toastError(error.message),
            onCompleted: ({ acheterAngelUpgrade }) => buyAngelUpgrade(acheterAngelUpgrade)
        }
    )

    const getTargetName = (angelUpgrade: Palier) => {
        if (angelUpgrade.idcible === -1) return "Angels"
        else if (angelUpgrade.idcible === 0) return "All"
        return world.products[angelUpgrade.idcible - 1].name
    }

    const buyAngelUpgrade = (upgrade: Palier) => {
        if (world.money >= upgrade.seuil) {
            let angelUpgrade = world.angelupgrades.find(element => element.name === upgrade.name)
            if(angelUpgrade) angelUpgrade.unlocked = true
            world.activeangels = world.activeangels - upgrade.seuil
            toastSuccess(upgrade.name + ' unlocked successfully')
            updateWorld(world)
        }
    }

    return (<>
        {
            world.angelupgrades.filter(angelUpgrade => !angelUpgrade.unlocked).map(
                angelUpgrade =>
                (<ModalTemplate
                    palier={angelUpgrade}
                    typePalier={GLOBALS.MAIN_MODALS.ANGEL_UPGRADES}
                    nameCible={getTargetName(angelUpgrade)}
                    buyDisabled={world.money < angelUpgrade.seuil}
                    onClickBuy={() => acheterAngelUpgrade({ variables: { name: angelUpgrade.name } })}
                />)
            )
        }
    </>)
}