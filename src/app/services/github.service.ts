import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { concatMap, filter, map, reduce, scan, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

interface GHUser {
  login: string;
}

interface GHRepo {
  id: number;
  name: string;
  owner: GHUser;
  size: number;
}

interface GHRepoContent {
  type: 'file' | 'dir' | 'symlink' | 'submodule';
  name: string;
  path: string;
  url: string;
  git_url: string;
}


@Injectable({
  providedIn: 'root'
})
export class GithubService {

  private readonly endpoint = 'https://api.github.com';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public request<T = any>(url: string, method: string = 'GET'): Observable<T> {
    return this.http.request<T>(method, url.startsWith('http') ? url : this.endpoint + url, {
      headers: new HttpHeaders({
        Authorization: 'token ' + this.authService.token,
        Accept: 'application/vnd.github.v3+json'
      })
    });
  }

  public getRepos(): Observable<GHRepo[]> {
    return this.request<GHRepo[]>('/user/repos');
  }

  public getRepoContent(repo: GHRepo): Observable<GHRepoContent[]> {
    return this.request<GHRepoContent[]>(`/repos/${repo.owner.login}/${repo.name}/contents`);
  }

  public findInContent(content: GHRepoContent[], pattern: RegExp) {

    const files: GHRepoContent[] = [];

    const dirs = content.filter((entry: GHRepoContent) => {
      if (entry.type === 'file' && pattern.test(entry.name)) {
        files.push(entry);
        return false;
      } else if (entry.type === 'dir') {
        return true;
      }
      return false;
    });

    if (!dirs.length) {
      return of(files);
    }

    return from(dirs).pipe(
      concatMap(dir => this.request(dir.url)),
      concatMap((deepContent: GHRepoContent[]) => this.findInContent(deepContent, pattern)),
    );
  }

  public find(pattern: RegExp = /^.*$/g) {
    return this.getRepos().pipe(
      switchMap(repos => from(repos.filter(repo => repo.name === 'imhotep'))),
      filter(repo => repo.size),
      concatMap(repo => this.getRepoContent(repo)),
      concatMap((content: GHRepoContent[]) => this.findInContent(content, pattern)),
      reduce((result, files) => {
        return [...result, ...files];
      }, [])
    );
  }
}
