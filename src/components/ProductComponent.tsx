import { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { Button, Card, InputGroup, ProgressBar, Stack } from "react-bootstrap";
import { useMutation } from "@apollo/client";

import { Product } from "../world";
import { LANCER_PRODUCTION } from "../services";

import MyProgressbar from "./MyProgressbar";

import GLOBALS from "../Globals";
import { ReactComponent as Coin } from '../assets/images/coin.svg'
import { calcGeometricSequenceNSum, getGeometricSequenceNTerm, toastError, transform } from "../Util";

type ProductProps = {
    username: string
    product: Product,
    multiplierIndex: number
    money: number
    onProductionDone: (qt: number, product: Product) => void
    onBuyProduct: (qt: number, product: Product) => void
}

export default ({
    username,
    product,
    onProductionDone,
    onBuyProduct,
    multiplierIndex,
    money,
}: ProductProps) => {

    const [lancerProduction] = useMutation(LANCER_PRODUCTION,
        {
            context: { headers: { "x-user": username } },
            onError: (error) => toastError(error.message)
        }
    )

    const [maxCanBuy, setMaxCanBuy] = useState(0)
    const [run, setRun] = useState(product.managerUnlocked)
    const [progress, setProgress] = useState(0)

    if (!product.lastupdate) {
        product.lastupdate = Date.now()
    }

    /**
     * Update max of product user can buy on money change
     */
    useEffect(() => {
        setMaxCanBuy(calcMaxCanBuy())
    }, [money, multiplierIndex])

    /**
     * Calculate score depending on the product state of production :
     * + timeleft = 0, product is not being produced
     * + timeleft > 0, product is being produced ; calculate time elapsed since last update
     * + timeleft < 0, product is done being produced ; update player's money 
     */
    const calcScore = () => {
        if (product.timeleft !== 0 || product.managerUnlocked) {
            let nbOfProducts = 0
            let elapsedTime = Date.now() - product.lastupdate
            product.lastupdate = Date.now()
            let time = elapsedTime - product.timeleft
            if (time >= 0) {
                nbOfProducts = 1
                product.timeleft = 0
                if (product.managerUnlocked) {
                    nbOfProducts += Math.trunc(time / product.vitesse)
                    product.timeleft = product.vitesse - (time % product.vitesse)
                }
                onProductionDone(nbOfProducts, product)
            } else product.timeleft = -time
            if (product.timeleft === 0) {
                setProgress(0)
            } else {
                setProgress(Math.round((product.vitesse - product.timeleft) / product.vitesse * 100))
            }
        }
    }

    const savedCallback = useRef(calcScore)

    useEffect(() => savedCallback.current = calcScore)

    useEffect(() => {
        let timer = setInterval(() => savedCallback.current(), 100)
        return function cleanup() {
            if (timer) clearInterval(timer)
        }
    }, [])

    /**
     * Calculate maximum quantity of this product
     * the player can buy
     * @returns maxCanBuy
     */
    const calcMaxCanBuy = () => {
        let n = 1
        let cost = product.cout
        while (cost < money) {
            n++
            cost = calcGeometricSequenceNSum(product.cout, product.croissance, n)
        }

        return n - 1
    }

    /**
     * Calculate the cost of [multiplier] products
     * @returns productCost
     */
    const calcProductCost = () => {
        let quantity = getQuantityToBuy()
        return calcGeometricSequenceNSum(product.cout, product.croissance, quantity)
    }

    /**
     * Start product production
     */
    const startProduction = () => {
        if (product.timeleft === 0) {
            lancerProduction({ variables: { id: product.id } });
            product.timeleft = product.vitesse
            product.lastupdate = Date.now()
            setRun(true)
        }
    }

    /**
     * Upon production done, stop progress bar
     * and update player's money
     */
    const onProgressbarCompleted = () => {
        if (!product.managerUnlocked) setRun(false)
    }

    /**
     * Ascertain quantity of product to buy
     * according to selected multiplier
     * @returns quantityToBuy
     */
    const getQuantityToBuy = () => {
        switch (multiplierIndex) {
            case 0:
                return 1
            case 1:
                return 10
            case 2:
                return maxCanBuy
            default:
                //Find next level to unlock
                let nextLevel = product.paliers.find(palier => !palier.unlocked)
                return nextLevel ? nextLevel.seuil - product.quantite : 0
        }
    }

    /**
     * Get product progression on to next reachable level.
     * If no more level to unlock, progression is 100%
     * @returns Progress bar progression
     */
    const getProgressionToNextLevel = () => {
        let nextLevelIndex = product.paliers.findIndex(palier => !palier.unlocked)
        if (nextLevelIndex === -1) return 100
        else if (nextLevelIndex === 0) return product.quantite * 100 / product.paliers[nextLevelIndex].seuil
        else return product.paliers[nextLevelIndex].seuil - product.quantite * 100 / (product.paliers[nextLevelIndex].seuil - product.paliers[nextLevelIndex - 1].seuil)
    }

    /**
     * Format product timeleft to display
     * @param timeleft 
     * @returns Displayable time
     */
    const formatTimeLeft = (timeleft: number) => {
        let date = new Date(0);
        date.setSeconds(0, timeleft);
        return date.toISOString().substr(11, 8);
    }

    return (
        <Card className="product">
            <Stack gap={2} direction="horizontal" className="d-flex">
                <div className="imgWithQuantity">
                    <button
                        disabled={product.quantite === 0}
                        className="productImage"
                        name={product.name}
                        style={{ backgroundImage: `url(${GLOBALS.SERVER}${product.logo})`, backgroundSize: "100% 100%" }}
                        onClick={startProduction}
                    />
                    <ProgressBar className="overlap" variant="warning" now={getProgressionToNextLevel()} label={product.quantite} />
                </div>
                <div className='flex-grow-1'>
                    <Stack gap={2}>
                        <div className="progressBar">
                            <MyProgressbar
                                className="bar"
                                vitesse={product.vitesse}
                                initialvalue={product.timeleft !== 0 && product.vitesse < 500 ? product.vitesse : product.vitesse - product.timeleft}
                                run={run}
                                frontcolor="#ff8800"
                                backcolor="#ffffff"
                                auto={product.managerUnlocked}
                                onCompleted={onProgressbarCompleted}
                            />
                            <span className="overlap text-dark text-center">
                                {product.revenu * product.quantite}
                            </span>
                        </div>
                        <InputGroup style={{ width: 'inherit' }}>
                            <Button
                                variant="warning"
                                className="flex-grow-1 d-flex justify-content-between"
                                onClick={() => onBuyProduct(getQuantityToBuy(), product)}
                                disabled={money < calcProductCost() || getQuantityToBuy() === 0}>
                                <span>
                                    x{getQuantityToBuy()}
                                </span>
                                <span dangerouslySetInnerHTML={{
                                    __html: `
                                ${ReactDOMServer.renderToStaticMarkup(<Coin className="coinIcon" />)} 
                                ${transform(calcProductCost())}
                                ` }}>
                                </span>
                            </Button>
                            <InputGroup.Text className="productTimeleft">
                                {formatTimeLeft(product.timeleft > 0 ? product.timeleft : 0)}
                            </InputGroup.Text>
                        </InputGroup>
                    </Stack>
                </div>
            </Stack>
        </Card>
    )
}