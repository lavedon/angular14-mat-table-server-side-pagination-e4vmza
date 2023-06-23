import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpRequest } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  constructor(private http: HttpClient) {}

  getCharacters(
    filters: {
      status?: string;
      gender?: string;
      name?: string;
      page: string;
    } = {
      status: '',
      gender: '',
      name: '',
      page: '',
    }
  ): Observable<ApiHttpRequest> {
    const params = new HttpParams({ fromObject: filters });
    return this.http.get<ApiHttpRequest>(
      `https://rickandmortyapi.com/api/character`,
      { params }
    );
  }
}
