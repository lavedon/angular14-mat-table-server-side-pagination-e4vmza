import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CharacterService } from './character.service';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { Character } from './interfaces';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['id', 'name', 'status', 'gender', 'species'];
  dataSource$ = new Observable<Character[]>();
  pageTotal: number;

  constructor(
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.getDataFromApi();
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.router.navigate([''], {
        relativeTo: this.route,
        queryParams: { page: this.paginator.pageIndex + 1 },
        queryParamsHandling: 'merge',
      });
    });
  }

  getDataFromApi() {
    this.dataSource$ = this.route.queryParams.pipe(
      switchMap((params: Params) => {
        const filters = {
          status: params.status || '',
          gender: params.gender || '',
          name: params.name || '',
          page: params.page || 1,
        };

        return this.characterService.getCharacters(filters).pipe(
          map((data) => {
            this.pageTotal = data.info.count;
            return data.results;
          }),
          catchError(() => {
            this.pageTotal = 0;
            return of(null);
          })
        );
      })
    );
  }
}
