/**
 * Generates a completely random draw of 5 distinct numbers between 1 and 45.
 * This is the standard true-random lottery style draw.
 */
export function generateRandomDraw(): number[] {
    const possibleNumbers = Array.from({ length: 45 }, (_, i) => i + 1)
    const draw: number[] = []

    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * possibleNumbers.length)
        draw.push(possibleNumbers[randomIndex])
        possibleNumbers.splice(randomIndex, 1) // Remove to ensure uniqueness
    }

    return draw.sort((a, b) => a - b)
}
