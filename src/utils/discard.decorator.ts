/* eslint-disable @typescript-eslint/no-explicit-any */

/*
Exists to mark uncalculatable fields (missing data) with N/A, leading to discard on
database schema level

Wraps original calculator method, consumes result, checks, returns N/A or original result
*/
export const Discard = (target: any, propertyKey: string, descriptor: PropertyDescriptor): void => {

    if (typeof descriptor.value === 'function') {

        /*
        Grab the method that we are wrapping with the decorator
        */
        const wrappedMethod = descriptor.value;

        /*
        Provide a new method that replaces the original method

        NOTE: mind the syntax, it is required to pass original arguments into the method
        */
        descriptor.value = function (...originalArguments: any[]): number | string {

            /*
            Consume the result of original method
            */
            const result = wrappedMethod.apply(target, originalArguments);

            /*
            Check if result is NaN or infinity, or null, and if so -- replace with N/A
            */
            if (isNaN(result) || !isFinite(result) || result === null) {

                return 'N/A';
            }

            return result;
        };
    }
};
