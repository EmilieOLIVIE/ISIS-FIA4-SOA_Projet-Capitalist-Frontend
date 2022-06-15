import { gql } from "@apollo/client"

const LANCER_PRODUCTION = gql`
mutation lancerProductionProduit($id: Int!) {
    lancerProductionProduit(id: $id) {
        id
    }
}
`

export default LANCER_PRODUCTION;