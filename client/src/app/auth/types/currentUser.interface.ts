/**
 * User information returned from the API.
 */
export interface CurrentUser {
  /**
   * MongoDB identifier for the user
   */
  id: string;

  /**
   * JWT token containing user's information
   */
  token: string;

  /**
   * User's username
   */
  username: string;

  /**
   * User's email
   */
  email: string;
}
