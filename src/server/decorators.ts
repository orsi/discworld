export default function log (target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        console.log(`${key} called with args: ${JSON.stringify(args)}`);

        const result = originalMethod.apply(this, args);

        console.log(`${key} returned with result: ${JSON.stringify(result)}`);
    };
}