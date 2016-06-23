import {bootstrap} from "@angular/platform-browser-dynamic";
import {Component} from "@angular/core";
import {SELECT_DIRECTIVES} from "../../src/index";
import {Car} from "./Car";
import {HTTP_PROVIDERS, Http} from "@angular/http";

@Component({
    selector: "app",
    template: `
<div class="container">

    <h4>Select Tags multiple:</h4>
    <select-tags [(ngModel)]="selectedCars1" 
                [loader]="loader"
                [persist]="true"
                labelBy="name"
                trackBy="name"></select-tags>
                
    <br/><b>model: </b>
    <pre>{{ selectedCars1 | json }}</pre>
    <!--
        <h4>Select Tags multiple with persist and custom button label</h4>
        <select-tags [(ngModel)]="selectedCars2" 
                    [loader]="loader"
                    [persist]="true"
                    addButtonLabel="add"
                    labelBy="name"
                    trackBy="name"></select-tags>
                    
        <b>model: </b>
        <pre>{{ selectedCars2 | json }}</pre>
    
        <h4>Select Tags single:</h4>
        <select-tags [(ngModel)]="selectedCar1" 
                    [loader]="loader"
                    labelBy="name"
                    trackBy="name"></select-tags>
                    
        <b>model: </b>
        <pre>{{ selectedCar1 | json }}</pre>
    
        <h4>Select Tags single with persist:</h4>
        <select-tags [(ngModel)]="selectedCar2" 
                      [loader]="loader"
                      [persist]="true"
                      labelBy="name"
                      trackBy="name"></select-tags>
                    
        <b>model: </b>
        <pre>{{ selectedCar2 | json }}</pre>
    
        <h4>Select Tags with predefined model:</h4>
        <select-tags [(ngModel)]="newSelectedCar" 
                    [loader]="loader"
                    [persist]="true"
                    labelBy="name"
                    trackBy="name"></select-tags>
                    
        <b>model: </b>
        <pre>{{ newSelectedCar | json }}</pre>
        <button (click)="resetModel()">reset model</button>
    
        <h4>Select Tags multiple disabled:</h4>
        <select-tags [(ngModel)]="selectedCars3" 
                    [loader]="loader"
                    [persist]="true"
                    [disabled]="true"
                    labelBy="name"
                    trackBy="name"></select-tags>
                    
        <b>model: </b>
        <pre>{{ selectedCars3 | json }}</pre>
    
        <h4>Select Tags explicit multiple:</h4>
        <select-tags [(ngModel)]="allSelectedCars" 
                    [loader]="loader"
                    [persist]="true"
                    [multiple]="true"
                    labelBy="name"
                    trackBy="name"></select-tags>
                    
        <b>model: </b>
        <pre>{{ allSelectedCars | json }}</pre>
    
        <h4>Select Tags with minimal number of characters to send a request:</h4>
        <select-tags [(ngModel)]="selectedCars4" 
                    [loader]="loader"
                    [minQueryLength]="1"
                    labelBy="name"
                    trackBy="name"></select-tags>
                    
        <b>model: </b>
        <pre>{{ selectedCars4 | json }}</pre>
    
        <h4>Select Tags with specific values selected:</h4>
        <select-tags [(ngModel)]="selectedCars5" 
                    [loader]="loader"
                    labelBy="name"
                    trackBy="name"
                    valueBy="name"></select-tags>
                    
        <b>model: </b>
        <pre>{{ selectedCars5 | json }}</pre>
    
        <h4>Select Tags with ordering enabled:</h4>
        <select-tags [(ngModel)]="selectedCars6" 
                    [loader]="loader"
                    labelBy="name"
                    trackBy="name"
                    orderBy="name"></select-tags>
                    
        <b>model: </b>
        <pre>{{ selectedCars6 | json }}</pre>
    
        <h4>Select Tags with descendant ordering enabled:</h4>
        <select-tags [(ngModel)]="selectedCars7" 
                    [loader]="loader"
                    labelBy="name"
                    trackBy="name"
                    orderBy="name"
                    orderDirection="desc"></select-tags>
                    
        <b>model: </b>
        <pre>{{ selectedCars7 | json }}</pre>
    
        <h4>Select Tags with limit:</h4>
        <select-tags [(ngModel)]="selectedCars8" 
                    [loader]="loader"
                    labelBy="name"
                    trackBy="name"
                    [limit]="2"></select-tags>
                    
        <b>model: </b>
        <pre>{{ selectedCars8 | json }}</pre>
    
        <h4>Select Tags with maximal allowed to selection:</h4>
        <select-tags [(ngModel)]="selectedCars9" 
                    [loader]="loader"
                    labelBy="name"
                    trackBy="name"
                    [maxModelSize]="2"></select-tags>
                    
        <b>model: </b>
        <pre>{{ selectedCars9 | json }}</pre>
    
        <h4>Select Tags with custom item constructor function:</h4>
        <select-tags [(ngModel)]="selectedCars10" 
                    [loader]="loader"
                    labelBy="name"
                    trackBy="name"
                    [persist]="true"
                    [itemConstructor]="itemConstructor"></select-tags>
                    
        <b>model: </b>
        <pre>{{ selectedCars10 | json }}</pre>-->
        
</div>
`,
    directives: [SELECT_DIRECTIVES]
})
export class Sample1App {

    cars: Car[] = [
        new Car(1, "BMW", 2000),
        new Car(2, "Mercedes", 1999),
        new Car(3, "Opel", 2008),
        new Car(4, "Porshe", 1940),
        new Car(4, "Ferrari", 2000)
    ];
    selectedCars1: Car[] = [];
    selectedCars2: Car[] = [];
    selectedCars3: Car[] = [];
    selectedCars4: Car[] = [];
    selectedCars5: string[] = [];
    selectedCars6: Car[] = [];
    selectedCars7: Car[] = [];
    selectedCars8: Car[] = [];
    selectedCars9: Car[] = [];
    selectedCars10: Car[] = [];
    selectedCar: Car;
    selectedCar2: Car;
    newSelectedCar: Car = new Car(1, "BMW", 2000);
    
    loader = (term: string) => {
        return this.http
            .get("http://localhost:4000/tags/search?query=" + term)
            .map(res => res.json());
    };

    itemConstructor = (term: string) => {
        return new Car(0, term, 2016);
    };

    constructor(private http: Http) {
    }

    resetModel() {
        this.newSelectedCar = new Car(1, "BMW", 2000);
    }

}

bootstrap(Sample1App, [
    HTTP_PROVIDERS
]);