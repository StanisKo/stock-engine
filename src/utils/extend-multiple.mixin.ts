/* eslint-disable @typescript-eslint/no-explicit-any */

/*
Thanks: https://www.webtips.dev/solutions/extend-multiple-classes-in-typescript
*/

export const extendMiltuple = (baseClass: any, extendedClasses: any[]): void => {

    extendedClasses.forEach(extendedClass => {

        Object.getOwnPropertyNames(extendedClass.prototype).forEach(name => {

            Object.defineProperty(
                baseClass.prototype,
                name,
                Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || Object.create(null)
            );
        });
    });
};
