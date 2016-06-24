import {bootstrap} from "@angular/platform-browser-dynamic";
import {Component} from "@angular/core";
import {SELECT_DIRECTIVES} from "../../src/index";
import {Car} from "./Car";
import {HTTP_PROVIDERS, Http} from "@angular/http";

@Component({
    selector: "app",
    template: `
<div class="container">

    <h4>Select Tags with static list:</h4>
    <select-tags [(ngModel)]="selectedCars0" 
                [items]="cars"
                labelBy="name"
                placeholder="add cars..."></select-tags>
                
    <br/><b>model: </b>
    <pre>{{ selectedCars0 | json }}</pre>

    <h4>Select Tags without persistence:</h4>
    <select-tags [(ngModel)]="selectedCars1" 
                [loader]="loader"
                labelBy="name"
                placeholder="add cars..."></select-tags>
                
    <br/><b>model: </b>
    <pre>{{ selectedCars1 | json }}</pre>

    <h4>Select Tags with persistence:</h4>
    <select-tags [(ngModel)]="selectedCars2" 
                [loader]="loader"
                [persist]="true"
                labelBy="name"
                trackBy="name"
                placeholder="add cars..."></select-tags>
                
    <br/><b>model: </b>
    <pre>{{ selectedCars2 | json }}</pre>

    <h4>Select Tags with pre-defined model:</h4>
    <select-tags [(ngModel)]="selectedCars3" 
                [loader]="loader"
                [persist]="true"
                labelBy="name"></select-tags>
                
    <br/><b>model: </b>
    <pre>{{ selectedCars3 | json }}</pre>

    <h4>Select Tags with track by:</h4>
    <select-tags [(ngModel)]="selectedCars4" 
                [loader]="loader"
                [persist]="true"
                labelBy="name"
                trackBy="name"></select-tags>
                
    <br/><b>model: </b>
    <pre>{{ selectedCars4 | json }}</pre>

    <h4>Select Tags disabled:</h4>
    <select-tags [(ngModel)]="selectedCars4" 
                [loader]="loader"
                [disabled]="true"
                labelBy="name"
                trackBy="name"></select-tags>
                
    <br/><b>model: </b>
    <pre>{{ selectedCars4 | json }}</pre>
    
    <h4>Select Tags with specific values selected:</h4>
    <select-tags [(ngModel)]="selectedCars5" 
                [loader]="loader"
                labelBy="name"
                valueBy="name"></select-tags>
                
    <b>model: </b>
    <pre>{{ selectedCars5 | json }}</pre>
    
    <h4>Select Tags with minimal number of characters to send a request:</h4>
    <select-tags [(ngModel)]="selectedCars6" 
                [loader]="loader"
                [minQueryLength]="1"
                labelBy="name"
                trackBy="name"></select-tags>
                
    <b>model: </b>
    <pre>{{ selectedCars6 | json }}</pre>
    
    <h4>Select Tags with ordering enabled:</h4>
    <select-tags [(ngModel)]="selectedCars7" 
                [loader]="loader"
                labelBy="name"
                trackBy="name"
                orderBy="name"></select-tags>
                
    <b>model: </b>
    <pre>{{ selectedCars7 | json }}</pre>

    <h4>Select Tags with descendant ordering enabled:</h4>
    <select-tags [(ngModel)]="selectedCars8" 
                [loader]="loader"
                labelBy="name"
                trackBy="name"
                orderBy="name"
                orderDirection="desc"></select-tags>
                
    <b>model: </b>
    <pre>{{ selectedCars8 | json }}</pre>

    <h4>Select Tags with limit:</h4>
    <select-tags [(ngModel)]="selectedCars9" 
                [loader]="loader"
                labelBy="name"
                trackBy="name"
                [limit]="2"></select-tags>
                
    <b>model: </b>
    <pre>{{ selectedCars9 | json }}</pre>

    <h4>Select Tags with maximal allowed to selection:</h4>
    <select-tags [(ngModel)]="selectedCars10" 
                [loader]="loader"
                labelBy="name"
                trackBy="name"
                [maxModelSize]="2"></select-tags>
                
    <b>model: </b>
    <pre>{{ selectedCars10 | json }}</pre>

    <h4>Select Tags with custom item constructor function:</h4>
    <select-tags [(ngModel)]="selectedCars11" 
                [loader]="loader"
                labelBy="name"
                trackBy="name"
                [persist]="true"
                [itemConstructor]="itemConstructor"></select-tags>
                
    <b>model: </b>
    <pre>{{ selectedCars11 | json }}</pre>

    <h4>Select Tags with customized add button:</h4>
    <select-tags [(ngModel)]="selectedCars12"
                [persist]="true"
                [loader]="loader"
                labelBy="name"
                placeholder="add cars..."
                addButtonLabel="+"
                addButtonSecondaryLabel="(or press ENTER now!)"></select-tags>
                
    <br/><b>model: </b>
    <pre>{{ selectedCars12 | json }}</pre>
        
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
    selectedCars0: Car[] = [];
    selectedCars1: Car[] = [];
    selectedCars2: Car[] = [];
    selectedCars3: Car[] = [
        this.cars[0]
    ];
    selectedCars4: Car[] = [
        new Car(1, "BMW", 2000),
    ];
    selectedCars5: string[] = [];
    selectedCars6: Car[] = [];
    selectedCars7: Car[] = [];
    selectedCars8: Car[] = [];
    selectedCars9: Car[] = [];
    selectedCars10: Car[] = [];
    selectedCars11: Car[] = [];
    selectedCars12: Car[] = [];

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

}

bootstrap(Sample1App, [
    HTTP_PROVIDERS
]);