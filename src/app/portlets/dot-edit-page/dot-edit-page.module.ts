import { PageViewResolver } from './dot-edit-page-resolver.service';
import { PageViewService } from './../../api/services/page-view/page-view.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotEditPageRoutingModule } from './dot-edit-page-routing.module';
import { DotAdditionalActionsModule } from './layout/dot-additional-actions/dot-additional-actions.module';
import { DotEditLayoutModule } from './layout/dot-edit-layout/dot-edit-layout.module';

@NgModule({
    imports: [
        CommonModule,
        DotEditPageRoutingModule,
        DotEditLayoutModule,
        DotAdditionalActionsModule
    ],
    declarations: [],
    providers: [PageViewService, PageViewResolver]
})
export class DotEditPageModule {}