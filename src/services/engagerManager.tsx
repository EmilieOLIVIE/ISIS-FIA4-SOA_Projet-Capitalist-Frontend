import { gql } from "@apollo/client";

const ENGAGER_MANAGER = gql`
mutation engagerManager($name: String!) {
  engagerManager(name: $name) {
    name
  }
}
`
export default ENGAGER_MANAGER;