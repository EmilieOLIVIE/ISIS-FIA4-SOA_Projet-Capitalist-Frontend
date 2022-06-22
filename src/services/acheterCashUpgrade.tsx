import { gql } from "@apollo/client";

const ACHETER_CASH_UPGRADE = gql`
mutation acheterCashUpgrade($name: String!) {
  acheterCashUpgrade(name: $name) {
    name
  }
}
`
export default ACHETER_CASH_UPGRADE;