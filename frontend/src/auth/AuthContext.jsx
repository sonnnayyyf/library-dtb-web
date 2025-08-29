import React,{createContext,useContext,useEffect,useMemo,useState} from 'react';
const C=createContext(null);
export function AuthProvider({children}){const[token,setToken]=useState(()=>localStorage.getItem('token'));const[user,setUser]=useState(()=>{const r=localStorage.getItem('user');return r?JSON.parse(r):null;});useEffect(()=>{token?localStorage.setItem('token',token):localStorage.removeItem('token')},[token]);useEffect(()=>{user?localStorage.setItem('user',JSON.stringify(user)):localStorage.removeItem('user')},[user]);const value=useMemo(()=>({token,setToken,user,setUser,logout(){setToken(null);setUser(null);}}),[token,user]);return <C.Provider value={value}>{children}</C.Provider>}
export function useAuth(){return useContext(C);}
