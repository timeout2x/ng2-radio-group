import {bootstrap} from "@angular/platform-browser-dynamic";
import {Component} from "@angular/core";
import {RADIO_GROUP_DIRECTIVES} from "../../src/index";

@Component({
    selector: "app",
    template: `
<div class="container">

    <h4>Is something enabled: (non-multiple checkbox)</h4>
    <input check-box [(model)]="isSomethingEnabled" [value]="true" [uncheckedValue]="false"> enabled?<br/>
    <i>isSomethingEnabled value:</i> <b>{{ isSomethingEnabled }}</b><br/><br/>

    <h4>Order by: (multiple check boxes)</h4>
    <input check-box [(model)]="orderBy" value="rating"> Rating<br/>
    <input check-box [(model)]="orderBy" value="date"> Date<br/>
    <input check-box [(model)]="orderBy" value="watches"> Watch count<br/>
    <input check-box [(model)]="orderBy" value="comments"> Comment count<br/>
    
    <i>selected items:</i> <b><span *ngFor="let order of orderBy">{{ order }} </span></b><br/><br/>

    <h4>Sort by: (simple radio boxes)</h4>
    <input radio-box [(model)]="sortWithoutGroup" value="rating"> Rating<br/>
    <input radio-box [(model)]="sortWithoutGroup" value="date"> Date<br/>
    <input radio-box [(model)]="sortWithoutGroup" value="watches"> Watch count<br/>
    <input radio-box [(model)]="sortWithoutGroup" value="comments"> Comment count<br/>
    
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
    
    
    <h4>Sort by: (check boxes in group, less flexible, but simpler and the whole component is clickable)</h4>
    <radio-group [(model)]="sortBy">
        <radio-item value="rating">Rating</radio-item>
        <radio-item value="date">Date</radio-item>
        <radio-item value="watches">Watch count</radio-item>
        <radio-item value="comments">Comment count</radio-item>
    </radio-group>
    
    <i>selected item:</i> <b>{{ sortBy }}</b><br/><br/>


    <h4>Order by: (radio boxes in group, less flexible, but simpler and the whole component is clickable)</h4>
    <checkbox-group [(model)]="orderBy">
        <checkbox-item value="rating">Rating</checkbox-item>
        <checkbox-item value="date">Date</checkbox-item>
        <checkbox-item value="watches">Watch count</checkbox-item>
        <checkbox-item value="comments">Comment count</checkbox-item>
    </checkbox-group>
    
    <i>selected items:</i> <b><span *ngFor="let order of orderBy">{{ order }} </span></b><br/><br/>
    
    
</div>
`,
    directives: [RADIO_GROUP_DIRECTIVES]
})
export class Sample1App {

    isSomethingEnabled: boolean = false;
    sortBy: string = "date";
    orderBy: string[] = ["rating", "comments"];

}

bootstrap(Sample1App);