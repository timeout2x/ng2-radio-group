import {bootstrap} from "@angular/platform-browser-dynamic";
import {Component} from "@angular/core";
import {SELECT_DIRECTIVES} from "../../src/index";
import {Car} from "./Car";
import {HTTP_PROVIDERS, Http} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {disableDeprecatedForms, provideForms} from "@angular/forms";

@Component({
    selector: "app",
    template: `
<div class="container">
    
        <h4>Autocomplete multiple:</h4>
        <autocomplete [(ngModel)]="selectedCars1" 
                    [loader]="loader"
                    labelBy="name"
                    trackBy="name"></autocomplete>

        <h4>Selected items:</h4>
        <select-items
                  [hideControls]="true"
                  [removeButton]="true"
                  [items]="selectedCars1"
                  labelBy="name"
                  trackBy="name"
                  [readonly]="true"></select-items>
                    
        <br/><b>model: </b>
        <pre>{{ selectedCars1 | json }}</pre>
    
        <h4>Autocomplete multiple with persist and custom button label</h4>
        <autocomplete [(ngModel)]="selectedCars2" 
                    [loader]="loader"
                    [persist]="true"
                    addButtonLabel="add"
                    labelBy="name"
                    trackBy="name"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ selectedCars2 | json }}</pre>
    
        <h4>Autocomplete single:</h4>
        <autocomplete [(ngModel)]="selectedCar1" 
                    [loader]="loader"
                    labelBy="name"
                    trackBy="name"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ selectedCar1 | json }}</pre>
    
        <h4>Autocomplete single with persist:</h4>
        <autocomplete [(ngModel)]="selectedCar2" 
                      [loader]="loader"
                      [persist]="true"
                      labelBy="name"
                      trackBy="name"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ selectedCar2 | json }}</pre>
    
        <h4>Autocomplete with predefined model:</h4>
        <autocomplete [(ngModel)]="newSelectedCar" 
                    [loader]="loader"
                    [persist]="true"
                    labelBy="name"
                    trackBy="name"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ newSelectedCar | json }}</pre>
        <button (click)="resetModel()">reset model</button>
    
        <h4>Autocomplete multiple disabled:</h4>
        <autocomplete [(ngModel)]="selectedCars3" 
                    [loader]="loader"
                    [persist]="true"
                    [disabled]="true"
                    labelBy="name"
                    trackBy="name"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ selectedCars3 | json }}</pre>
    
        <h4>Autocomplete explicit multiple:</h4>
        <autocomplete [(ngModel)]="allSelectedCars" 
                    [loader]="loader"
                    [persist]="true"
                    [multiple]="true"
                    labelBy="name"
                    trackBy="name"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ allSelectedCars | json }}</pre>
    
        <h4>Autocomplete with minimal number of characters to send a request:</h4>
        <autocomplete [(ngModel)]="selectedCars4" 
                    [loader]="loader"
                    [minQueryLength]="1"
                    labelBy="name"
                    trackBy="name"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ selectedCars4 | json }}</pre>
    
        <h4>Autocomplete with specific values selected:</h4>
        <autocomplete [(ngModel)]="selectedCars5" 
                    [loader]="loader"
                    labelBy="name"
                    trackBy="name"
                    valueBy="name"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ selectedCars5 | json }}</pre>
    
        <h4>Autocomplete with ordering enabled:</h4>
        <autocomplete [(ngModel)]="selectedCars6" 
                    [loader]="loader"
                    labelBy="name"
                    trackBy="name"
                    orderBy="name"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ selectedCars6 | json }}</pre>
    
        <h4>Autocomplete with descendant ordering enabled:</h4>
        <autocomplete [(ngModel)]="selectedCars7" 
                    [loader]="loader"
                    labelBy="name"
                    trackBy="name"
                    orderBy="name"
                    orderDirection="desc"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ selectedCars7 | json }}</pre>
    
        <h4>Autocomplete with limit:</h4>
        <autocomplete [(ngModel)]="selectedCars8" 
                    [loader]="loader"
                    labelBy="name"
                    trackBy="name"
                    [limit]="2"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ selectedCars8 | json }}</pre>
    
        <h4>Autocomplete with maximal allowed to selection:</h4>
        <autocomplete [(ngModel)]="selectedCars9" 
                    [loader]="loader"
                    labelBy="name"
                    trackBy="name"
                    [maxModelSize]="2"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ selectedCars9 | json }}</pre>
    
        <h4>Autocomplete with custom item constructor function:</h4>
        <autocomplete [(ngModel)]="selectedCars10" 
                    [loader]="loader"
                    labelBy="name"
                    trackBy="name"
                    [persist]="true"
                    [itemConstructor]="itemConstructor"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ selectedCars10 | json }}</pre>
    
        <h4>Autocomplete with custom template:</h4>
        <autocomplete #autocomplete
                    [(ngModel)]="selectedCars11" 
                    [loader]="loader"
                    labelBy="name"
                    trackBy="name"
                    [persist]="true"
                    [itemConstructor]="itemConstructor">
             <autocomplete-dropdown-template>
                <span *ngFor="let item of autocomplete.dropdownItems">
                   <span *itemTemplate="item">
                        {{ item.name }} <i><small>({{ item.owner.login }})</small></i>
                    </span>
                </span>
             </autocomplete-dropdown-template>
        </autocomplete>
                    
        <b>model: </b>
        <pre>{{ selectedCars11 | json }}</pre>
        
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
    selectedCars11: Car[] = [];
    selectedCar: Car;
    selectedCar2: Car;
    newSelectedCar: Car = new Car(1, "BMW", 2000);
    
    loader = (term: string) => {
        return this.http
            .get("https://api.github.com/search/repositories?q=" + term)
            .map(res => res.json().items) as Observable<any>;
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
    HTTP_PROVIDERS,
    disableDeprecatedForms(),
    provideForms(),
]);