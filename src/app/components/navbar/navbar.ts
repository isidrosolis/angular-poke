import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { FavoritesService } from '../../services/favorites.service';

@Component({
    selector: 'app-navbar',
    imports: [
        CommonModule,
        RouterModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatBadgeModule,
        MatMenuModule
    ],
    templateUrl: './navbar.html',
    styleUrl: './navbar.scss'
})
export class NavbarComponent {
    private readonly router = inject(Router);
    private readonly favoritesService = inject(FavoritesService);

    favoritesCount = this.favoritesService.favoritesCount;
    mobileMenuOpen = signal(false);

    toggleMobileMenu(): void {
        this.mobileMenuOpen.update(value => !value);
    }

    closeMobileMenu(): void {
        this.mobileMenuOpen.set(false);
    }

    navigate(route: string): void {
        this.router.navigate([route]);
        this.closeMobileMenu();
    }
}
