import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { Movie } from "../interfaces/movie";
import { map, Observable, shareReplay } from "rxjs";
import { MovieResponse } from "../interfaces/movie-response";

const WISHLIST_KEY = 'wishlist';

@Injectable({
    providedIn: 'root'
})
export class MovieService {
    private readonly http = inject(HttpClient);
    private readonly url = environment.apiUrl;
    private readonly movieUrl = environment.url_movie_api;
    private readonly Key = environment.apiKey;

    public movieList = signal<Movie[]>([]);
    public selectedMovie = signal<Movie | null>(null);
    // la wishlist est restaurée depuis le localStorage au démarrage
    public wishList = signal<Movie[]>(this.loadWishlist());

    // shareReplay : la requête n'est faite qu'une seule fois, ensuite le résultat est réutilisé
    // (retour à la liste, recherche à chaque lettre tapée...)
    private readonly movies$ = this.http.get<MovieResponse>(`${this.url}?api_key=${this.Key}`).pipe(
        map(response => response.results),
        shareReplay({ bufferSize: 1, refCount: false })
    );

    getMovieList(): Observable<Movie[]> {
        return this.movies$;
    }


    getMovieById(id: number): Observable<Movie> {
        return this.http.get<Movie>(`${this.movieUrl}${id}?api_key=${this.Key}`);
    }

    addToWishlist(movie: Movie): void {
        // pas de doublon
        if (this.wishList().some(m => m.id === movie.id)) {
            return;
        }
        this.wishList.update(list => [...list, movie]);
        this.saveWishlist();
    }

    private loadWishlist(): Movie[] {
        try {
            return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
        } catch {
            return [];
        }
    }

    private saveWishlist(): void {
        try {
            localStorage.setItem(WISHLIST_KEY, JSON.stringify(this.wishList()));
        } catch {

        }
    }
}
