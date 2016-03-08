# ng2-radio-group

Checkbox group and radio group control for your angular2 applications using bootstrap3.
Does not depend of jquery.

## Installation

`npm install ng2-radio-group --save`

## Usage

There are two components.

First is a checkboxes group that allows you to select multiple options for a single model.

```html
<checkbox-group [(model)]="orderBy">
    <checkbox-item value="rating">Rating</checkbox-item>
    <checkbox-item value="date">Date</checkbox-item>
    <checkbox-item value="watches">Watch count</checkbox-item>
    <checkbox-item value="comments">Comment count</checkbox-item>
</checkbox-group>
```

Second is a radio inputs group that allows you to select single option for a single model.

```html
<radio-group [(model)]="sortBy">
    <radio-item value="rating">Rating</radio-item>
    <radio-item value="date">Date</radio-item>
    <radio-item value="watches">Watch count</radio-item>
    <radio-item value="comments">Comment count</radio-item>
</radio-group>
```

## Sample

Complete example of usage:

```typescript
import {Component} from "angular2/core";
import {RADIO_GROUP_DIRECTIVES} from "ng2-radio-group/ng2-radio-group";

@Component({
    selector: "app",
    template: `
    <b>Sort by:</b>
    <radio-group [(model)]="sortBy">
        <radio-item value="rating">Rating</radio-item>
        <radio-item value="date">Date</radio-item>
        <radio-item value="watches">Watch count</radio-item>
        <radio-item value="comments">Comment count</radio-item>
    </radio-group>

    <b>Order by:</b>
    <checkbox-group [(model)]="orderBy">
        <checkbox-item value="rating">Rating</checkbox-item>
        <checkbox-item value="date">Date</checkbox-item>
        <checkbox-item value="watches">Watch count</checkbox-item>
        <checkbox-item value="comments">Comment count</checkbox-item>
    </checkbox-group>

    <br/>
    Selected sorting types: {{ sortBy }}<br/>
    Selected order types: <span *ngFor="#order of orderBy">{{ order }} </span><br/>
    `,
    directives: [RADIO_GROUP_DIRECTIVES]
})
export class App {

    sortBy: string = "date";
    orderBy: string[] = ["watches", "comments"];

}
```

Take a look on samples in [./sample](https://github.com/pleerock/ng2-radio-group/tree/master/sample) for more examples of
usages.
