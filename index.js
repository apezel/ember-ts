export function EmberChain(constructor) {
    const mixin = Ember.Mixin.create(), parent = Object.getPrototypeOf(constructor);
    mixin.properties = mixin.properties || {};
    Object.getOwnPropertyNames(constructor.prototype).forEach((prop) => {
        if (prop !== 'constructor') {
            mixin.properties[prop] = constructor.prototype[prop];
        }
    });
    return parent.extend(mixin);
}
export function on(...events) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.__ember_listens__ = events;
        return descriptor;
    };
}
export function observes(...props) {
    return function (target, propertyKey, descriptor) {
        props.push(descriptor.value);
        descriptor.value = Ember.observer("viz", descriptor.value);
        return descriptor;
    };
}
export function computed(...props) {
    return function (target, propertyKey, descriptor) {
        let ret = Ember.computed(descriptor.value);
        descriptor.value = ret.property(...props);
        return descriptor;
    };
}
