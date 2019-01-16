# objectel

![LICENSE](https://img.shields.io/npm/l/objectel.svg)
![DOWNLOADS](https://img.shields.io/npm/dt/objectel.svg)
![GITHUB-STARS](https://img.shields.io/github/stars/ENvironmentSet/objectel.svg)
![LAST-COMMIT](https://img.shields.io/github/last-commit/ENvironmentSet/objectel.svg)

objectel is library which provides highly-abstracted object in order to resolve hierarchical problem via composition

objectel uses few un-popular mindset which is called [callbag](https://github.com/callbag/callbag)
I just told you "callbag is unpopular mindset". but don't think callbag badly, it is awesome standard.
if you overcome some complexity of callbag, then you may find yourself in 'callbag heaven'.

here is some good articles about callbag, if you doesn't friendly with callbag, you will do better to read these articles.

[callbag standard](https://github.com/callbag/callbag)  
[why we need callbag?](https://staltz.com/why-we-need-callbags.html)  
[callbag introduction](http://blog.krawaller.se/posts/callbags-introduction/)  

this article does not related to callbag, but I believe this is one of best article in reactive programming's history
[introduction to reactive programming](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)

Anyway, If you can read korean, I have my blog post for you.

[objectel: Event-Driven Reactive Programming Library](https://environmentset.github.io/2019/01/17/objectel-Event-Driven-Reactive-Programming-Library/)

## API

### Component

**Component is the unit of problem.**

every complex problem could be split into several less-complex problem(also known as divide and conquer).
objectel suggest to use component at dividing problem.

anyway, in viewpoint of library, every component is a function that takes `props` and returns a function which takes stream(callbag) of event and returns listenable callbag of result(also known as **element**).

also, instant of component is called **element**
#### Ol.createElement(type, props, children)

| Arguments | Description |
|-----------|-------------|
| type | a string |
| props | a object or `null` |
| children | any value, will be settled to `props.children`. |

* returns listenable that emit `{ type, props: {...props, children} }` once.

Example

Creating a simple element

```js
import * as Ol from 'objectel';
import forEach from 'callbag-for-each';

forEach(console.log)(Ol.createElement('a', { herf: 'somewhere' }, 'go!'))
// logs { type: 'a', { herf: 'somewhere', children: 'go!' } }
```

#### Ol.createElement(component, props, ...children)

| Arguments | Description |
|-----------|-------------|
| component | a component |
| props | a object or `null`, will be applied to component when `createElement` creates instance of component. |
| children | any value, will be settled to `props.children`. |

* returns a function which takes stream of event and returns stream of results

`createElement` is function that creates element of given component.

if `children` is one-length array, it will be unwrapped and settled to `props.children`

Examples

Simple Counter

```js
import * as Ol from 'objectel';
import interval from 'callbag-interval';
import pipe from 'callbag-pipe';
import forEach from 'callbag-for-each';

const Timer = ({ startTime }) => _ => pipe(
  interval(1000),
  Ol.operators.reduce(leftTime => leftTime - 1, startTime)
);
const timer = Ol.createElement(Timer, { startTime: 10 });
forEach(console.log)(timer); // logs 10 9 8 7 ...
```

#### Ol.reactiveComponent(intent$, model$, result$)

| Arguments | Description |
|-----------|-------------|
| intent$ | takes stream of events, returns stream of intents |
| model$ | takes stream of intents, returns stream of models |
| result$ | takes stream of models, returns stream of results |

* returns newly created component

`reactiveComponent` creates a component by combining given streams.

Examples

Simple Counter Component without prop binding

```js
import * as Ol from 'objectel';
import map from 'callbag-map';

const Counter = Ol.reactiveComponent(
  Ol.operators.ofType('increase'),
  Ol.operators.reduce(prevModel => prevModel + 1, 0),
  map(model => Ol.createElement('text', null, model)),
);
```

#### Ol.component(propsToModel, modelToResult, [eventMap])

| Arguments | Description |
|-----------|-------------|
| propsToModel | takes props as argument and returns model |
| modelToResult | takes model as argument and returns result, this function will be called every time model is changed |
| eventMap | object that it's property's name are event name and value of it is a function that takes payload of event, props, previous model as argument and returns new model

* returns newly created component

Examples

Simple Counter Component

```js
import * as Ol from 'objectel';

const Counter = Ol.component(
  props => props.startValue,
  model => Ol.createElement('text', null, model),
  {
    increase: (payload, props, prevModel) => prevModel + props.count * payload,
  },
);
```

#### Ol.Fragment

fragment is a component that merges it's children's result stream into one.
usually used to compose several component into one.

Examples

Wrap two component into one

```js
import * as Ol from 'objectel';
import Timer from './timer'; // let's say this is timer
import Todo from './todo'; // let's say this is todo app

const App = Ol.createElement(
  Ol.Fragment,
  null,
  [
    Ol.createElement(Timer, null),
    Ol.createElement(Todo, { todoItems: ['Sleeping', 'Coding'] }),
  ]
);
```

#### Ol.operators.reduce(reducer, [preloadedModel])

| Arguments | Description |
|-----------|-------------|
| reducer | takes previous model and a event as argument and returns new model |
| preloadedModel | model which will be used to initialize result stream. |

Examples

Simple Counter Component

```js
import * as Ol from 'objectel';
import map from 'callbag-map';

const Counter = Ol.reactiveComponent(
  Ol.operators.ofType('increase'),
  Ol.operators.reduce(prevModel => prevModel + 1, 0),
  map(model => Ol.createElement('text', null, model)),
);
```

#### Functional Component

function that takes props(or nothing) and returns element

Example

Simple Timer Component

```js
import * as Ol from 'objectel';
import interval from 'callbag-interval';
import pipe from 'callbag-pipe';
import forEach from 'callbag-for-each';

const Timer = ({ startTime }) => _ => pipe(
  interval(1000),
  Ol.operators.reduce(leftTime => leftTime - 1, startTime)
);
const timer = Ol.createElement(Timer, { startTime: 10 });
forEach(console.log)(timer); // logs 10 9 8 7 ...
```

### Event

#### Ol.createEvent(type, payload, [meta])

| Arguments | Description |
|-----------|-------------|
| type | type of Event, string or symbol value |
| payload | payload of event |
| meta | values that does not related with payload, usually be used by HOC | 

* returns `Event` object

Example

Simple Event

```js
import * as Ol from 'objectel';

const myEvent = Ol.createEvent('increase', 10, { by: 'click' });
// { type: 'increase', payload: 10, meta: { by: 'click' } };
```

#### Ol.createEventBus(...initEvents)

| Arguments | Description |
|-----------|-------------|
| initEvents | initial events, which will be emitted immediately |

* returns `EventBus`

Examples

Simple Counter

```js
import * as Ol from 'objectel';
import Counter from './counter';// let's say we have a counter

const globalBus = Ol.createEventBus(Ol.createEvent('increase'));
const counter = Ol.createElement(Counter)(globalBus.Listen$);
```

#### EventBus.Listen$

stream of events of EventBus

#### EventBus.Emit$

sink of EventBus that expected to be delivered events

#### Ol.operators.ofType(type)

| Arguments | Description |
|-----------|-------------|
| type | type of event that will be passed by this operator |

* returns stream of given type's event

filters stream of event

### Element Specification

If you are trying to use Ol, you don't need to read this part.
this part describes interface of `Element` in Ol.

Each `Element` is a function which takes stream of event and returns listenable which produces result.
