import { Fragment, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useMutation } from "@apollo/client";

import { Palier, Product, World } from "../world";

import ProductComponent from "./ProductComponent";
import LeftMenu from "./LeftMenu";
import Header from "./Header";

import GLOBALS from "../Globals";
import { calculateGeometricSequence, calculateGeometricSequenceSum, customToast, toastError } from "../Util";
import { ACHETER_QT_PRODUIT } from "../services";
import { useEffect } from "react";

type MainProps = {
    loadedWorld: World
    username: string
    onUsernameChanged: (event: any) => void
    onResetWorld: () => void
}

export default ({
    loadedWorld,
    username,
    onUsernameChanged,
    onResetWorld
}: MainProps) => {

    const [world, setWorld] = useState(JSON.parse(JSON.stringify(loadedWorld)) as
        World)

    /**
     * Update saved state when loaded world changes
     */
    useEffect(() => {
        setWorld(JSON.parse(JSON.stringify(loadedWorld)) as
            World)
    }, [loadedWorld])

    const [multiplierIndex, setMultiplierIndex] = useState(0)

    const [acheterQtProduit] = useMutation(ACHETER_QT_PRODUIT,
        {
            context: { headers: { "x-user": username } },
            onError: (error) => toastError(error.message),
            onCompleted: (data) => console.log(data) //buyProduct(acheterQtProduit)
        }
    )

    /**
     * Change multiplier current index
     * 
     * x1 -> x10 -> x100 -> Max -> x1
     */
    const changeMultiplier = () => {
        multiplierIndex === GLOBALS.MULTIPLIER.length - 1 ?
            setMultiplierIndex(0) : setMultiplierIndex(multiplierIndex + 1)
        //multiplier === Globals.multiplier[0]
    }

    /**
     * Update player's money shown in header
     * @param product 
     */
    const updateMoney = (qt: number, product: Product) => {
        let gain = qt * product.quantite * product.revenu * (1 + world.angelbonus * world.activeangels / 100)
        let money = world.money + gain
        let score = world.score + gain
        setWorld((prevWorld) => ({
            ...prevWorld,
            money,
            score
        })
        )
    }

    const buyProduct = (qt: number, product: Product) => {
        acheterQtProduit({ variables: { id: product.id, quantite: qt } })
        let newWorld = { ...world }
        let newProduct = newWorld.products.find(item => product.id === item.id)
        if (newProduct) {
            console.log(newWorld.money)
            newWorld.money -= calculateGeometricSequenceSum(product.cout, product.croissance, qt)
            console.log(newWorld.money)
            newProduct.quantite += qt
            newProduct.cout = calculateGeometricSequenceSum(product.cout, product.croissance, qt)

            let newLevel = newProduct.paliers.find(palier => !palier.unlocked)
            if (newLevel) {
                if (newProduct.quantite === newLevel.seuil) {
                    //Unlock new level
                    newLevel.unlocked = true
                    newWorld = updateProduct(newWorld, newLevel)

                    let phrase = <>{newLevel.name} <hr /> x{newLevel.ratio} {newLevel.typeratio} ({newProduct.name})</>
                    customToast(phrase)
                }
            }
        }

        setWorld(newWorld)
    }

    console.log(world.money)

    const saveProductTimeleft = (product: Product) => {
        let newProducts = world.products
        let productIndex = newProducts.findIndex(element => element.id === product.id)
        newProducts[productIndex].timeleft = product.timeleft
        setWorld((prevWorld) => ({
            ...prevWorld,
            products: newProducts,
        }))
    }

    return (<Fragment>
        <Header
            //key={world.money}
            world={world}
            username={username}
            multiplierIndex={multiplierIndex}
            onUsernameChanged={onUsernameChanged}
            changeMultiplier={changeMultiplier}
        />
        <Container fluid className="main">
            <Row>
                <Col className="col-2">
                    <LeftMenu
                        world={world}
                        username={username}
                        updateWorld={(world) => setWorld({ ...world })}
                        onResetWorld={onResetWorld}
                    />
                </Col>
                <Col className="products col-10">
                    {world.products.map(product => (
                        <ProductComponent
                            username={username}
                            product={product}
                            onProductionDone={updateMoney}
                            saveProductTimeleft={saveProductTimeleft}
                            multiplierIndex={multiplierIndex}
                            money={world.money}
                            onBuyProduct={buyProduct}
                        />
                    ))}
                </Col>
            </Row>
        </Container>
    </Fragment>
    );
}

const updateProduct = (world: World, upgrade: Palier) => {
    let product = world.products.find(prod => prod.id === upgrade.idcible)
    if (product) {
        if (upgrade.typeratio === GLOBALS.TYPE_RATIO.GAIN) product.revenu *= upgrade.ratio
        else if (upgrade.typeratio === GLOBALS.TYPE_RATIO.VITESSE) product.vitesse /= upgrade.ratio
        else if (upgrade.typeratio === GLOBALS.TYPE_RATIO.ANGE) console.log("angel")
    }
    return world
}