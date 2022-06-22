import { gql } from "@apollo/client";

const ACHETER_ANGEL_UPGRADE = gql`
mutation acheterAngelUpgrade($name: String!) {
  acheterAngelUpgrade(name: $name) {
    name
  }
}
`
export default ACHETER_ANGEL_UPGRADE;