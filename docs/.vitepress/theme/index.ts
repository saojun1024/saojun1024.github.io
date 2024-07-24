import Theme from 'vitepress/theme'
import HomePage from '../components/HomePage/HomePage.vue'
import Frabic from '../components/Frabic.vue'
import Works from '../components/Works.vue'
import RobotCar from '../components/RobotCar.vue'

export default {
  ...Theme,
  enhanceApp({ app }) {
    app.component('HomePage',HomePage)
    app.component('Frabic',Frabic)
    app.component('Works',Works)
    app.component('RobotCar',RobotCar)
  }
}
