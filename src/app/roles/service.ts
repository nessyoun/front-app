import { Role } from "../entities/auth/role.entity";
import { SERVER_URL } from "../globals";

const backendCall = async (role:Role,sublink:string)=>{
    const res = await fetch(`${SERVER_URL+sublink}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user")}`,
        },
        body: JSON.stringify(role),
      });
}

export const createRole = async (role:Role) =>{
    const res = await backendCall(role,"/createRole");
}

export const deleteRole = async (role:Role)=>{
    const res = await backendCall(role,"/deleteRole");
}

const findRole = async (name:string) =>{
 const res = await fetch(`${SERVER_URL}/findRole`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("user")}`,
    },
    body: JSON.stringify({name}),
  });

  if (!res.ok) {
    throw new Error("Failed to find role");
  }
}


const assignRoleToUser = async (userMat:string,roleName:string)=>{
    const res = await fetch(`${SERVER_URL}/assignRoleToUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("user")}`,
      },
      body: JSON.stringify({roleName,userMat}),
    });
  
    if (!res.ok) {
      throw new Error("Failed to assign");
    }
  
  }


