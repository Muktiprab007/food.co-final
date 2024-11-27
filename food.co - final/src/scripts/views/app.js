import DrawerInitiator from '../utils/drawer-initiator';
import UrlParser from '../routes/url-parser';
import routes from '../routes/routes';

class App {
  constructor({ button, drawer, content }) {
    this._button = button;
    this._drawer = drawer;
    this._content = content;

    this._initialAppShell();
  }

  _initialAppShell() {
    DrawerInitiator.init({
      button: this._button,
      drawer: this._drawer,
      content: this._content,
    });
  }

  _initializeSkipLink() {
    const skipLinkElem = document.querySelector('.skip-link');
    if (skipLinkElem) {
      skipLinkElem.addEventListener('click', (event) => {
        event.preventDefault();

        let targetId = 'restaurants';
        const currentPath = window.location.hash;

        if (currentPath.includes('detail')) {
          targetId = 'hero--text';
        } else if (currentPath.includes('favorite')) {
          targetId = 'content__heading';
        }

        const mainContent = document.querySelector(`#${targetId}`);
        if (mainContent) {
          mainContent.setAttribute('tabindex', '-1');
          mainContent.focus();
        } else {
          console.error(`#${targetId} not found`);
        }
      });
    } else {
      console.error('.skip-link not found');
    }
  }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();
    const page = routes[url];
    if (!page) {
      console.error('Page not found for URL:', url);
      this._content.innerHTML = '<h2>Page not found</h2>';
      return;
    }
    this._content.innerHTML = await page.render();
    await page.afterRender();
    this._initializeSkipLink();
  }
}

export default App;
