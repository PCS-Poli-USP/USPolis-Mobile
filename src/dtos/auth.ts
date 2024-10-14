export type AuthUser = {
  id: number;
  sub: string;
  given_name: string;
  family_name: string;
  email: string;
  picture_url: string;
};

export type AuthResponse = {
  is_registered_user: boolean;
  user: AuthUser;
};
