import { gql } from "@apollo/client";

const ENGAGER_MANAGER = gql`
mutation engagerManager($name: String!) {
  engagerManager(name: $name) {
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
export default ENGAGER_MANAGER;