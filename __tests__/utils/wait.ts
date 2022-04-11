/**
 * A wait utility
 * @param time - duration in milliseconds
 * @returns 
 */
export const wait = (time: number): Promise<void> => new Promise(resolve => {
    setTimeout(() => {
        resolve();
    }, time);
});
