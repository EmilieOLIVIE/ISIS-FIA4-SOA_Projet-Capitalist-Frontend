import { toast } from "react-toastify";

export function transform(valeur: number): string {
    let res: string = "";
    if (valeur < 1000) res = valeur.toFixed(2);
    else if (valeur < 1000000) res = valeur.toFixed(0);
    else if (valeur >= 1000000) {
        res = valeur.toPrecision(4);
        res = res.replace(/e\+(.*)/, " 10<sup>$1</sup>");
    }
    return res;
};

export function calculateGeometricSequence(startValue: number, ratio: number, n: number): number {
    for (let i = 1; i < n; i++) {
        startValue = startValue * ratio
    }
    return startValue
}

export function calculateGeometricSequenceSum(startValue: number, ratio: number, n: number): number {
    return startValue * (1 - Math.pow(ratio, n)) / (1 - ratio)
}


export function customToast(message: string | JSX.Element) {
    return toast(
        message,
        {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        }
    )
}

export function toastError(message: string | JSX.Element) {
    return toast.error(
        message,
        {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        }
    )
}

export function toastSuccess(message: string | JSX.Element) {
    return toast.success(
        message,
        {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        }
    )
}