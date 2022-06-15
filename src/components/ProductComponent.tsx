import { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { Badge, Button, Card, InputGroup, ProgressBar, Stack } from "react-bootstrap";
import { useMutation } from "@apollo/client";

import { Product } from "../world";
import { LANCER_PRODUCTION } from "../services";

import MyProgressbar from "./MyProgressbar";

import { ReactComponent as Coin } from '../assets/images/coin.svg'
import { calculateGeometricSequence, calculateGeometricSequenceSum, toastError, transform } from "../Util";
import GLOBALS from "../Globals";
import CustomProgressBar from "./CustomProgressBar";

type ProductProps = {
    username: string
    product: Product,
    multiplierIndex: number
    money: number
    onProductionDone: (qt: number, product: Product) => void
    onBuyProduct: (qt: number, product: Product) => void
    saveProductTimeleft: (product: Product) => void
}

export default ({
    username,
    product,
    onProductionDone,
    onBuyProduct,
    multiplierIndex,
    money,
    saveProductTimeleft
}: ProductProps) => {

    const [lancerProduction] = useMutation(LANCER_PRODUCTION,
        {
            context: { headers: { "x-user": username } },
            onError: (error): void => {
                console.log(error)
                //toastError()
                // actions en cas d'erreur
            }
        }
    )

    const [maxCanBuy, setMaxCanBuy] = useState(0)
    const [run, setRun] = useState(product.managerUnlocked)
    const [progress, setProgress] = useState(0)
    const [timeleft, setTimeleft] = useState(product.timeleft)

    if (product.lastupdate <= 0) {
        product.lastupdate = Date.now()
    }

    useEffect(() => {
        setMaxCanBuy(calcMaxCanBuy())
    }, [money, multiplierIndex])

    /**
     * Calculate score depending on the product state of production :
     * + timeleft = 0, product is not being produced
     * + timeleft > 0, product is being produced ; calculate time elapsed since last update
     * + timeleft < 0, product is done being produced ; update player's money 
     */
    //15 lignes de code
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
                    nbOfProducts += time / product.vitesse
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

    const calcScore2 = () => {
        let elapsedTime = Date.now() - product.lastupdate //Calculate elapsed time since last update
        let time = elapsedTime - product.timeleft
        let nbOfProducts = 0
        // if (time < 0) product.timeleft -= time
        // else {
        //     if (product.managerUnlocked) {
        //         product.timeleft = 0
        //         quantite = 1
        //     } else {

        //     }
        // }

        //If manager is unlocked
        if (product.managerUnlocked) {
            //Calculate number of products produced
            nbOfProducts = Math.trunc(time / product.vitesse)
            //Update product production time according to elapsed time
            product.timeleft = product.vitesse - (time % product.vitesse)
            //Elapsed time / speed products have been created
        }
        //If production time is not null, product is being produced
        else if (product.timeleft !== 0) {
            //If manager is not yet unlocked, only 1 product has been created
            if (product.timeleft < 0) {
                nbOfProducts = 1
                product.timeleft = 0
            } else {
                product.timeleft -= elapsedTime
            }
        }
        console.log(nbOfProducts)

        if (nbOfProducts > 0) onProductionDone(nbOfProducts, product)


        //time /= product.vitesse
        //onProductionDone(product, qt)

        product.lastupdate = Date.now()
        // if (product.timeleft <= 0) {
        //     product.timeleft = 0
        //     setProgress(0)
        // }
        // else {
        //     product.timeleft = Date.now() - product.lastupdate
        //     //let newProgress = product.vitesse - product.timeleft
        //     //setProgress(newProgress)
        // }

        // /*         product.timeleft =
        //             product.timeleft <= 0 ?
        //                 0
        //                 : Date.now() - product.lastupdate
        //  */
        // product.lastupdate = Date.now()

        // console.log(product.timeleft, progress)
        // if (product.timeleft <= 0 && run) {
        //     //&& product.managerUnlocked
        //     //onProductionDone(product)
        // }
    }

    const savedCallback = useRef(calcScore)

    useEffect(() => savedCallback.current = calcScore)

    useEffect(() => {
        let timer = setInterval(() => savedCallback.current(), 100)
        return function cleanup() {
            saveProductTimeleft(product)
            if (timer) clearInterval(timer)
        }
    }, [])

    /**
     * Calculate maximum quantity of this product
     * that player can buy
     * @returns maxCanBuy
     */
    const calcMaxCanBuy2 = () => {
        let canBuy = true
        let maxCanBuy = 1 //n
        let u = calculateGeometricSequence(product.cout, product.croissance, product.quantite)
        //CA BUG ICI
        while (canBuy) {
            u = u * product.croissance
            if (money > u) {
                maxCanBuy++
            }
            else canBuy = false
        }
        return maxCanBuy
    }

    const calcMaxCanBuy = () => {
        return Math.floor(Math.log(1 - (money * (1 - product.croissance)) / product.cout) / Math.log(product.croissance))
        let maxCanBuy = 1
        let cost = calculateGeometricSequenceSum(product.cout, 1 - product.croissance, maxCanBuy)

        while (money > cost) {
            maxCanBuy++
            cost = calculateGeometricSequenceSum(product.cout, 1 - product.croissance, maxCanBuy)
        }

        return maxCanBuy
    }

    const calcProductCost = () => {
        let quantity = getQuantityToBuy()
        return calculateGeometricSequenceSum(product.cout, product.croissance, quantity)
    }

    /**
     * Start product production
     * @param event 
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
     * @returns quantityToBuy
     */
    const getQuantityToBuy = () => {
        switch (multiplierIndex) {
            //A ameliorer
            case 0:
                return 1
            case 1:
                return 10
            case 2:
                return maxCanBuy
            default:
                let nextPalier = getNextPalier()
                return nextPalier ? nextPalier.seuil - product.quantite : 0
        }
    }

    const getNextPalier = () => {
        for (let i = 0; i < product.paliers.length; i++) {
            if (!product.paliers[i].unlocked) return product.paliers[i]
        }
    }

    /**
     * 
     */
    const canBuyProduct = () => {
        return money >= calcProductCost()
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
                    <Badge pill className="overlap" bg="dark">{product.quantite}</Badge>
                </div>
                <div className='flex-grow-1'>
                    <Stack gap={2}>
                        <div className="progressBar">
                            <MyProgressbar
                                className="bar"
                                vitesse={product.vitesse}
                                initialvalue={product.vitesse - product.timeleft}
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
                                disabled={!canBuyProduct()}>
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
                            <input type="time" disabled value={Date.now() - product.lastupdate} />
                        </InputGroup>
                    </Stack>
                </div>
            </Stack>
        </Card>
    )
}


/*
                    <ProgressBar now={Math.round(((product.vitesse - product.timeleft) / product.vitesse) * 100)} min={0} max={100} />
                        <CustomProgressBar
                            vitesse={product.vitesse}
                            initialvalue={product.vitesse - product.timeleft}
                            run={run}
                            auto={product.managerUnlocked}
                            onCompleted={() => null}
                        />
*/