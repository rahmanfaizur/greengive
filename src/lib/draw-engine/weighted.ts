/**
 * Generates a draw of 5 distinct numbers between 1 and 45, weighted safely.
 * For example, it could slightly boost numbers that correspond to popular
 * par 3 scores, or recent average distributions, without completely removing randomness.
 */

// Simple weighting map: boost numbers 20-36 (common Stableford scores)
const WEIGHTS = new Map<number, number>()
for (let i = 1; i <= 45; i++) {
    if (i >= 20 && i <= 36) {
        WEIGHTS.set(i, 3) // 3x chance to be picked
    } else {
        WEIGHTS.set(i, 1) // Base chance
    }
}

export function generateWeightedDraw(): number[] {
    let availableNumbers = Array.from({ length: 45 }, (_, i) => i + 1)
    const draw: number[] = []

    for (let i = 0; i < 5; i++) {
        // Calculate total weight of currently available numbers
        const totalWeight = availableNumbers.reduce((sum, num) => sum + (WEIGHTS.get(num) || 1), 0)

        // Pick a random threshold
        let random = Math.random() * totalWeight

        // Find the number that matches this weight slice
        let selectedIndex = 0
        for (let j = 0; j < availableNumbers.length; j++) {
            random -= WEIGHTS.get(availableNumbers[j]) || 1
            if (random <= 0) {
                selectedIndex = j
                break
            }
        }

        draw.push(availableNumbers[selectedIndex])
        availableNumbers.splice(selectedIndex, 1) // Remove it from available pool
    }

    return draw.sort((a, b) => a - b)
}
