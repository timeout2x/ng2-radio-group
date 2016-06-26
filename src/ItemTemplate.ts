import {Input, TemplateRef, ViewContainerRef, Directive, QueryList} from "@angular/core";

@Directive({
    selector: "[itemTemplate]"
})
export class ItemTemplate {

    @Input("itemTemplate")
    item: any;

    constructor(public templateRef: TemplateRef<any>) {
    }
    
}

@Directive({
    selector: "[itemTemplateTransclude]"
})
export class ItemTemplateTransclude {

    private itemTemplates: QueryList<ItemTemplate>;

    @Input()
    item: any;

    @Input()
    set itemTemplateTransclude(itemTemplates: QueryList<ItemTemplate>) {
        this.itemTemplates = itemTemplates;
        if (itemTemplates) {
            const itemTemplate = itemTemplates.toArray().find(itemTemplate => itemTemplate.item === this.item);
            if (itemTemplate && this.viewContainer)
                this.viewContainer.createEmbeddedView(itemTemplate.templateRef);
        }
    };

    get itemTemplateTransclude() {
        return this.itemTemplates;
    }

    constructor(private viewContainer: ViewContainerRef) {
    }

}