import { gql } from "@apollo/client"

const LANCER_PRODUCTION = gql`
mutation lancerProductionProduit($id: Int!) {
  lancerProductionProduit(id: $id) {
    id
    name
    logo
    cout
    croissance
    revenu
    vitesse
    quantite
    timeleft
    managerUnlocked
    paliers {
    name
    logo
    seuil
    idcible
    ratio
    typeratio
    unlocked
    }
  }
}
`

export default LANCER_PRODUCTION;