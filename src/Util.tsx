import { toast } from "react-toastify";
import GLOBALS from "./Globals";
import { Palier, Product } from "./world";

export function transform(valeur: number): string {
    let res: string = "";
    if (valeur < 1000) res = valeur.toFixed(2);
    else if (valeur < 1000000) res = valeur.toFixed(0);
    else if (valeur >= 1000000) {
        res = valeur.toPrecision(4);
        res = res.replace(/e\+(.*)/, " 10<sup>$1</sup>");
    }
    return res;
}

export function numberWithSpaces(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function getGeometricSequenceNTerm(a0: number, q: number, n: number): number {
    return a0 * Math.pow(q, n - 1)
}

export function calcGeometricSequenceNSum(a0: number, q: number, n: number): number {
    return (a0 - getGeometricSequenceNTerm(a0, q, n) * q) / (1 - q)
}

export function updateProduct(product: Product, upgrade: Palier) {
    if (upgrade.typeratio === GLOBALS.TYPE_RATIO.GAIN) product.revenu *= upgrade.ratio
    else if (upgrade.typeratio === GLOBALS.TYPE_RATIO.VITESSE) product.vitesse /= upgrade.ratio
    else if (upgrade.typeratio === GLOBALS.TYPE_RATIO.ANGE) console.log("angel")
    return product
}

export function formatPhrase(upgrade: Palier) {
    let phrase = <>{upgrade.name} <hr /> x{upgrade.ratio} {upgrade.typeratio}</>
    return phrase
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