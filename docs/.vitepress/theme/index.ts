import Theme from 'vitepress/theme'
import HomePage from '../components/HomePage/HomePage.vue'
import Frabic from '../components/Frabic.vue'
export default {
  ...Theme,
  enhanceApp({ app }) {
    app.component('HomePage',HomePage)

    app.component('Frabic',Frabic)
  }
}
