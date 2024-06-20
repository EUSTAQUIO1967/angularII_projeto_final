import { Injectable } from '@angular/core';
import { PERFIL_KEY, TOKEN_KEY, USER_KEY } from '../models/constants/constants';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  public getToken(): any {
    const token = window.sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      return token;
    }
    return null;
  }

  private setToken(token: string): void {
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  private removeToken(): void {
    this.removeStorageKey(TOKEN_KEY);
  }

  public getUser(): any {
    return window.sessionStorage.getItem(USER_KEY);
  }

  private setUser(user: string): void {
    window.sessionStorage.setItem(USER_KEY, user);
  }

  public getPerfil(): any {
    return window.sessionStorage.getItem(PERFIL_KEY);
  }

  private setPerfil(perfil: string): void {
    window.sessionStorage.setItem(PERFIL_KEY, perfil);
  }

  private removeUser(): void {
    this.removeStorageKey(USER_KEY);
  }

  private removePerfil(): void {
    this.removeStorageKey(PERFIL_KEY);
  }

  private removeStorageKey(chave: string) {
    window.sessionStorage.removeItem(chave);
  }

  public doLogin(token: string, user: string, perfil: string): void {
    this.setToken(token);
    this.setUser(user);
    this.setPerfil(perfil);
  }

  public doLogout() {
    this.removeToken();
    this.removeUser();
    this.removePerfil();
  }
}

