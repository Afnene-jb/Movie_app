import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie-service';
import { Movie } from '../../interfaces/movie';

@Component({
  imports: [],
  selector: 'app-wish-list',
  styleUrl: './wish-list.css',
  templateUrl: './wish-list.html',
})
export class WishList {
  router = inject(Router);
  movieService = inject(MovieService);

  navigateTo(movie: Movie) {
    this.router.navigate(['/', movie.id]);
  }
}
