export abstract class Modifier {
    private constructor(
        public readonly x2: number,
        public readonly x3: number,
        public readonly x4: number,
        public readonly x5: number
    ) {}

    [key: string]: any

    public static readonly Low = new class extends Modifier {
        public constructor() {
            super(0, 0.25, 1, 5)
        }
    }

    public static readonly Medium = new class extends Modifier {
        public constructor() {
            super(0, 0.5, 2, 10)
        }
    }

    public static readonly High = new class extends Modifier {
        public constructor() {
            super(0.25, 2, 5, 25)
        }
    }

    public static readonly Amazing = new class extends Modifier {
        public constructor() {
            super(0.5, 4, 20, 100)
        }
    }

    public static readonly Scatter = new class extends Modifier {
        public constructor() {
            super(0, 2, 15, 50)
        }
    }

    public static readonly Jackpot = new class extends Modifier {
        public constructor() {
            super(0.5, 5, 50, 250)
        }
    }
}
