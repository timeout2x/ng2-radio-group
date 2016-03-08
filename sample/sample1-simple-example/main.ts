import {bootstrap} from "angular2/platform/browser";
import {Component} from "angular2/core";
import {RADIO_GROUP_DIRECTIVES} from "../../src/ng2-radio-group";

@Component({
    selector: "app",
    template: `
<div class="container">
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
</div>
`,
    directives: [RADIO_GROUP_DIRECTIVES]
})
export class Sample1App {

    sortBy: string = "date";
    orderBy: string[] = ["watches", "comments"];

}

bootstrap(Sample1App);