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
      {path: 'friends', component: FriendsListComponent},
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

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'Event', component:Event,
  }

];

@NgModule({
  imports: [RouterModule.forRoot(
    routes, {enableTracing: true}  // <-- debugging purposes only
  )],

  exports: [RouterModule]
})
export class AppRoutingModule {
}
