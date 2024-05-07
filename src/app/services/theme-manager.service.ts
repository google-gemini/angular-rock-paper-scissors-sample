import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {Injectable, PLATFORM_ID, inject} from '@angular/core';

// Keep these constants in sync with the code in index.html
export const DARK_MODE_CLASS_NAME = 'dark-mode';
export const LIGHT_MODE_CLASS_NAME = 'light-mode';
export const PREFERS_COLOR_SCHEME_DARK = '(prefers-color-scheme: dark)';

@Injectable({
  providedIn: 'root',
})
export class ThemeManager {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  public watchPreferredColorScheme() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      const preferedScheme = event.matches ? 'dark' : 'light';
      this.setThemeBodyClasses(preferedScheme);
    });
  }

  // Set theme classes on the body element
  private setThemeBodyClasses(theme: 'dark' | 'light'): void {
    const documentClassList = this.document.documentElement.classList;
    if (theme === 'dark') {
      documentClassList.add(DARK_MODE_CLASS_NAME);
      documentClassList.remove(LIGHT_MODE_CLASS_NAME);
    } else {
      documentClassList.add(LIGHT_MODE_CLASS_NAME);
      documentClassList.remove(DARK_MODE_CLASS_NAME);
    }
  }
}
