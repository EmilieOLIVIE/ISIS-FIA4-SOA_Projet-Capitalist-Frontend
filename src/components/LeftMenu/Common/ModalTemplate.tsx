import { Button, Col, Row, Table } from "react-bootstrap"

import { Palier } from "../../../world"

import { ReactComponent as Coin } from '../../../assets/images/coin.svg'
import { ReactComponent as Angel } from '../../../assets/images/angel.svg'
import { numberWithSpaces } from "../../../Util"
import GLOBALS from "../../../Globals"

type ModalTemplateProps = {
    typePalier: string
    palier: Palier
    nameCible: string
    buyDisabled?: boolean
    hideBuyButton?: boolean
    onClickBuy?: () => void
}

export default ({ typePalier, palier, nameCible, buyDisabled, hideBuyButton, onClickBuy }: ModalTemplateProps) => {

    return (
        <Row className="text-center mb-4 align-items-center">
            <Col sm={2}>
                <div className="logo">
                    <img alt="manager logo" className="round" src={GLOBALS.SERVER + palier.logo} />
                </div>
            </Col>
            <Col className="flex-grow-1">
                <Table striped>
                    <thead>
                        <tr>
                            <th colSpan={2}>{palier.name}</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <th>Cible</th>
                            <td>{nameCible}</td>
                        </tr>
                        <tr>
                            <th>Seuil</th>
                            {typePalier === GLOBALS.MAIN_MODALS.UNLOCKS ?
                                <td>{palier.seuil}</td>
                                : typePalier === GLOBALS.MAIN_MODALS.ANGEL_UPGRADES ?
                                    <td><Angel className="coinIcon" /> {numberWithSpaces(palier.seuil)}</td>                                    
                                    : <td><Coin className="coinIcon" /> {numberWithSpaces(palier.seuil)}</td>

                            }
                        </tr>
                        {typePalier !== GLOBALS.MAIN_MODALS.MANAGERS ?
                            <tr>
                                <th>Bonus</th>
                                <td>{palier.typeratio} x{palier.ratio}</td>
                            </tr>
                            : null
                        }
                    </tbody>
                </Table>
            </Col>
            {typePalier !== GLOBALS.MAIN_MODALS.UNLOCKS && !hideBuyButton ?
                <Col sm={2}>
                    <Button disabled={buyDisabled} onClick={onClickBuy} variant="warning" className="align-self-center">
                        {typePalier === GLOBALS.MAIN_MODALS.MANAGERS ? "Hire" : "Buy"}
                    </Button>
                </Col>
                : null}
        </Row>
    )
}