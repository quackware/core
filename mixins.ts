import { Class } from "https://git.quack.id/types/class.ts";

export function applyMixins<
  Derived extends Class<unknown>,
  Ctors extends Class<unknown>,
>(
  derivedCtor: Derived,
  constructors: Ctors[],
) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ??
          Object.create(null),
      );
    });
  });
}

export { applyMixins as mixins };
export default applyMixins;

// TODO: Re-implement below
/**
 * ```ts
 * function base<T>() {
 *   class Base {
 *     static prop: T;
 *   }
 *   return Base;
 * }
 *
 * function derived<T>() {
 *   class Derived extends base<T>() {
 *     static anotherProp: T;
 *   }
 *   return Derived;
 * }
 *
 * class Spec extends derived<string>() {}
 *
 * Spec.prop; // string
 * Spec.anotherProp; // string
 * ```
 */
