import { useState } from "react"

import { World } from "../../world"

import ModalTemplate from "./Common/ModalTemplate"
import ModalNav from "./Common/ModalNav"

import GLOBALS from '../../Globals'

type unlocksProps = {
    world: World
}

export default ({ world }: unlocksProps) => {

    const [showUnlocked, setShowUnlocked] = useState(false)

    /**
     * Retrieve both product and global unlocks
     * @returns {Palier[]}
     */
    const getUnlocks = () => {
        let allPaliers = world.products.flatMap(product => product.paliers)
        let unlocks = []
        world.products
            .forEach(product => {
                let palier = allPaliers.find(palier => palier.unlocked === showUnlocked && palier.idcible === product.id)
                if (palier) unlocks.push(palier)
            }
            )
        let allUnlock = world.allunlocks.find(unlock => !unlock.unlocked)
        if (allUnlock) unlocks.push(allUnlock)
        return unlocks
    }

    return (
        <>
            <ModalNav onSelectKey={(showUnlocked) => setShowUnlocked(showUnlocked)} />
            {
                getUnlocks().map(
                    unlock =>
                    (<ModalTemplate
                        key={unlock.name}
                        palier={unlock}
                        typePalier={GLOBALS.MAIN_MODALS.UNLOCKS}
                        hideBuyButton={showUnlocked}
                        nameCible={unlock.idcible === 0 ? "All" : world.products[unlock.idcible - 1].name}
                    />)
                )
            }
        </>
    )
}