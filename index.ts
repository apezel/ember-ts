import * as Ember from 'Ember';

export function EmberChain(constructor: Function) {
    const mixin:any = Ember.Mixin.create(),
          parent:any = Object.getPrototypeOf(constructor);
    mixin.properties = mixin.properties || {};
    Object.getOwnPropertyNames(constructor.prototype).forEach((prop) => {
      if (prop !== 'constructor') {
        mixin.properties[prop] = constructor.prototype[prop];
      }
    });
    return (<any>parent).extend(mixin);
}

export function on(...events : string[]) {
  return function(target: any, 
              propertyKey: string, 
              descriptor: TypedPropertyDescriptor<any>): any {
    descriptor.value.__ember_listens__ = events;
    return descriptor;
  }
}

export function observes(...props : string[]) {
  return function(target: any, 
              propertyKey: string, 
              descriptor: TypedPropertyDescriptor<any>): any {
    props.push(descriptor.value);
    descriptor.value = Ember.observer("viz", descriptor.value);
    return descriptor;
  }
}

export function computed(...props : string[]) {
  return function(target: any, 
              propertyKey: string, 
              descriptor: TypedPropertyDescriptor<any>): any {
    let ret = Ember.computed(descriptor.value);
    descriptor.value = ret.property(...props);
    return descriptor;
  }
}
