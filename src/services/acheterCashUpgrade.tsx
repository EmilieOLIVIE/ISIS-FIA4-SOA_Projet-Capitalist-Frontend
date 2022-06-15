import { gql } from "@apollo/client";

const ACHETER_CASH_UPGRADE = gql`
mutation acheterCashUpgrade($name: String!) {
  acheterCashUpgrade(name: $name) {
    name
    logo
    seuil
    idcible
    ratio
    typeratio
    unlocked
  }
}
`
export default ACHETER_CASH_UPGRADE;