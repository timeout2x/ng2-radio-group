import "rxjs/Rx";
import {bootstrap} from "@angular/platform-browser-dynamic";
import {Component} from "@angular/core";
import {SELECT_CONTROL_DIRECTIVES} from "../../src/index";
import {Repository} from "./Repository";
import {HTTP_PROVIDERS, Http} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {disableDeprecatedForms, provideForms} from "@angular/forms";

@Component({
    selector: "app",
    template: `
<div class="container">
    
        <h4>Autocomplete single:</h4>
        <autocomplete 
            [(ngModel)]="selectedRepository1" 
            [loader]="loader"
            labelBy="name"
            trackBy="name"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ selectedRepository1 | json }}</pre>
    
        <h4>Autocomplete single with persist:</h4>
        <autocomplete [(ngModel)]="selectedRepository2" 
                      [loader]="loader"
                      [persist]="true"
                      labelBy="name"
                      trackBy="name"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ selectedRepository2 | json }}</pre>
    
        <h4>Autocomplete single with predefined model:</h4>
        <autocomplete [(ngModel)]="newSelectedRepository" 
                    [loader]="loader"
                    [persist]="true"
                    labelBy="name"
                    trackBy="name"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ newSelectedRepository | json }}</pre>
        <button (click)="resetModel()">reset model</button>
        
        <h4>Autocomplete single disabled:</h4>
        <autocomplete [(ngModel)]="selectedRepository3" 
                    [loader]="loader"
                    [disabled]="true"
                    labelBy="name"
                    trackBy="name"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ selectedRepository3 | json }}</pre>
    
        <h4>Autocomplete single with minimal number of characters to send a request:</h4>
        <autocomplete [(ngModel)]="selectedRepository4" 
                    [loader]="loader"
                    [minQueryLength]="1"
                    labelBy="name"
                    trackBy="name"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ selectedRepository4 | json }}</pre>
    
        <h4>Autocomplete single with specific values selected:</h4>
        <autocomplete [(ngModel)]="selectedRepository5" 
                    [loader]="loader"
                    labelBy="name"
                    valueBy="name"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ selectedRepository5 | json }}</pre>
    
        <h4>Autocomplete single with ordering enabled:</h4>
        <autocomplete [(ngModel)]="selectedRepository6" 
                    [loader]="loader"
                    labelBy="name"
                    trackBy="name"
                    orderBy="name"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ selectedRepository6 | json }}</pre>
    
        <h4>Autocomplete single with descendant ordering enabled:</h4>
        <autocomplete [(ngModel)]="selectedRepository7" 
                    [loader]="loader"
                    labelBy="name"
                    trackBy="name"
                    orderBy="name"
                    orderDirection="desc"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ selectedRepository7 | json }}</pre>
    
        <h4>Autocomplete single with limit:</h4>
        <autocomplete [(ngModel)]="selectedRepository8" 
                    [loader]="loader"
                    labelBy="name"
                    trackBy="name"
                    [limit]="2"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ selectedRepository8 | json }}</pre>
    
        <h4>Autocomplete single with maximal allowed to selection:</h4>
        <autocomplete [(ngModel)]="selectedRepository9" 
                    [loader]="loader"
                    labelBy="name"
                    trackBy="name"
                    [maxModelSize]="2"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ selectedRepository9 | json }}</pre>
    
        <h4>Autocomplete single with custom item constructor function:</h4>
        <autocomplete [(ngModel)]="selectedRepository10" 
                    [loader]="loader"
                    labelBy="name"
                    trackBy="name"
                    [persist]="true"
                    [itemConstructor]="itemConstructor"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ selectedRepository10 | json }}</pre>
    
        <h4>Autocomplete single with custom template:</h4>
        <autocomplete #autocomplete
                    [(ngModel)]="selectedRepository11" 
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
        <pre>{{ selectedRepository11 | json }}</pre>
        
        <h4>Autocomplete single with forms and required:</h4>
        <form>
        <autocomplete #selectedRepositoryAutocomplete="ngModel"
                    name="selectedRepository"
                    [(ngModel)]="selectedRepository12" 
                    [loader]="loader"
                    labelBy="name"
                    trackBy="name"
                    [persist]="true"
                    [required]="true"></autocomplete>
        </form>
        <div [hidden]="selectedRepositoryAutocomplete.valid || selectedRepositoryAutocomplete.pristine" class="alert alert-danger">
            This field is required
        </div>
    
        <h4>model: </h4>
        <pre>{{ selectedRepository12 | json }}</pre>
    
        <h4>Autocomplete multiple:</h4>
        <autocomplete [(ngModel)]="selectedRepositories1" 
                    [loader]="loader"
                    placeholder="type to select"
                    labelBy="name"
                    trackBy="name"></autocomplete>

        <h4>Selected items can be used to show selected items:</h4>
        <select-items
                  [hideControls]="true"
                  [removeButton]="true"
                  [items]="selectedRepositories1"
                  labelBy="name"
                  trackBy="name"
                  [readonly]="true"></select-items>
                    
        <br/><b>model: </b>
        <pre>{{ selectedRepositories1 | json }}</pre>
        
        <h4>Autocomplete multiple with persist and custom button label</h4>
        <autocomplete [(ngModel)]="selectedRepositories2" 
                    [loader]="loader"
                    [persist]="true"
                    addButtonLabel="add"
                    labelBy="name"
                    trackBy="name"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ selectedRepositories2 | json }}</pre>
    
        <h4>Autocomplete explicit multiple:</h4>
        <autocomplete [(ngModel)]="allSelectedRepositories" 
                    [loader]="loader"
                    [persist]="true"
                    [multiple]="true"
                    labelBy="name"
                    trackBy="name"></autocomplete>
                    
        <b>model: </b>
        <pre>{{ allSelectedRepositories | json }}</pre>
        
</div>
`,
    directives: [SELECT_CONTROL_DIRECTIVES]
})
export class Sample1App {

    repositories: Repository[] = [
        new Repository(1, "Angular", { name: "Google" }),
        new Repository(2, "Typescript", { name: "Microsoft" }),
        new Repository(3, "React", { name: "Facebook" }),
    ];
    newSelectedRepository: Repository = new Repository(1, "Angular", { name: "Google" });;

    selectedRepository1: Repository;
    selectedRepository2: Repository;
    selectedRepository3: Repository = new Repository(1, "Angular", { name: "Google" });;
    selectedRepository4: Repository;
    selectedRepository5: Repository;
    selectedRepository6: Repository;
    selectedRepository7: Repository;
    selectedRepository8: Repository;
    selectedRepository9: Repository;
    selectedRepository10: Repository;
    selectedRepository11: Repository;
    selectedRepository12: Repository;

    selectedRepositories1: Repository[] = [];
    
    loader = (term: string) => {
        return this.http
            .get("https://api.github.com/search/repositories?q=" + term)
            .map(res => res.json().items) as Observable<any>;
    };

    itemConstructor = (term: string) => {
        return new Repository(0, term, { name: "ME" });
    };

    constructor(private http: Http) {
    }

    resetModel() {
        this.newSelectedRepository = new Repository(1, "Angular", { name: "Google" });
    }

}

bootstrap(Sample1App, [
    HTTP_PROVIDERS,
    disableDeprecatedForms(),
    provideForms(),
]);