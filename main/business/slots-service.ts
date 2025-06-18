import { BehaviorSubject, filter, map, Observable, Subject } from "rxjs";
import { SpinState } from "../domain/spin-state.enum";
import { SpinResult } from "../domain/spin-result";
import { Spinner } from "./spinner";
import { DoublingColor } from "../domain/doubling-color.enum";
import { RustLevel } from "../domain/rust-level";

export class SlotsService {

    // TODO make this an enum
    private readonly rustThresholds: {rustLevel: RustLevel, threshold: number}[] = [
        {
            rustLevel: RustLevel.LEVEL_0,
            threshold: 0
        },
        {
            rustLevel: RustLevel.LEVEL_1,
            threshold: 2
        }, 
        {
            rustLevel: RustLevel.LEVEL_2,
            threshold: 4
        }, 
        {
            rustLevel: RustLevel.LEVEL_3,
            threshold: 6
        }, 
        {
            rustLevel: RustLevel.LEVEL_4,
            threshold: 8
        }
    ]

    private constructor() {}

    private _spinResultSubject: BehaviorSubject<SpinResult | null> = new BehaviorSubject<SpinResult | null>(null)
    get spinResultObservable(): Observable<SpinResult> {
        return this._spinResultSubject.asObservable()
            .pipe(filter((spinResult: SpinResult | null) => spinResult !== null))
    }

    private _amountWonSubject: BehaviorSubject<number> = new BehaviorSubject(0);
    get amountWonObservable(): Observable<number> {
        return this._amountWonSubject.asObservable();
    }

    private _amountLostSubject: BehaviorSubject<number> = new BehaviorSubject(0);
    get amountLostObservable(): Observable<number> {
        return this._amountLostSubject.asObservable();
    }

    private _spinStateSubject: BehaviorSubject<SpinState> = new BehaviorSubject<SpinState>(SpinState.NOT_SPINNING);
    get spinStateObservable(): Observable<SpinState> {
        return this._spinStateSubject.asObservable();
    }

    private _selectedBetSubject: BehaviorSubject<SelectedBet> = new BehaviorSubject<SelectedBet>({
        current: 0.2,
        last: 0.2
    });
    get selectedBetObservable(): Observable<SelectedBet> {
        return this._selectedBetSubject.asObservable();
    }

    private _currentWinSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    get currentWinObservable(): Observable<number> {
        return this._currentWinSubject.asObservable();
    }

    private _randomChosenColorSubject: BehaviorSubject<DoublingColor> = new BehaviorSubject<DoublingColor>(DoublingColor.RED);
    get randomChosenColorObservable(): Observable<DoublingColor> {
        return this._randomChosenColorSubject.asObservable();
    }

    private _rustLevelSubject: BehaviorSubject<RustLevel> = new BehaviorSubject<RustLevel>(RustLevel.LEVEL_0); 
    get rustLevelObservable(): Observable<RustLevel> {
        return this._rustLevelSubject.asObservable();
    }

    public spin() {
        this._amountWonSubject.next(this._amountWonSubject.value + this._currentWinSubject.value);
        this._amountLostSubject.next(this._amountLostSubject.value + this._selectedBetSubject.value.current)
        const rustLevel = 
            this.rustThresholds.findLast(rustThreshold => this._amountLostSubject.value >= rustThreshold.threshold)!;
        this._rustLevelSubject.next(rustLevel?.rustLevel)
        this._spinStateSubject.next(SpinState.SPINNING);
        setTimeout(() => {
            let spinResult = Spinner.getInstance().spin(
                this._selectedBetSubject.value.current
            );
            this._currentWinSubject.next(spinResult.totalWon);
            this._spinResultSubject.next(spinResult);
            this._spinStateSubject.next(SpinState.NOT_SPINNING)
        }, 2000);
    }

    public selectBet(bet: number) {
        if (this._spinStateSubject.value !== SpinState.NOT_SPINNING &&
            this._spinStateSubject.value !== SpinState.DOUBLING_END
        ) {
            return
        }
        if (this._selectedBetSubject.value.current !== bet) {
            let last = this._selectedBetSubject.value.current;
            this._selectedBetSubject.next({
                current: bet,
                last
            });
        }
    }

    public enterDoubling() {
        if (this._spinStateSubject.value === SpinState.NOT_SPINNING &&
            this._spinResultSubject.value !== null &&
            this._spinResultSubject.value.totalWon !== 0
        ) {
            this._spinStateSubject.next(SpinState.DOUBLING)
        }
    }

    public double(color: DoublingColor) {
        this._spinStateSubject.next(SpinState.WAITING_FOR_DOUBLING_RESULT);
        const randomColor = Math.random() < 0.5 ? DoublingColor.RED : DoublingColor.BLACK;
        this._spinStateSubject.next(SpinState.SHOWING_DOUBLING_RESULT)
        this._randomChosenColorSubject.next(randomColor);
        setTimeout(() => {
            if (randomColor === color) {
                this._currentWinSubject.next(this._currentWinSubject.value * 2)
                this._spinStateSubject.next(SpinState.DOUBLING)
            } else {
                this._currentWinSubject.next(0);
                this._spinStateSubject.next(SpinState.DOUBLING_END);
                this._spinStateSubject.next(SpinState.NOT_SPINNING);
            }
        }, 2000)
    }

    public exitDoubling() {
        this._spinStateSubject.next(SpinState.DOUBLING_END);
        this._spinStateSubject.next(SpinState.NOT_SPINNING);
    }

    private static instance: SlotsService | undefined = undefined;

    public static getInstance() {
        if (!SlotsService.instance) {
            SlotsService.instance = new SlotsService()
        }
        return SlotsService.instance
    }

}
