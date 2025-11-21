import { TreeNode } from "primereact/treenode";
import { UserApp } from "../entities/auth/user.entity";
import { Child } from "../entities/child.entity";


export const mapToUserApp = (node:TreeNode):UserApp=>{
    let user:UserApp = node.data as UserApp;
    user.children = compressChildren(node) as Child[];
    return user;
}

const compressChildren = (node:TreeNode)=>
{
    if(node?.children?.at(0)?.data)
    return node?.children?.map((child) => ({
        matricule:child.data.matricule,
        firstName:child.data.firstName,
        lastName:child.data.lastName,
        birthDate:child.data.birthDate,
        score:child.data.score,
        genre:child.data.genre,
      }));
      return node?.children;
}

export const mapToTreeNode = (user:UserApp,key_in:string)=>
{
    let node:TreeNode = {
        key:key_in,
        data:user,
        children:extractChildren(user,key_in)
    } 
    return node;
    
}



const extractChildren = (user:UserApp,key_in:string)=>{

    let children:Child[]=user.children;
    return children.map((child, i) => ({
        key: `${key_in}-${i}`, // use i+1 if you want 1-based
        data: child,              // or {...child} if you need a copy
      }));

}