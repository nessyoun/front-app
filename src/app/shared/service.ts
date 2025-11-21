import { UserApp } from "../entities/auth/user.entity";
import { SERVER_URL } from "../globals";

export const findUserByEmail = async (email: string): Promise<UserApp> => {
    const res = await fetch(`${SERVER_URL}/findUser?email=${email}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user")}`,
      },
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch user by email");
    }
  
    const user: UserApp = await res.json();
  
    const parsedUser: UserApp = {
      ...user,
      birthDate: user.birthDate ? new Date(user.birthDate) : null,
      haringDate: user.haringDate ? new Date(user.haringDate) : null,
    };
  
    // store full name
    localStorage.setItem("fullName", `${parsedUser.firstName} ${parsedUser.lastName}`);
  
    return parsedUser;
  };
  