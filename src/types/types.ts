export type HeaderSliderType = {
  children: React.ReactElement;
};

export interface IFormInputs {
  name?: string;
  login: string;
  password: string;
}

export interface INewUserResponse {
  _id: string;
  name: string;
  login: string;
}

export interface IAuthorizationResult {
  token: string;
}

export interface IBoardsOfUser {
  _id: string;
  title: string;
  owner: string;
  users: string[];
}
