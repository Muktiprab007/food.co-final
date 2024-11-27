import TheRestaurantDbSource from '../../data/restaurant-source';
import { createRestaurantItemTemplate } from '../templates/template-creator';

const Home = {
  async render() {
    return `
      <section class="hero">
        <div class="hero-text">
          <h1>Explore Restaurants</h1>
          <button class="explore" onclick="document.getElementById('restaurants').scrollIntoView({ behavior: 'smooth' })">Explore Now</button>
        </div>
      </section>
      <div class="content" id="content">
        <div id="restaurants" class="restaurants">
          <div id="loadingIndicator" class="loading-spinner" style="display: none;"></div>
          <!-- Restaurant list will be dynamically inserted here -->
          ${[...Array(6)].map(() => `
          <div class="skeleton-item">
            <div class="skeleton-image"></div>
            <div class="skeleton-text"></div>
          </div>`).join('')}
        </div>
      </div>
    `;
  },

  async afterRender() {
    const restaurantsContainer = document.querySelector('#restaurants');
    const loadingIndicator = document.querySelector('#loadingIndicator');

    loadingIndicator.style.display = 'block';

    try {
      const restaurants = await TheRestaurantDbSource.Home(); // Fetch restaurant data

      loadingIndicator.style.display = 'none';

      if (restaurants.length > 0) {
        restaurantsContainer.innerHTML = '';
        restaurants.forEach((restaurant) => {
          restaurantsContainer.innerHTML += createRestaurantItemTemplate(restaurant);
        });
      } else {
        restaurantsContainer.innerHTML = '<p>No restaurants found.</p>';
      }
    } catch (error) {
      loadingIndicator.style.display = 'none';
      restaurantsContainer.innerHTML = '<p>Failed to load restaurants. Please try again later.</p>';
      console.error('Failed to load restaurants:', error);
    }
  },
};

export default Home;
