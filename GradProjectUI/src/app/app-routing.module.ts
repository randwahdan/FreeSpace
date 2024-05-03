import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FriendsListComponent} from './friend-list/friend-list.component';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {MangePostComponent} from "./mange-post/mange-post.component";
import {SettingsMenuComponent} from "./settings-menu/settings-menu.component";
import {AccountInformationComponent} from "./settings-menu/account-information/account-information.component";
import {ChangePasswordComponent} from "./settings-menu/change-password/change-password.component";
import {ChangeProfileComponent} from "./settings-menu/change-profile/change-profile.component";
import { ProfilePage } from './profile/profile-page.component';
import { Event } from './event/event.component';
import {RegisterComponent} from './registration/sign-up.component';
import {DeleteAccountComponent} from './settings-menu/delete-account/delete-account.component';
import { UsersListComponent } from './Users/users.component';
import { NotificationPage } from './notification/notification.component';
import {ChatAppComponent} from './chat/chat.component';
import{CreateEvent} from './event/create-event/create-event.component';
import {EventDetails}from './event/event-details/event-details.component';
import { ProfilePageNavigator } from './profile-navigator/profile-page-navigator.component';
import {ArchiveEventComponent} from './archive-event/archive-event.component'
const routes: Routes = [
  {path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent },
  {path: 'setting', component: SettingsMenuComponent,
    children: [
      {path: 'account', component: AccountInformationComponent},
      {path: 'changePassword', component: ChangePasswordComponent},
      {path: 'changeProfile', component: ChangeProfileComponent},
      {path:'deleteAccount',component:DeleteAccountComponent}

    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'home', component: HomeComponent,
    children: [
      {path: 'friends', component:FriendsListComponent },
      {path:'users',component:UsersListComponent},
      {path: 'manage', component: MangePostComponent},
    ]
  },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'friends', component:FriendsListComponent,

  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'users', component:UsersListComponent,

  },

  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: 'ProfilePage/:id', component: ProfilePage },
  { path: 'UserProfile/:id', component: ProfilePageNavigator },


  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'Event', component:Event,
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'notofication', component:NotificationPage,
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'Chat', component:ChatAppComponent,
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'ArchivedEvents', component:ArchiveEventComponent,
  },
  { path: '', redirectTo: '/Event', pathMatch: 'full' },
  {
    path: 'create-event', component:CreateEvent,
  },
  { path: '', redirectTo: '/Event', pathMatch: 'full' },
  {
    path: 'event-details/:eventId', component:EventDetails,
  },

];

@NgModule({
  imports: [RouterModule.forRoot(
    routes, {enableTracing: true}  // <-- debugging purposes only
  )],

  exports: [RouterModule]
})
export class AppRoutingModule {
}
