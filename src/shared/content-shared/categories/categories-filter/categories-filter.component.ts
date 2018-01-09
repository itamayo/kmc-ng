import {
    AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output,
    ViewChild
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ISubscription } from 'rxjs/Subscription';

import { PopupWidgetComponent, PopupWidgetStates } from '@kaltura-ng/kaltura-ui/popup-widget/popup-widget.component';
import { AutoComplete, SuggestionsProviderData } from '@kaltura-ng/kaltura-primeng-ui/auto-complete';

import '@kaltura-ng/kaltura-common/rxjs/add/operators';
import { CategoriesTreeComponent } from 'app-shared/content-shared/categories/categories-tree/categories-tree.component';
import {CategoriesSearchService} from 'app-shared/content-shared/categories/categories-search.service';
import { ScrollToTopContainerComponent } from '@kaltura-ng/kaltura-ui/components/scroll-to-top-container.component';
import { CategoriesListItem } from 'app-shared/content-shared/categories/categories-list-type';
import { CategoriesModes } from 'app-shared/content-shared/categories/categories-mode-type';


@Component({
    selector: 'kCategoriesFilter',
    templateUrl: './categories-filter.component.html',
    styleUrls: ['./categories-filter.component.scss']
})
export class CategoriesFilterComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() public parentPopupWidget: PopupWidgetComponent;
    @Input() public selectionMode: CategoriesModes;
    @Output() public selectionModeChange = new EventEmitter<CategoriesModes>();
    @Input() public selection: CategoriesListItem[];
    @Output() onCategorySelected: EventEmitter<CategoriesListItem> = new EventEmitter();
    @Output() onCategoriesUnselected: EventEmitter<CategoriesListItem[]> = new EventEmitter();

    @ViewChild(ScrollToTopContainerComponent) _treeContainer: ScrollToTopContainerComponent;
    @ViewChild('categoriesTree') _categoriesTree: CategoriesTreeComponent;
    @ViewChild('searchCategory') private _autoComplete: AutoComplete = null;
    private _searchCategoriesRequest$: ISubscription;
    private filterUpdateSubscription: ISubscription;
    private parentPopupStateChangeSubscription: ISubscription;

    public _suggestionsProvider = new Subject<SuggestionsProviderData>();
    public _categoriesLoaded = false;

    public _CategoriesModes = CategoriesModes;

    constructor(private _categoriesSearch: CategoriesSearchService,
                private _filtersRef: ElementRef) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        if (this.parentPopupWidget) {
            this.parentPopupStateChangeSubscription = this.parentPopupWidget.state$.subscribe(event => {
                if (event.state === PopupWidgetStates.Open) {
                    const inputFields: any[] = this._filtersRef.nativeElement.getElementsByTagName('input');
                    if (inputFields.length && inputFields[0].focus) {
                        setTimeout(() => inputFields[0].focus(), 0);
                    }
                }
                if (event.state === PopupWidgetStates.Close && this._treeContainer) {
                    this._treeContainer.scrollToTop();
                }
            });
        }
    }


    public _onSelectionModeChanged(value) {
        // clear current selection
        this._clearAll();
        this.selectionMode = value;
        this.selectionModeChange.emit(this.selectionMode);
        this._categoriesTree.resetNodesState();
    }

    public _clearAll() {
        if (this.selection && this.selection.length)
        {
            this.onCategoriesUnselected.emit(this.selection);
        }
    }

    public _blockTreeSelection(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
    }

    close() {
        if (this.parentPopupWidget) {
            this.parentPopupWidget.close();
        }
    }

    ngOnDestroy() {
        this._suggestionsProvider.complete();

        if (this.filterUpdateSubscription) {
            this.filterUpdateSubscription.unsubscribe();
            this.filterUpdateSubscription = null;
        }

        if (this.parentPopupStateChangeSubscription) {
            this.parentPopupStateChangeSubscription.unsubscribe();
            this.parentPopupStateChangeSubscription = null;
        }
    }

    _onSuggestionSelected(): void {

        const selectedItem = this._autoComplete.getValue();
        // clear user text from component
        this._autoComplete.clearValue();

        if (selectedItem) {
            const data = selectedItem.data;
            this.onCategorySelected.emit(
                {
                    value: data.id,
                    label: data.name,
                    fullIdPath: data.fullIdPath,
                    tooltip: (data.fullNamePath || []).join(' > ')
                }
            );

            this._categoriesTree.expandNode(data.fullIdPath);
        }
    }

    _searchSuggestions(event): void {
        this._suggestionsProvider.next({ suggestions: [], isLoading: true });

        if (this._searchCategoriesRequest$) {
            // abort previous request
            this._searchCategoriesRequest$.unsubscribe();
            this._searchCategoriesRequest$ = null;
        }

        this._searchCategoriesRequest$ = this._categoriesSearch.getSuggestions(event.query).subscribe(data => {
                const suggestions = [];

                (data || []).forEach(item => {
                  const label = item.fullNamePath.join(' > ') + (item.referenceId ? ` (${item.referenceId})` : '');

                  const isSelectable = !this.selection.find(categoryFilter => {

                    if (this.selectionMode === CategoriesModes.SelfAndChildren) {
                      let alreadySelected = false;
                      for (let length = item.fullIdPath.length, i = length - 1; i >= 0 && !alreadySelected; i--) {
                        alreadySelected = item.fullIdPath[i] === categoryFilter.value;
                      }
                      return alreadySelected;
                    } else {
                      return categoryFilter.value === item.id;
                    }
                  });
                  suggestions.push({ data: item, label: label, isSelectable: isSelectable });
                });

                this._suggestionsProvider.next({ suggestions: suggestions, isLoading: false });
            },
            (err) => {
                this._suggestionsProvider.next({ suggestions: [], isLoading: false, errorMessage: <any>(err.message || err) });
            });
    }

}
