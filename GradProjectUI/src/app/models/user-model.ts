export class UserModel {
  id: any;
  firstName: string;
  lastName!: string;
  email!: string;
  dateOfBirth!: Date;
  gender!: number;
  profilePicture!: string;
  coverPicture!: string;
  bio!: string;
  fullName!: string;
  isAdded: boolean
  nickName!: string;
  mobileNumber!: number;
  createdDate: Date;
  mutualFriendsCount: number;

}
