import { useState } from 'react'
import { Button, Col, Container, Modal, Row } from 'react-bootstrap'
import Badge from '@mui/material/Badge';

import { World } from '../world'

import Unlocks from './LeftMenu/Unlocks'
import CashUpgrades from './LeftMenu/CashUpgrades'
import AngelUpgrades from './LeftMenu/AngelUpgrades'
import Managers from './LeftMenu/Managers'
import Investors from './LeftMenu/Investors'

import GLOBALS from '../Globals'

type LeftMenuProps = {
    world: World
    username: String
    updateWorld: (world: World) => void
    onResetWorld: () => void
}

export type ModalProps = {
    world: World
    username: String
    updateWorld: (world: World) => void
}

export default ({ world, username, updateWorld, onResetWorld }: LeftMenuProps) => {

    const [modal, setModal] = useState(GLOBALS.MAIN_MODALS.NONE)

    const getNextComponent = () => {
        switch (modal) {
            case GLOBALS.MAIN_MODALS.UNLOCKS:
                return <Unlocks world={world} />
            case GLOBALS.MAIN_MODALS.CASH_UPGRADES:
                return <CashUpgrades world={world} username={username} updateWorld={updateWorld} />
            case GLOBALS.MAIN_MODALS.ANGEL_UPGRADES:
                return <AngelUpgrades world={world} username={username} updateWorld={updateWorld} />
            case GLOBALS.MAIN_MODALS.MANAGERS:
                return <Managers world={world} username={username} updateWorld={updateWorld} />
            case GLOBALS.MAIN_MODALS.INVESTORS:
                return <Investors world={world} onResetWorld={onResetWorld} />
            default:
                return <></>
        }
    }

    const calcNumberCanBuy = (buttonLabel: string) => {
        switch (buttonLabel) {
            case GLOBALS.MAIN_MODALS.UNLOCKS:
                return 0
            case GLOBALS.MAIN_MODALS.CASH_UPGRADES:
                return world.upgrades.filter(upgrade => !upgrade.unlocked && upgrade.seuil <= world.money).length
            case GLOBALS.MAIN_MODALS.ANGEL_UPGRADES:
                return world.angelupgrades.filter(upgrade => !upgrade.unlocked && upgrade.seuil <= world.activeangels).length
            case GLOBALS.MAIN_MODALS.MANAGERS:
                let managers = world.managers.filter(manager => !manager.unlocked && manager.seuil <= world.money)
                //For each unlockable manager, check that at least 1 product of target is unlocked
                managers = managers.filter(manager => (world.products.find(product => product.id === manager.idcible)?.quantite ?? 0 > 0))
                return managers.length
            case GLOBALS.MAIN_MODALS.INVESTORS:
                return Math.trunc(150 * Math.sqrt(world.score / Math.pow(10, 15)) - world.totalangels)
            default:
                return 0
        }
    }

    return (<>
        <Container className="leftBar">
            {Object.values(GLOBALS.MAIN_MODALS)
                .filter(value => value !== GLOBALS.MAIN_MODALS.NONE)
                .map(value => (
                    <Row key={value + -'row'}>
                        <Col key={value + '-col'}>
                            <Badge className="leftBarButton" color="warning" badgeContent={calcNumberCanBuy(value)}>
                                <Button
                                    variant="dark"
                                    onClick={() => setModal(value)}
                                >
                                    {value}
                                </Button>
                            </Badge>
                        </Col>
                    </Row>
                )
                )
            }
        </Container>
        <Modal
            show={modal !== GLOBALS.MAIN_MODALS.NONE}
            onHide={() => setModal(GLOBALS.MAIN_MODALS.NONE)}
            className="modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>{modal}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {getNextComponent()}
            </Modal.Body>
        </Modal>
    </>)
}