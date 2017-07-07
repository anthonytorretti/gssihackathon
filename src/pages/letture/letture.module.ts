import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LetturePage } from './letture';

@NgModule({
  declarations: [
    LetturePage,
  ],
  imports: [
    IonicPageModule.forChild(LetturePage),
  ],
  exports: [
    LetturePage
  ]
})
export class LetturePageModule {}
