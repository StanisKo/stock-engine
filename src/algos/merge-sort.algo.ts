/*
Optimize!
*/

const merge = (left: number[], right: number[]): number[] => {

    const result = [];

    let leftIndex = 0;

    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {

        if (left[leftIndex] < right[rightIndex]) {

            result.push(left[leftIndex]);

            leftIndex++;
        }
        else {

            result.push(right[rightIndex]);

            rightIndex++;
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
};

export const mergeSort = (input: number[]): number[] => {

    if (input.length === 1) {

        return input;
    }

    const length = input.length;

    const middle = Math.floor(length / 2);

    const left = input.slice(0, middle);

    const right = input.slice(middle);

    return merge(mergeSort(left), mergeSort(right));
};
