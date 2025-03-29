// Custom SVG icon loader
class IconLoader {
  constructor() {
    this.iconCache = new Map();
  }

  async loadIcon(name) {
    if (this.iconCache.has(name)) {
      return this.iconCache.get(name);
    }

    try {
      const response = await fetch(`/icons/${name}.svg`);
      if (!response.ok) throw new Error(`Icon ${name} not found`);
      const svgText = await response.text();
      this.iconCache.set(name, svgText);
      return svgText;
    } catch (error) {
      console.error('Error loading icon:', error);
      return '';
    }
  }

  async replaceIonIcons() {
    const ionIcons = document.querySelectorAll('ion-icon');
    for (const icon of ionIcons) {
      const name = icon.getAttribute('name');
      if (!name) continue;

      // Remove any suffixes like -outline or -sharp
      const baseName = name.replace(/-(?:outline|sharp)$/, '');
      
      const svgContent = await this.loadIcon(baseName);
      if (svgContent) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = svgContent;
        const svg = tempDiv.querySelector('svg');
        if (svg) {
          svg.classList.add('custom-icon');
          icon.replaceWith(svg);
        }
      }
    }
  }
}

// Initialize and run the icon loader
const iconLoader = new IconLoader();
document.addEventListener('DOMContentLoaded', () => {
  iconLoader.replaceIonIcons();
});