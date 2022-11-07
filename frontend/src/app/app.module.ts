import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { CreateTaskComponent } from './task/create-task/create-task.component';
import { ListTaskComponent } from './task/list-task/list-task.component';
import { GanttModule } from '@syncfusion/ej2-angular-gantt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input'
import {MatCardModule} from '@angular/material/card'
import {MatFormFieldModule} from '@angular/material/form-field'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {MatSnackBarModule} from '@angular/material/snack-bar'
import { TokenInterceptorService } from './service/token-interceptor.service';
import { AuthGuard } from './guard/auth.guard';
import { AuthService } from './service/auth.service';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSliderModule} from '@angular/material/slider';
import { ViewTaskComponent } from './task/view-task/view-task.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { CargarScriptsService } from './service/cargarJs/cargar-scripts.service';
import { ManagerTaskComponent } from './task/manager-task/manager-task.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import { ConfirmDialogComponent } from './components/shared/confirm-dialog/confirm-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    CreateTaskComponent,
    ListTaskComponent,
    ViewTaskComponent,
    ManagerTaskComponent,
    SidebarComponent,
    ConfirmDialogComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GanttModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatMomentDateModule,
    MatSliderModule,
    MatProgressBarModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule,
    MatDialogModule
    
  ],
  entryComponents:[ConfirmDialogComponent],
  providers: [AuthService, AuthGuard,CargarScriptsService, TokenInterceptorService,{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
