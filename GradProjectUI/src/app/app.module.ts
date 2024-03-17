import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import{DeleteAccountComponent} from './settings-menu/delete-account/delete-account.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { LeftSideMenuComponent } from './left-side-menu/left-side-menu.component';
import { RightSideMenuComponent } from './right-side-menu/right-side-menu.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { MangePostComponent } from './mange-post/mange-post.component';
import { PostListComponent } from './post-list/post-list.component';
import { LoginComponent } from './login/login.component';
import { SettingsMenuComponent } from './settings-menu/settings-menu.component';
import { AccountInformationComponent } from './settings-menu/account-information/account-information.component';
import { ChangePasswordComponent } from './settings-menu/change-password/change-password.component';
import { ChangeProfileComponent } from './settings-menu/change-profile/change-profile.component';
import { FriendsListComponent } from './friend-list/friend-list.component';
import { ProfilePage } from './profile/profile-page.component';
import { ProfileInfo } from './profile/profileInfo/profileInfo.component';
import { ProfileDetails } from './profile/profile-details/profile-details.component';
import { Event } from './event/event.component';
import { RightSide } from './event/right-side/right-side.component';
import { LeftSide } from './event/left-side/left-side.component';
import { EventCards } from './event/event-card/event-card.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {AppHttpInterceptor} from "./services/app-interceptor.service";
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RegisterComponent} from './registration/sign-up.component';
import { ToastrModule } from 'ngx-toastr';
import{SideBarComponent}from './side-navigation-bar/side-navigation-bar.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import{UsersListComponent} from './Users/users.component';
import {FriendsComponent} from './friend-list/friend-list/friendsList.component';
import{PendingFriendsList} from './friend-list/pending-list/pending-list.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LeftSideMenuComponent,
    RightSideMenuComponent,
    HeaderComponent,
    FriendsListComponent,
    MangePostComponent,
    PostListComponent,
    LeftSideMenuComponent,
    SettingsMenuComponent,
    AccountInformationComponent,
    ChangePasswordComponent,
    ProfilePage,
    ProfileInfo,
    ProfileDetails,
    Event,
    RightSide,
    LeftSide,
    EventCards,
    LoginComponent,
    ChangeProfileComponent,
    RegisterComponent,
    SideBarComponent,
    DeleteAccountComponent,
    UsersListComponent,
    FriendsComponent,
    PendingFriendsList
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CarouselModule.forRoot(),
    HttpClientModule,
    MatButtonModule,
    MatSnackBarModule,
    NgbModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass:'toast-top-right',
      timeOut: 3000,  // Toast timeout in milliseconds
      preventDuplicates: false,  // Prevent showing duplicate toasts
      closeButton: true,
    }),

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true,}
  ],



  bootstrap: [AppComponent]
})
export class AppModule { }
