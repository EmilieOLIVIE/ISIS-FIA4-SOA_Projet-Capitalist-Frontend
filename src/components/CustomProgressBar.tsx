import { useRef } from "react"
import { ProgressBar } from "react-bootstrap"

type BarProps = {
    vitesse: number,
    initialvalue?: number
    className?: string
    run: boolean
    variant?: string
    auto?: boolean
    onCompleted?: () => void
}

export default ({ vitesse, initialvalue = 0, className, run, variant = "warning", auto = false, onCompleted }: BarProps) => {

    const dateRef = useRef(Date.now() - initialvalue)

    const calcProgress = () => {
        let elapsetime = Date.now() - dateRef.current
        return 0
    }

    return (
        <ProgressBar
            animated
            now={calcProgress()}
            min={0}
            max={100}
        />
    )
}