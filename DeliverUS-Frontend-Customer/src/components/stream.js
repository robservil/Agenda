export class Stream {
  constructor (source) {
    this.iterator = Array.from(source)
  }

  static of (item) {
    return new Stream(item)
  }

  // Operaciones de transformación
  map (fn) {
    return new Stream(this.iterator.map(fn))
  }

  filter (fn) {
    return new Stream(this.iterator.filter(fn))
  }

  reduce (fn, initialValue) {
    return this.iterator.reduce(fn, initialValue)
  }

  sum () {
    return this.iterator.reduce((a, b) => a + b)
  }
  /*
    // Operaciones de combinación
    concat(otherStream) {
      return new Stream([...this.source, ...otherStream.source]);
    }

    merge(otherStream) {
      return new Stream(this.source.concat(otherStream.source));
    }
    */

  // Operaciones de terminación
  forEach (fn) {
    this.iterator.forEach(fn)
  }

  limit (n) {
    const limited = []
    let count = 0
    for (const element of this.iterator) {
      if (count < n) {
        limited.push(element)
      } else {
        break
      }
      count++
    }
    return Stream.of(limited)
  }

  distinct () {
    const seen = new Set(this.iterator)
    return Stream.of(seen)
  }

  skip_reverse (n) {
    const skipped = []
    let count = this.iterator.length
    for (const element of this.iterator) {
      if (count >= n) {
        skipped.push(this.iterator[count])
      } else {
        break
      }
      count--
    }
    return Stream.of(skipped)
  }

  skip (n) {
    const skipped = []
    let count = 0
    for (const element of this.iterator) {
      if (count >= n) {
        skipped.push(element)
      }
      count++
    }
    return Stream.of(skipped)
  }

  sorted () {
    const elements = this.iterator
    elements.sort((a, b) => a - b)
    return Stream.of(elements)
  }

  flatMap (callback) {
    return new Stream(function * () {
      for (const element of this) {
        for (const transformedElement of callback(element)) {
          yield transformedElement
        }
      }
    })
  }

  count () {
    return this.iterator.length
  }

  allMatch (predicate) {
    let res = true
    for (const element of this.iterator) {
      if (predicate(element) === false) {
        res = false
        break
      }
    }
    return res
  }

  findFirst () {
    return this.iterator[0]
  }

  toArray () {
    return this.iterator
  }

  print () {
    console.log(this.iterator)
    console.log()
    return this.iterator
  }
}

const numbers = [1, 5, 7, 6, 8, 12, 9.0]

const stream = Stream.of(numbers).filter(x => x % 3 === 0).distinct().count()
console.log(stream)

console.log(Stream.of(numbers).sum())

const s = Stream.of(numbers).limit(3).toArray()
console.log(s)

const s1 = Stream.of(numbers).skip(3).sorted().toArray()
console.log(s1)
