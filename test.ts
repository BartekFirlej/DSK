function calculateArea(rectLength: number, rectWidth: number): number {
    return rectLength * rectWidth;
}

const rectLength = 5;
const rectWidth = 10;
const area = calculateArea(rectLength, rectWidth);

console.log(`The area of the rectangle is: ${area}`);
