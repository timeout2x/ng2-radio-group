import {bootstrap} from "@angular/platform-browser-dynamic";
import {Component} from "@angular/core";
import {RADIO_GROUP_DIRECTIVES} from "../../src/index";
import {Car} from "../sample1-simple-example/Car";

@Component({
    selector: "app",
    template: `
<div class="container">

    <h4>Simple select items: </h4>
    <select-items [(ngModel)]="selectedCars"
                  [items]="cars"
                  labelBy="name">
    </select-items>
    
    <h4>model: </h4>
    <pre>{{ selectedCars | json }}</pre>

    <h4>Select list with search</h4>
    <select-items [(ngModel)]="selectedCars"
                  [items]="cars"
                  labelBy="name"
                  searchBy="name"
                  searchLabel="search...">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCars | json }}</pre>

    <h4>Select list with ordering</h4>
    <select-items [(ngModel)]="selectedCars"
                  [items]="cars"
                  labelBy="name"
                  orderBy="name">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCars | json }}</pre>

    <h4>Select list with descendant ordering</h4>
    <select-items [(ngModel)]="selectedCars"
                  [items]="cars"
                  labelBy="name"
                  orderBy="name"
                  orderDirection="desc">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCars | json }}</pre>
    
    
    <h4>Select items with select all option</h4>
    <select-items [(ngModel)]="selectedCars"
                  [items]="cars"
                  labelBy="name"
                  selectAllLabel="select all">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCars | json }}</pre>
    
    <h4>Select items with limited number of shown items:</h4>
    <select-items [(ngModel)]="selectedCars"
                  [items]="cars"
                  [limit]="4"
                  labelBy="name">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCars | json }}</pre>
    
    <h4>Select items with limited number of shown items, with more button:</h4>
    <select-items [(ngModel)]="selectedCars"
                  [items]="cars"
                  [limit]="4"
                  labelBy="name"
                  moreLabel="more">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCars | json }}</pre>
    
    <h4>Select items with limited number of shown items, with more & hide button:</h4>
    <select-items [(ngModel)]="selectedCars"
                  [items]="cars"
                  [limit]="4"
                  labelBy="name"
                  moreLabel="more"
                  hideLabel="hide">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCars | json }}</pre>
    
    <h4>Select items where items can be removed:</h4>
    <select-items [(ngModel)]="selectedCars"
                  [items]="cars"
                  labelBy="name"
                  [removeButton]="true">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCars | json }}</pre>
    
    <h4>Select items where with no controls:</h4>
    <select-items [(ngModel)]="selectedCars"
                  [items]="cars"
                  labelBy="name"
                  [hideControls]="true">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCars | json }}</pre>
    
    <h4>Select items where where selected items are not showing after they are selected:</h4>
    <select-items [(ngModel)]="selectedCars"
                  [items]="cars"
                  labelBy="name"
                  [hideSelected]="true">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCars | json }}</pre>
    
    <h4>Select items with maximal number of allowed selected items:</h4>
    <select-items [(ngModel)]="selectedCars"
                  [items]="cars"
                  labelBy="name"
                  [maxModelSize]="3">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCars | json }}</pre>
    
    <h4>Select items with minimal number of allowed selected items:</h4>
    <select-items [(ngModel)]="selectedCars"
                  [items]="cars"
                  labelBy="name"
                  [minModelSize]="3">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCars | json }}</pre>
    
    <h4>Select items with track by, to track by another model:</h4>
    <select-items [(ngModel)]="secondSelectedCars"
                  [items]="cars"
                  labelBy="name"
                  trackBy="name">
    </select-items>
    <h4>model: </h4>
    <pre>{{ secondSelectedCars | json }}</pre>
    
    <h4>Select items with value by, to get more specific values:</h4>
    <select-items [(ngModel)]="selectedCarNames"
                  [items]="cars"
                  labelBy="name"
                  valueBy="name">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCarNames | json }}</pre>
    
    <h4>All-in-one select items:</h4>
    <select-items [(ngModel)]="selectedCars"
                  [items]="cars"
                  [removeButton]="true"
                  [hideControls]="false"
                  [hideSelected]="false"
                  [limit]="4"
                  [maxModelSize]="0"
                  [minModelSize]="0"
                  labelBy="name"
                  searchBy="name"
                  orderBy="name"
                  orderDirection="desc"
                  moreLabel="more"
                  hideLabel="hide"
                  selectAllLabel="select all">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCars | json }}</pre>
    
    <!-- SAME WITH RADIO -->
    
    <hr>
    Single item:
    <hr>
    
    <h4>Simple select items: </h4>
    <select-items [(ngModel)]="selectedCar"
                  [items]="cars"
                  labelBy="name">
    </select-items>
    
    <h4>model: </h4>
    <pre>{{ selectedCar | json }}</pre>

    <h4>Select list with search</h4>
    <select-items [(ngModel)]="selectedCar"
                  [items]="cars"
                  labelBy="name"
                  searchBy="name"
                  searchLabel="search...">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCar | json }}</pre>

    <h4>Select list with ordering</h4>
    <select-items [(ngModel)]="selectedCar"
                  [items]="cars"
                  labelBy="name"
                  orderBy="name">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCar | json }}</pre>

    <h4>Select list with descendant ordering</h4>
    <select-items [(ngModel)]="selectedCar"
                  [items]="cars"
                  labelBy="name"
                  orderBy="name"
                  orderDirection="desc">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCar | json }}</pre>
    
    
    <h4>Select items with nothing is selected</h4>
    <select-items [(ngModel)]="selectedCar"
                  [items]="cars"
                  labelBy="name"
                  noSelectionLabel="nothing is selected">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCar | json }}</pre>
    
    <h4>Select items with limited number of shown items:</h4>
    <select-items [(ngModel)]="selectedCar"
                  [items]="cars"
                  [limit]="4"
                  labelBy="name">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCar | json }}</pre>
    
    <h4>Select items with limited number of shown items, with more button:</h4>
    <select-items [(ngModel)]="selectedCar"
                  [items]="cars"
                  [limit]="4"
                  labelBy="name"
                  moreLabel="more">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCar | json }}</pre>
    
    <h4>Select items with limited number of shown items, with more & hide button:</h4>
    <select-items [(ngModel)]="selectedCar"
                  [items]="cars"
                  [limit]="4"
                  labelBy="name"
                  moreLabel="more"
                  hideLabel="hide">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCar | json }}</pre>
    
    <h4>Select items where items can be removed:</h4>
    <select-items [(ngModel)]="selectedCar"
                  [items]="cars"
                  labelBy="name"
                  [removeButton]="true">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCar | json }}</pre>
    
    <h4>Select items where with no controls:</h4>
    <select-items [(ngModel)]="selectedCar"
                  [items]="cars"
                  labelBy="name"
                  [hideControls]="true">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCar | json }}</pre>
    
    <h4>Select items where where selected items are not showing after they are selected:</h4>
    <select-items [(ngModel)]="selectedCar"
                  [items]="cars"
                  labelBy="name"
                  [hideSelected]="true">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCar | json }}</pre>
    
    <h4>Select items with maximal number of allowed selected items:</h4>
    <select-items [(ngModel)]="selectedCar"
                  [items]="cars"
                  labelBy="name"
                  [maxModelSize]="3">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCar | json }}</pre>
    
    <h4>Select items with minimal number of allowed selected items:</h4>
    <select-items [(ngModel)]="selectedCar"
                  [items]="cars"
                  labelBy="name"
                  [minModelSize]="3">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCar | json }}</pre>
    
    <h4>Select items with track by, to track by another model:</h4>
    <select-items [(ngModel)]="secondSelectedCar"
                  [items]="cars"
                  labelBy="name"
                  trackBy="name">
    </select-items>
    <h4>model: </h4>
    <pre>{{ secondSelectedCar | json }}</pre>
    
    <h4>Select items with value by, to get more specific values:</h4>
    <select-items [(ngModel)]="selectedCarName"
                  [items]="cars"
                  labelBy="name"
                  valueBy="name">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCarName | json }}</pre>
    
    <h4>All-in-one select items:</h4>
    <select-items [(ngModel)]="selectedCar"
                  [items]="cars"
                  [removeButton]="true"
                  [hideControls]="false"
                  [hideSelected]="false"
                  [limit]="4"
                  [maxModelSize]="0"
                  [minModelSize]="0"
                  labelBy="name"
                  searchBy="name"
                  orderBy="name"
                  orderDirection="desc"
                  moreLabel="more"
                  hideLabel="hide"
                  selectAllLabel="select all">
    </select-items>
    <h4>model: </h4>
    <pre>{{ selectedCar | json }}</pre>
    
    
</div>
`,
    directives: [RADIO_GROUP_DIRECTIVES]
})
export class Sample1App {

    cars: Car[] = [
        new Car(1, "BMW", 2000),
        new Car(2, "Mercedes", 1999),
        new Car(3, "Opel", 2008),
        new Car(4, "Porshe", 1940),
        new Car(4, "Ferrari", 2000)
    ];

    selectedCars: Car[] = [];
    secondSelectedCars: Car[] = [
        new Car(2, "Mercedes", 1999)
    ];
    selectedCarNames: string[] = [];

    selectedCar: Car;
    secondSelectedCar: Car = new Car(2, "Mercedes", 1999);
    selectedCarName: string;

    constructor() {
    }

}

bootstrap(Sample1App);