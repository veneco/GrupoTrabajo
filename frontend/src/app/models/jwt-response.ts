export interface JwtResponseI {
  dataUser: {
    id: number,
    name: string,
    email: string,
    rol: string,
    accessToken: string,
    expiresIn: string
  }
}
