import { Button, Col, Row } from "react-bootstrap"

import { ReactComponent as Coin } from '../../assets/images/coin.svg'

import GLOBALS from "../../Globals"
import { Palier } from "../../world"

type ModalTemplateProps = {
    typePalier: string
    palier: Palier
    nameCible: string
    buyDisabled?: boolean
    onClickBuy?: () => void
}

export default ({ typePalier, palier, nameCible, buyDisabled, onClickBuy }: ModalTemplateProps) => {
    return (
        <Row key={palier.idcible} className="text-center mb-4 align-items-center">
            <Col sm={2}>
                <div className="logo">
                    <img alt="manager logo" className="round" src={GLOBALS.SERVER + palier.logo} />
                </div>
            </Col>
            <Col className="flex-grow-1">
                <div className="mb-1"> {palier.name} </div>
                <div className="mb-1"> {nameCible} </div>
                {typePalier !== GLOBALS.MAIN_MODALS.UNLOCKS ?
                    <div className="mb-1"> <Coin className="coinIcon" /> {palier.seuil} </div>
                    : null
                }
                {typePalier !== GLOBALS.MAIN_MODALS.MANAGERS ?
                    <div className="mb-1"> {nameCible}  {palier.typeratio} x{palier.ratio} </div>
                    : null
                }
            </Col>
            {typePalier !== GLOBALS.MAIN_MODALS.UNLOCKS ?
                <Col sm={2}>
                    <Button disabled={buyDisabled} onClick={onClickBuy} className="align-self-center ">
                        {typePalier === GLOBALS.MAIN_MODALS.MANAGERS ? "Hire" : "Buy"}
                    </Button>
                </Col>
                : null}
        </Row>

    )
}