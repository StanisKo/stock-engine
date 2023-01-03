/* eslint-disable @typescript-eslint/no-explicit-any */

export const discard = (target: any, propertyKey: string, descriptor: PropertyDescriptor): void => {

    if (typeof descriptor.value === 'function') {

        /*
        Grab the method that we are wrapping with the decorator
        */
        const wrappedMethod = descriptor.value;

        /*
        Provide a new method that replaces the original method
        */
        descriptor.value = (): number | string => {

            /*
            Consume the result of original method
            */
            const result = wrappedMethod.apply(target);

            /*
            Check if result is NaN or infinity, or null, and if so -- replace with N/A
            that leads to discard on database layer
            */
            if (isNaN(result) || !isFinite(result) || result === null) {

                return 'N/A';
            }

            return result;
        };
    }
};
