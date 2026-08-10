import type {
  GenreTrendsResponse,
  GenreRecommendationsResponse,
  GenrePopularityResponse,
  GenreDetailsResponse,
} from './genre-service.js';
import {
  getGenreTrends,
  getGenreRecommendations,
  getGenrePopularity,
  getGenreById,
} from './genre-service.js';

export interface GenreController {
  getTrends(): Promise<GenreTrendsResponse>;
  getRecommendations(): Promise<GenreRecommendationsResponse>;
  getPopularity(): Promise<GenrePopularityResponse>;
  getGenreDetails(id: string): Promise<GenreDetailsResponse | null>;
}

export const genreController: GenreController = {
  getTrends: () => getGenreTrends(),
  getRecommendations: () => getGenreRecommendations(),
  getPopularity: () => getGenrePopularity(),
  getGenreDetails: (id) => getGenreById(id),
};
