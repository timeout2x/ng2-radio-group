# ng2-radio-group

Checkbox group and radio group control for your angular2 applications using bootstrap3.
Does not depend of jquery.

## Installation

1. Install npm module:

`npm install ng2-radio-group --save`

2. If you are using system.js you may want to add this into `map` and `package` config:

```json
{
    "map": {
        "ng2-radio-group": "node_modules/ng2-radio-group"
    },
    "packages": {
        "ng2-radio-group": { "main": "index.js", "defaultExtension": "js" }
    }
}
```

## Usage

If you need a simple checkbox for your variable:

```html
<input check-box [(model)]="rememberMe" [value]="true" [uncheckedValue]="false"> remember me?<br/>
```

* `model` is a model you are trying to change (rememberMe is a boolean variable in your component)
* `value` is a value that should be written to the model when checkbox is checked
* `uncheckedValue` is a value that should be written to the model when checkbox is unchecked.
Optional, by default this value in equal to *null*

If your model is an array and you want to push multiple items into it, you can use it with this component:

```html
<input check-box [(model)]="orderBy" value="rating"> Rating<br/>
<input check-box [(model)]="orderBy" value="date"> Date<br/>
<input check-box [(model)]="orderBy" value="watches"> Watch count<br/>
<input check-box [(model)]="orderBy" value="comments"> Comment count<br/>
```

Don't forget to initialize your `orderBy` array.


If you need to select only one item from the multiple options, you need a radio boxes:

```html
<input radio-box [(model)]="sortBy" value="rating"> Rating<br/>
<input radio-box [(model)]="sortBy" value="date"> Date<br/>
<input radio-box [(model)]="sortBy" value="watches"> Watch count<br/>
<input radio-box [(model)]="sortBy" value="comments"> Comment count<br/>
```

To simplify this selection you can use checkbox and radio groups:

```html
<radio-group [(model)]="sortBy">
    <input radio-box value="rating"> Rating<br/>
    <input radio-box value="date"> Date<br/>
    <input radio-box value="watches"> Watch count<br/>
    <input radio-box value="comments"> Comment count<br/>
</radio-group>

<checkbox-group [(model)]="orderBy">
    <input check-box value="rating"> Rating<br/>
    <input check-box value="date"> Date<br/>
    <input check-box value="watches"> Watch count<br/>
    <input check-box value="comments"> Comment count<br/>
</checkbox-group>
```

## Sample

Complete example of usage:

```typescript
import {Component} from "@angular/core";
import {RADIO_GROUP_DIRECTIVES} from "ng2-radio-group";

@Component({
    selector: "app",
    template: `

    <h4>Is something enabled: (non-multiple checkbox)</h4>
    <input check-box [(model)]="rememberMe" [value]="true" [uncheckedValue]="false"> remember me?<br/>
    <i>rememberMe value:</i> <b>{{ rememberMe }}</b><br/><br/>

    <h4>Order by: (multiple check boxes)</h4>
    <input check-box [(model)]="orderBy" value="rating"> Rating<br/>
    <input check-box [(model)]="orderBy" value="date"> Date<br/>
    <input check-box [(model)]="orderBy" value="watches"> Watch count<br/>
    <input check-box [(model)]="orderBy" value="comments"> Comment count<br/>

    <i>selected items:</i> <b><span *ngFor="let order of orderBy">{{ order }} </span></b><br/><br/>

    <h4>Sort by: (simple radio boxes)</h4>
    <input radio-box [(model)]="sortBy" value="rating"> Rating<br/>
    <input radio-box [(model)]="sortBy" value="date"> Date<br/>
    <input radio-box [(model)]="sortBy" value="watches"> Watch count<br/>
    <input radio-box [(model)]="sortBy" value="comments"> Comment count<br/>

    <i>selected item:</i> <b>{{ sortWithoutGroup }}</b><br/><br/>


    <h4>Sort by: (radio boxes wrapped in the group)</h4>
    <radio-group [(model)]="sortBy">
        <input radio-box value="rating"> Rating<br/>
        <input radio-box value="date"> Date<br/>
        <input radio-box value="watches"> Watch count<br/>
        <input radio-box value="comments"> Comment count<br/>
    </radio-group>

    <i>selected item:</i> <b>{{ sortBy }}</b><br/><br/>


    <h4>Order by: (radio boxes wrapped in the group)</h4>
    <checkbox-group [(model)]="orderBy">
        <input check-box value="rating"> Rating<br/>
        <input check-box value="date"> Date<br/>
        <input check-box value="watches"> Watch count<br/>
        <input check-box value="comments"> Comment count<br/>
    </checkbox-group>

    <i>selected items:</i> <b><span *ngFor="let order of orderBy">{{ order }} </span></b><br/><br/>
    `,
    directives: [RADIO_GROUP_DIRECTIVES]
})
export class App {

    rememberMe: boolean = false;
    sortBy: string = "date";
    orderBy: string[] = ["rating", "comments"];

}
```

Take a look on samples in [./sample](https://github.com/pleerock/ng2-radio-group/tree/master/sample) for more examples of
usages.
