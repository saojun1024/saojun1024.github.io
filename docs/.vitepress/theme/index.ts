import Theme from 'vitepress/theme'
import HomePage from '../components/HomePage/HomePage.vue'
export default {
  ...Theme,
  enhanceApp({ app }) {
    app.component('HomePage',HomePage)
  }
}
