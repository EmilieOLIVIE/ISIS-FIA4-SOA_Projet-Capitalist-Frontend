import { gql } from "@apollo/client";

const ACHETER_QT_PRODUIT = gql`
mutation acheterQtProduit($id: Int!, $quantite: Int!) {
  acheterQtProduit(id: $id, quantite: $quantite) {
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
export default ACHETER_QT_PRODUIT;