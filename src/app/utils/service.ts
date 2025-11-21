import { Child } from './../entities/child.entity';
import { TreeNode } from "primereact/treenode";
import { SERVER_URL } from "../globals";
import { mapToTreeNode } from "./mapperUsersToTreeNode";
import { UserApp } from "../entities/auth/user.entity";
import { Role } from '../entities/auth/role.entity';

export const fetchUsers = async (): Promise<TreeNode[]> => {
    const res = await fetch(`${SERVER_URL}/findUsers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user")}`,
      },
    });
  
    if (!res.ok) throw new Error("Failed to fetch users");
  
    const json = await res.json();
  
    const treeNodes: TreeNode[] = json.map((user: any, index: number) =>
      mapToTreeNode(
        {
          ...user,
          birthDate: user.birthDate ? new Date(user.birthDate) : null,
          haringDate: user.haringDate ? new Date(user.haringDate) : null,
        },
        `${index}` // key starts at "0" and increments
      )
    );
  
    console.log(treeNodes);
    return treeNodes;
  };

  const createChildren = async ( children: Child[])=>{
    const res = await fetch(`${SERVER_URL}/createChildren`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("user")}`,
      },
      body: JSON.stringify(children),
    });
  
    if (!res.ok) {
      throw new Error("Failed to create children");
    }
  
  }

  const assignChildToUser = async (userMat:string,childMat:string)=>{
    const res = await fetch(`${SERVER_URL}/assignChildToUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("user")}`,
      },
      body: JSON.stringify({childMat,userMat}),
    });
  
    if (!res.ok) {
      throw new Error("Failed to assign");
    }
  
  }

  export const createUser = async (user: UserApp): Promise<UserApp> => {
    await createChildren(user.children);
    const res = await fetch(`${SERVER_URL}/createUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("user")}`,
      },
      body: JSON.stringify(user),
    });
  
    if (!res.ok) {
      throw new Error("Failed to create user");
    }
    await Promise.all(
      user.children.map(child =>
        assignChildToUser(user.matricule, child.matricule)
      )
    );
    
  
    const createdUser: UserApp = await res.json();
    return {
      ...createdUser,
      birthDate: createdUser.birthDate ? new Date(createdUser.birthDate) : null,
      haringDate: createdUser.haringDate ? new Date(createdUser.haringDate) : null,
    };
  };
  
  export const deleteUser = async (user: UserApp) => {
    const res = await fetch(`${SERVER_URL}/deleteUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("user")}`,
      },
      body: JSON.stringify(user),
    });
  
    if (!res.ok) {
      throw new Error("Failed to delete user");
    }
  
  };
  
  export const getRoles = async (): Promise<Role[]> => {
    const res = await fetch(`${SERVER_URL}/findRoles`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user")}`,
      },
    });
  
    if (!res.ok) throw new Error("Failed to fetch roles");
  
    const roles: Role[] = await res.json() as Role[];
    
    return roles;
  }
  
  