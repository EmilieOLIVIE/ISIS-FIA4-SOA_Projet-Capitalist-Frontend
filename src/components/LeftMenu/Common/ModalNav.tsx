import { Nav } from "react-bootstrap"

export default ({ onSelectKey }: { onSelectKey: (isUnlockedKey: boolean) => void }) => {

    return (
        <Nav className="justify-content-center" variant="tabs" defaultActiveKey={LOCKED_KEY} onSelect={key => onSelectKey(key === UNLOCKED_KEY)}>
            <Nav.Item>
                <Nav.Link eventKey={LOCKED_KEY}>Locked</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey={UNLOCKED_KEY}>Unlocked</Nav.Link>
            </Nav.Item>
        </Nav>
    )
}

const UNLOCKED_KEY = "unlocked"
const LOCKED_KEY = "locked"