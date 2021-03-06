import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { concatMap, filter, map, reduce, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import parse from 'github-parse-link';
import { environment } from 'src/environments/environment';

export interface GHUser {
  login: string;
}

export interface GHRepo {
  id: number;
  name: string;
  owner: GHUser;
  size: number;
}

export interface GHRepoContent {
  type: 'file' | 'dir' | 'symlink' | 'submodule';
  name: string;
  path: string;
  url: string;
  git_url: string;
  download_url: string;
  sha: string;
}

export interface GHFile {
  repo: GHRepo;
  file: GHRepoContent;
}


@Injectable({
  providedIn: 'root'
})
export class GithubService {

  private readonly endpoint = 'https://api.github.com';

  public lastSearch: GHFile[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /* Request with pagination resolved */
  public requestPagination<T>(url: string): Observable<T[]> {
    return this.request<T[]>(url, 'GET', { observe: 'response' }).pipe(
      concatMap((response: HttpResponse<T[]>) => {
        const links = parse(response.headers.get('Link'));
        return links.next ? this.requestPagination<T>(links.next).pipe(
          map((results: T[]) => [...results, ...response.body])
        ) : of(response.body);
      }),
    );
  }

  /* request to the Github API with the token included */
  public request<T = any>(url: string, method: string = 'GET', options = {}): Observable<T | HttpResponse<T>> {
    return this.http.request<T>(method, url.startsWith('https://') ? url : this.endpoint + url, {
      ...options,
      headers: new HttpHeaders({
        Authorization: 'token ' + this.authService.token,
        Accept: 'application/vnd.github.v3+json'
      })
    });
  }

  /* load a list of repositories */
  public getRepos(): Observable<GHRepo[]> {
    return this.requestPagination<GHRepo>('/user/repos');
  }

  /* load content of the repo */
  public getRepoContent(repo: GHRepo): Observable<GHRepoContent[]> {
    return this.requestPagination<GHRepoContent>(`/repos/${repo.owner.login}/${repo.name}/contents`);
  }

  /* recursively find a file in the repo comparing file name to the pattern */
  public findInContent(repo: GHRepo, content: GHRepoContent[], pattern: RegExp): Observable<GHFile[]> {

    const files: GHFile[] = [];

    /* each entry in the repo can be either a file or a folder
     * if it's file and it match the pattern - keep it
     * otherwise if it's a dir - put it in an array, create observable stream
     * from these dirs and find in each dir
     */
    const dirs = content.filter((file: GHRepoContent) => {
      if (file.type === 'file' && pattern.test(file.name)) {
        files.push({ repo, file });
        return false;
      } else {
        return file.type === 'dir';
      }
    });

    /* stop searching if there are no more dirs */
    if (!dirs.length) {
      return of(files);
    }

    return from(dirs).pipe(
      concatMap(dir => this.requestPagination<GHRepoContent>(dir.url)),
      concatMap((deepContent: GHRepoContent[]) => this.findInContent(repo, deepContent, pattern)),
    );
  }

  /* find files in repositories by provided regular expression
   * list of repositories has to be set in environment
   */
  public find(pattern: RegExp) {
    return this.getRepos().pipe(
      switchMap(repos => from(
        repos.filter(repo => environment.repos.includes(repo.name))
      )),
      /* filter out empty repos */
      filter(repo => !!repo.size),
      concatMap((repo: GHRepo) => this.getRepoContent(repo).pipe(
        concatMap((content: GHRepoContent[]) => this.findInContent(repo, content, pattern))
      )),
      reduce((result, files) => {
        return [...result, ...files];
      }, []),
      /* save results */
      tap(result => this.lastSearch = result)
    );
  }

  /* when swagger-ui gets contract files, add token and accept header
     to the each request
   */
  public get getRequestInterceptor(): (T) => any {
    return request => {
      request.headers['Authorization'] = 'token ' + this.authService.token;
      request.headers['Accept'] = 'application/vnd.github.v3+json';
      return request;
    };
  }

  /* return found file by SHA */
  public getApiBySha(sha: string): GHFile {
    return this.lastSearch.find(api => api.file.sha === sha);
  }
}
