import { gql } from "@apollo/client";

const ACHETER_QT_PRODUIT = gql`
mutation acheterQtProduit($id: Int!, $quantite: Int!) {
  acheterQtProduit(id: $id, quantite: $quantite) {
    id
  }
}
`
export default ACHETER_QT_PRODUIT;