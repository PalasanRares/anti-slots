import { fromEventPattern } from "rxjs";

export function initObservable(getObservable) {
    return fromEventPattern((handler) => getObservable(handler));
}
