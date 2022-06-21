//Imports from external sources
import { Fragment, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useMutation } from "@apollo/client";

//Import schema
import { Product, World } from "../world";
import { ACHETER_QT_PRODUIT } from "../services";

//Import components 
import ProductComponent from "./ProductComponent";
import LeftMenu from "./LeftMenu";
import Header from "./Header";

//Import utils
import GLOBALS from "../Globals";
import { calcGeometricSequenceNSum, customToast, formatPhrase, getGeometricSequenceNTerm, toastError, updateProduct } from "../Util";

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

    const [world, setWorld] = useState(JSON.parse(JSON.stringify(loadedWorld)) as World)

    /**
     * Update saved state when loaded world changes
     */
    useEffect(() => {
        setWorld(JSON.parse(JSON.stringify(loadedWorld)) as World)
    }, [loadedWorld])

    const [multiplierIndex, setMultiplierIndex] = useState(0)

    const [acheterQtProduit] = useMutation(ACHETER_QT_PRODUIT,
        {
            context: { headers: { "x-user": username } },
            onError: (error) => toastError(error.message),
            onCompleted: (data) => console.log(data)
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
    }

    /**
     * Calculate gain from production
     * and update player's money
     * @param product 
     */
    const updateMoney = (qt: number, product: Product) => {
        //Calculate gain from production ; gain depends on product's price and owned quantity as well as world's current active angels
        let gain = qt * product.quantite * product.revenu * (1 + world.angelbonus * world.activeangels / 100)

        //Update player's money and score
        world.money += gain
        world.score += gain

        setWorld({ ...world })
    }

    /**
     * Buy qt of product ; if product has reached
     * a new internal level, unlock it.
     * @param qt Quantity of product to buy
     * @param product Targeted product
     */
    const buyProduct = (qt: number, product: Product) => {
        acheterQtProduit({ variables: { id: product.id, quantite: qt } })
        world.money -= calcGeometricSequenceNSum(product.cout, product.croissance, qt)
        product.quantite += qt
        product.cout = getGeometricSequenceNTerm(product.cout, product.croissance, qt + 1)

        //Check if product has reached a new internal level
        product.paliers.forEach(level => {
            if (!level.unlocked && product.quantite >= level.seuil) {
                //Unlock new level
                level.unlocked = true
                product = updateProduct(product, level)
                customToast(formatPhrase(level))
            }
        })

        //Check if product has reached a new global level
        world.allunlocks.forEach(level => {
            if (!level.unlocked) {
                //Check that all products have reached unlock threshold
                if (world.products.every(product => product.quantite >= level.seuil)) {
                    level.unlocked = true
                    //If so, update all products
                    world.products.forEach(product => {
                        product = updateProduct(product, level)
                    })
                    customToast(formatPhrase(level))
                }
            }
        })

        setWorld({ ...world })
    }


    return (<Fragment>
        <Header
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
                            key={product.name}
                            username={username}
                            product={product}
                            onProductionDone={updateMoney}
                            multiplierIndex={multiplierIndex}
                            world={world}
                            onBuyProduct={buyProduct}
                        />
                    ))}
                </Col>
            </Row>
        </Container>
    </Fragment>
    );
}