# objectel

provides api to manipulate highly-abstracted object in order to resolve hierarchical problem via composition

## API

### Component

Unit of entity that resolves problem

#### Ol.Element(component, props, children, [event$])

| Arguments | Description |
|-----------|-------------|
| component | a component |
| props | an object that provides information to component, or null |
| children | value which will be settled to `props.children`, could be anything except boolean or falsy value |
| event$ | stream of event, if this slot is omitted, `props.event$`'s value will be event$. if not, this value will be settled to `props.event$` |

* returns stream of results

Examples

Simple Counter

```js
import * as Ol from 'objectel';
import Counter from './counter';// let's say we have a counter

const globalBus = Ol.createEventBus(Ol.Event('increase'));
const counter = Ol.createElement(Counter, globalBus.Listener$);
```

* returns stream of results

#### Ol.ReactiveComponent(intent$, model$, result$)

| Arguments | Description |
|-----------|-------------|
| intent$ | takes stream of events, returns stream of intents |
| model$ | takes stream of intents, returns stream of models |
| result$ | takes stream of models, returns stream of results |

* returns newly created component

#### Ol.ReactiveComponent(componentFactory)

| Arguments | Description |
|-----------|-------------|
| componentFactory | takes props as argument, result function which takes stream of event as argument and returns stream of results |

Examples

Simple Counter Component without prop binding

```js
import * as Ol from 'objectel';
import map from 'callbag-map';

const ReactiveCounter = Ol.ReactiveComponent(
  Ol.Event.ofType('increase'),
  Ol.fromIntent(prevModel => prevModel + 1, 0),
  map(model => Ol.Element('p', null, model)),
);
```

Simple Counter Component with prop binding

```js
import * as Ol from 'objectel';
import map from 'callbag-map';

const ReactiveCounterTakesProp = Ol.ReactiveComponent(({ count, startValue}) => compose(
  Ol.Event.ofType('increase'),
  Ol.fromIntent(prevModel => prevModel + count, startValue),
  map(model => Ol.Element('p', null, model)),
));
```

#### Ol.Component(propsToModel, modelToResult, [eventMap])

| Arguments | Description |
|-----------|-------------|
| propsToModel | takes props as argument and returns model |
| modelToResult | takes model as argument and returns result, this function will be called every time model is changed |
| eventMap | object that properties name are event name and value of those property is function that takes previous model and props as argument and returns new model

* returns newly created component

Examples

Simple Counter Component

```js
import * as Ol from 'objectel';

const Counter = Ol.Component(
  props => props.startValue,
  model => Ol.Element('p', null, model),
  {
    increase: (prevModel, { count }) => prevModel + count,
  },
);
```

#### Ol.Fragment

Component to wrap several component into one

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

#### Ol.fromIntent(reducer)

| Arguments | Description |
|-----------|-------------|
| reducer | takes previous model and props as argument and returns new model |

Examples

Simple Counter Component

```js
import * as Ol from 'objectel';
import map from 'callbag-map';

const ReactiveCounter = Ol.ReactiveComponent(
  Ol.Event.ofType('increase'),
  Ol.fromIntent(prevModel => prevModel + 1, 0),
  map(model => Ol.Element('p', null, model)),
);
```

#### Functional Component

function that takes props(or nothing) and returns stream of results is Functional Component

Example

Simple Timer Component

```js
import pipe from 'callbag-pipe';
import interval from 'callbag-interval';
import scan from 'callbag-map';

const Timer = ({ startTime }) => pipe(
  interval(1000),
  scan(prevTime => prevTime + 1, startTime),
);
```

### Event

#### Ol.Event(type, payload, [meta])

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

const myEvent = Ol.Event('increase', 10, { by: 'click' });
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

const globalBus = Ol.createEventBus(Ol.Event('increase'));
const counter = Ol.createElement(Counter, globalBus.Listener$);
```

#### EventBus.Listener$

stream of events of EventBus

#### EventBus.Emitter$

sink of EventBus that expected to be delivered events

#### EventBus.Emit(event$)

| Arguments | Description |
|-----------|-------------|
| event$ | stream of events |

emits each event in event$ in EventBus

#### EventBus.Listen(listener)

| Arguments | Description |
|-----------|-------------|
| listener | function that takes event as argument |

listen every emitted event in EventBus with listener

#### Event.ofType(type)

| Arguments | Description |
|-----------|-------------|
| type | type of event that will be passed by this operator |

* returns stream of given type's event

filters stream of event

### Element Specification

If you are trying to use Ol, you don't need to read this part.
this part describes interface of `Element` in Ol.

Each `Element` is pullable which takes event and produces result.
Each `Element` has property of global symbol `olElement` and it's value is `true`.
