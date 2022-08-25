import {fromEvent, EMPTY} from "rxjs";
import {catchError, debounceTime, distinctUntilChanged, filter, map, mergeMap, switchMap, tap} from "rxjs/operators";
import {ajax} from "rxjs/ajax";

const url = 'https://api.github.com/search/users?q=';

const search = document.getElementById('search');
const items = document.getElementById('items');

const stream$ = fromEvent(search, 'input')
    .pipe(
        map(event => event.target.value),
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => items.innerHTML = ''),
        filter(v => v.trim()),
        switchMap(inputValue => ajax.getJSON(url + inputValue).pipe(
            catchError(() => EMPTY),
        )),
        map(result => result.items),
        mergeMap(items => items)
    )

stream$.subscribe(user => {
    const html = `          
           <div class="card">
                <div class="card-image">
                    <img src="${user.avatar_url}" alt="avatar" />
                    <span class="card-title">${user.login}</span>
                </div>
                <div class="card-action">
                    <a href="${user.html_url}" target="_blank">Link to GitHub</a>
                </div>
            </div>
`
    items.insertAdjacentHTML('beforeend', html)
})
