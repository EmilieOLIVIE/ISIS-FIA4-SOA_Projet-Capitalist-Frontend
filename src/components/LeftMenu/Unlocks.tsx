import { Button, Col, Row } from "react-bootstrap"

import { World } from "../../world"

import GLOBALS from '../../Globals'
import ModalTemplate from "./ModalTemplate"

type unlocksProps = {
    world: World
}

export default ({ world }: unlocksProps) => {

    const getUnlocks = () => {
        let allPaliers = world.products.flatMap(product => product.paliers)
        let unlocks = []
        world.products
            .forEach(product => {
                let palier = allPaliers.find(palier => !palier.unlocked && palier.idcible === product.id)
                if (palier) unlocks.push(palier)
            }
            )
        let allUnlock = world.allunlocks.find(unlock => !unlock.unlocked)
        if (allUnlock) unlocks.push(allUnlock)
        return unlocks
    }

    return (<>
        {
            getUnlocks().map(
                unlock =>
                (<ModalTemplate
                    palier={unlock}
                    typePalier={GLOBALS.MAIN_MODALS.UNLOCKS}
                    nameCible={unlock.idcible === 0 ? "All" : world.products[unlock.idcible - 1].name}
                />)
            )
        }
    </>)
}