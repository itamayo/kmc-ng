import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TagsModule } from '@kaltura-ng/kaltura-ui';
import { KMCShellModule } from 'app-shared/kmc-shell';

import { routing } from './administration-multi-account-app.routes';
import { AdministrationMultiAccountComponent } from './administration-multi-account.component';

import { DynamicMetadataFormModule } from 'app-shared/kmc-shared';

import {LocalizationModule} from '@kaltura-ng/mc-shared';
import { KalturaPrimeNgUIModule } from '@kaltura-ng/kaltura-primeng-ui';
import { AreaBlockerModule, KalturaUIModule, StickyModule, TooltipModule } from '@kaltura-ng/kaltura-ui';
import { AutoCompleteModule } from '@kaltura-ng/kaltura-primeng-ui';
import { PopupWidgetModule } from '@kaltura-ng/kaltura-ui';
import { DynamicFormModule } from '@kaltura-ng/kaltura-ui';
import { DynamicFormModule as PrimeDynamicFormModule } from '@kaltura-ng/kaltura-primeng-ui';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from '@kaltura-ng/kaltura-primeng-ui';
import { AccountsListComponent } from './accounts-list/accounts-list.component';
import { AccountsTableComponent } from './accounts-table/accounts-table.component';
import { AccountsRefineFiltersComponent } from './accounts-refine-filters/accounts-refine-filters.component';
import { NewAccountComponent } from './new-account/new-account.component';
import { StatusPipe } from './pipes/status.pipe';
import { AccountsTagsComponent } from './accounts-tags/accounts-tags.component';
import { KMCPermissionsModule } from 'app-shared/kmc-shared/kmc-permissions';
import { DateFormatModule } from 'app-shared/kmc-shared/date-format/date-format.module';
import { FiltersModule } from '@kaltura-ng/mc-shared';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule } from 'primeng/paginator';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SharedModule } from 'primeng/shared';
import { SpinnerModule } from 'primeng/spinner';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TreeModule } from 'primeng/tree';
import { InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
  imports: [
    AccordionModule,
    AreaBlockerModule,
    AutoCompleteModule,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    CommonModule,
    ConfirmDialogModule,
    DropdownModule,
    DynamicFormModule,
    FormsModule,
    InputTextareaModule,
    InputTextModule,
    LocalizationModule,
    DynamicMetadataFormModule,
    KalturaPrimeNgUIModule,
    KalturaUIModule,
    KMCShellModule,
    MenuModule,
    MultiSelectModule,
    PaginatorModule,
    PopupWidgetModule,
    PrimeDynamicFormModule,
    RadioButtonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routing),
    SharedModule,
    SpinnerModule,
    TagsModule,
    TieredMenuModule,
    TooltipModule,
    TreeModule,
    StickyModule,
    KMCPermissionsModule,
    TableModule,
    InputSwitchModule,
      DateFormatModule,
      FiltersModule
  ],
  declarations: [
    AdministrationMultiAccountComponent,
    AccountsListComponent,
    AccountsTableComponent,
    StatusPipe,
    AccountsRefineFiltersComponent,
    AccountsTagsComponent,
    NewAccountComponent
  ],
  exports: [],
  providers: [],
})
export class AdministrationMultiAccountAppModule {
}
