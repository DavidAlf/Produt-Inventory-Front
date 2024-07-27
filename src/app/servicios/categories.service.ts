import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private principlaURL = 'http://localhost:9090/inventoryProject/category';

  constructor(private httpClient: HttpClient) {
  }

  get(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.principlaURL, { responseType: 'json' });
  }

  add(object: any): Observable<any> {    
    return this.httpClient.post<any>(this.principlaURL, object, { responseType: 'json' });
  }

  update(object: any): Observable<any> {
    const url = `${this.principlaURL}/${object.id}`;
    return this.httpClient.put<any>(url, object, { responseType: 'json' });
  }

  delete(objectId: number): Observable<any> {
    const url = `${this.principlaURL}/${objectId}`;
    return this.httpClient.delete<any>(url);
  }
}
