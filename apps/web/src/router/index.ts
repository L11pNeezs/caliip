import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AddFoodEntryView from '../views/AddFoodEntryView.vue'
import NewMealView from '../views/NewMealView.vue'
import MealListView from '../views/MealListView.vue'
import MealView from '../views/MealView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/meals',
      name: 'meals',
      component: MealListView,
    },
    {
      path: '/meals/new',
      name: 'new-meal',
      component: NewMealView,
    },
    {
      path: '/meals/:mealId',
      name: 'meal',
      component: MealView,
      props: true,
    },
    {
      path: '/meals/:mealId/foods/new',
      name: 'add-food-entry',
      component: AddFoodEntryView,
      props: true,
    }
  ],
})
