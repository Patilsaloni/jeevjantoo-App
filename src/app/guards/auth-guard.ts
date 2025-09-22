import { Injectable } from '@angular/core';
import {
  CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree
} from '@angular/router';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  private auth = getAuth();

  constructor(private router: Router) {}

  private waitForAuthUser(): Promise<User | null> {
    return new Promise(resolve => {
      const unsub = onAuthStateChanged(this.auth, (u) => {
        unsub();
        resolve(u); // null ya User
      });
    });
  }

  private async checkAuth(): Promise<boolean | UrlTree> {
    // Wait for Firebase Auth init (fixes first-load issues)
    const user = await this.waitForAuthUser();

    if (user) return true;
    // not signed in → redirect to /signin, preserve return URL if you want
    return this.router.parseUrl('/signin');
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkAuth();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkAuth();
  }
}
