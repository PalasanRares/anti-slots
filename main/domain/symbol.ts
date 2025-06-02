import { Modifier } from "./modifier"
import { SymbolName } from "./symbol-name.enum"
import { Weight } from "./weight.enum"

export abstract class Symbol {
    private constructor(
        public readonly name: SymbolName,
        public readonly modifier: Modifier,
        public readonly weight: Weight
    ) {}

    static [key: string]: any
    [key: string]: any

    public static readonly J = new class extends Symbol {
        public constructor() {
            super(SymbolName.J, Modifier.Low, Weight.COMMON)
        }
    }

    public static readonly Q = new class extends Symbol {
        public constructor() {
            super(SymbolName.Q, Modifier.Low, Weight.COMMON)
        }
    }

    public static readonly K = new class extends Symbol {
        public constructor() {
            super(SymbolName.K, Modifier.Low, Weight.COMMON)
        }
    }

    public static readonly Ace = new class extends Symbol {
        public constructor() {
            super(SymbolName.ACE, Modifier.Medium, Weight.UNCOMMON)
        }
    }

    public static readonly Virus = new class extends Symbol {
        public constructor() {
            super(SymbolName.VIRUS, Modifier.Medium, Weight.UNCOMMON)
        }
    }

    public static readonly Toilet = new class extends Symbol {
        public constructor() {
            super(SymbolName.TOILET, Modifier.High, Weight.RARE)
        }
    }

    public static readonly Kanye = new class extends Symbol {
        public constructor() {
            super(SymbolName.KANYE, Modifier.High, Weight.RARE)
        }
    }

    public static readonly Denis = new class extends Symbol {
        public constructor() {
            super(SymbolName.DENIS, Modifier.Amazing, Weight.SUPER_RARE)
        }
    }

    public static readonly Rares = new class extends Symbol {
        public constructor() {
            super(SymbolName.RARES, Modifier.Scatter, Weight.SUPER_RARE)
        }
    }

    public static readonly Tudor = new class extends Symbol {
        public constructor() {
            super(SymbolName.TUDOR, Modifier.Jackpot, Weight.ULTRA_RARE)
        }
    }

}
