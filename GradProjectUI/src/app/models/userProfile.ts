export class UserProfileModel {
  Id: any;
  firstName: string;
  lastName!: string;
  email!: string;
  country!:string;
  dateOfBirth!: Date;
  gender!: number;
  profilePicture!: string;
  coverPicture!: string;
  bio!: string;
  fullName!: string;
  isAdded: boolean;
  isFriend:boolean;
  nickName!: string;
  mobileNumber!: number;
  createdDate: Date;
  mutualFriendsCount: number;


}
