import { World } from "../world";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { Button, Row } from 'react-bootstrap'

import { ReactComponent as Coins } from "../assets/images/coins.svg" 
import { transform } from "../Util";
import GLOBALS from "../Globals";

type AppbarProps = {
    world: World
    username: string
    multiplierIndex: number
    onUsernameChanged: (event: any) => void
    changeMultiplier: () => void
}

export default ({
    world,
    username,
    multiplierIndex,
    onUsernameChanged,
    changeMultiplier
}: AppbarProps) => {

    return (
        <AppBar color="transparent" position="static" className="header">
            <Row>
                <Toolbar disableGutters>
                    <Typography
                        className="headerTypo"
                        sx={{ mr: 2 }}>
                        <img alt="world-logo"
                            src={GLOBALS.SERVER + world.logo}
                            style={{ width: "30%" }}
                        />
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: 'flex' }}>
                        <Typography className="headerTypo">
                            <Coins className="moneyIcon" />
                            <span dangerouslySetInnerHTML={{ __html: transform(world.money) }} />
                        </Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: 'flex' }}>
                        <Typography className="headerTypo">
                            Player ID : &nbsp;
                            <input type="text"
                                defaultValue={username}
                                onBlur={onUsernameChanged}
                            />
                        </Typography>
                    </Box>

                    <Button className="multiplier" variant="dark" onClick={changeMultiplier}>
                        {GLOBALS.MULTIPLIER[multiplierIndex]}
                    </Button>
                </Toolbar>
            </Row>
        </AppBar>
    );
}