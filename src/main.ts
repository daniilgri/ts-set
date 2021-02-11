interface IterateValues<T> {
  [Symbol.iterator](): IterableIterator<T>;
}

class CustomSet<T> implements IterateValues<T> {
  private _values: T[] = [];

  constructor(values: Iterable<T> = []) {
    this.values = [...(values as T[])];
  }

  get values(): T[] {
    return this._values;
  }

  set values(values: T[]) {
    for (let el of values) {
      this.add(el);
    }
  }

  get size(): number {
    return this._values.length;
  }

  has(value: T): boolean {
    for (let v of this._values) {
      if (v === value) {
        return true;
      }
    }
    return false;
  }

  add(value: T): CustomSet<T> {
    if (!this.has(value)) {
      this._values.push(value);
    }
    return this;
  }

  clear(): void {
    this._values = [];
  }

  delete(value: T): boolean {
    this._values = this._values.filter(el => el !== value);
    return !this.has(value);
  }

  *[Symbol.iterator]() {
    for (let el of this._values) {
      yield el;
    }
  }

  intersectWith(customSet: CustomSet<T>): CustomSet<T> {
    return new CustomSet<T>(this._values.filter(el => customSet.has(el)));
  }

  unionWith(customSet: CustomSet<T>) {
    return new CustomSet<T>([...this._values, ...customSet._values]);
  }

  isSubsetOf(customSet: CustomSet<T>): boolean {
    for (let el of this) {
      if (!customSet.has(el)) {
        return false;
      }
    }
    return true;
  }

  isSupersetOf(customSet: CustomSet<T>): boolean {
    for (let el of customSet) {
      if (!this.has(el)) {
        return false;
      }
    }
    return true;
  }

  getDifference(customSet: CustomSet<T>): CustomSet<T> {
    const newSet = new CustomSet<T>(this.values);
    for (let el of customSet) {
      newSet.delete(el);
    }
    return newSet;
  }

  symmetricDifferenceWith(customSet: CustomSet<T>): CustomSet<T> {
    const newSet = new CustomSet<T>(this.values);
    for (let el of customSet) {
      if (newSet.has(el)) {
        newSet.delete(el);
      } else {
        newSet.add(el);
      }
    }
    return newSet;
  }
}

const A = new CustomSet<string>("string");

const B = new CustomSet<string>(new CustomSet<string>("strmk"));

const C = new CustomSet<number>([1, 2, 3, 4]);

console.log(A.unionWith(B).values);

console.log(A.intersectWith(B).values);

console.log(B.isSubsetOf(A));

console.log(A.isSupersetOf(B));

console.log(A.getDifference(B).values);

console.log(A.symmetricDifferenceWith(B).values);
