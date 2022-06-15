import { gql } from "@apollo/client";

const ACHETER_ANGEL_UPGRADE = gql`
mutation acheterAngelUpgrade($name: String!) {
  acheterAngelUpgrade(name: $name) {
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
export default ACHETER_ANGEL_UPGRADE;