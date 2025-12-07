import { Injectable, signal, computed, effect } from '@angular/core';
import { FavoritePokemon } from '../models/pokemon.model';

@Injectable({
    providedIn: 'root'
})
export class FavoritesService {
    private readonly STORAGE_KEY = 'pokemon-favoritos';
    private readonly favoritesSignal = signal<FavoritePokemon[]>(this.loadFromStorage());

    favorites = this.favoritesSignal.asReadonly();
    favoritesCount = computed(() => this.favoritesSignal().length);

    constructor() {
        // Guardo los favoritos
        effect(() => {
            this.saveToStorage(this.favoritesSignal());
        });
    }

    isFavorite(id: number): boolean {
        return this.favoritesSignal().some(fav => fav.id === id);
    }

    addFavorite(pokemon: FavoritePokemon): void {
        if (!this.isFavorite(pokemon.id)) {
            this.favoritesSignal.update(favorites => [...favorites, pokemon]);
        }
    }

    removeFavorite(id: number): void {
        this.favoritesSignal.update(favorites => favorites.filter(fav => fav.id !== id));
    }

    toggleFavorite(pokemon: FavoritePokemon): void {
        if (this.isFavorite(pokemon.id)) {
            this.removeFavorite(pokemon.id);
        } else {
            this.addFavorite(pokemon);
        }
    }

    private loadFromStorage(): FavoritePokemon[] {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }
    private saveToStorage(favorites: FavoritePokemon[]): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
        } catch (error) {
            console.error('Error al grabar favoritos en localStorage:', error);
        }
    }
}
