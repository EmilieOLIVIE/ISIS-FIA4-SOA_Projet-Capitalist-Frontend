import { Button } from "react-bootstrap"

import { World } from "../../world"

import { ReactComponent as Angel } from '../../assets/images/angel.svg'
import { numberWithSpaces } from "../../Util"

type InvestorsProps = {
    world: World
    onResetWorld: () => void
}

export default ({ world, onResetWorld }: InvestorsProps) => {

    return (<>
        <div className="text-center mb-4">
            <Angel className="angelIcon" />
            {numberWithSpaces(world.activeangels)} total angels
        </div>
        <div className="text-center mb-4">
            {world.angelbonus} % bonus per angel
        </div>
        <div className="text-center">
            <Button disabled={false} onClick={onResetWorld} variant="warning">
                {numberWithSpaces(Math.trunc(150 * Math.sqrt(world.score / Math.pow(10, 15)) - world.totalangels))} angels to claim with Restart
            </Button>
        </div>
    </>)
}

//Ajouter confirmAlert ?