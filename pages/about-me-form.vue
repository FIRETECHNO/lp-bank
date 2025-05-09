<script setup lang="ts">
import type { ComponentListItem } from '~/types/component-list';

import { AboutMePersonal, AboutMePartnerFilters } from '#components';

const steps: ComponentListItem[] =
  [
    {
      id: "step1", component: AboutMePersonal,
      eventHandlers: {
        next: () => {
          nextStep()
        },
        prev: () => {
          prevStep()
        }
      }
    },
    {
      id: "step2", component: AboutMePartnerFilters,
      eventHandlers: {
        next: () => {
          nextStep()
        },
        prev: () => {
          prevStep()
        }
      }
    },
  ]

const {
  currentComponentItem,
  currentActualComponent,
  currentProps,
  currentId,
  next: nextStep,
  prev: prevStep,
  canGoNext,
  canGoPrev,
  size,
  eventHandlers
} = useComponentNavigator(steps);
</script>
<template>
  <v-container>
    <v-row class="d-flex justify-center align-center">
      <v-col cols="12" sm="10" md="7" xl="6">
        <transition name="fade-step" mode="out-in">
          <Component v-if="currentActualComponent" :is="currentActualComponent" :key="currentId" v-bind="currentProps"
            v-on="eventHandlers" />
          <div v-else-if="size === 0">
            No steps defined.
          </div>
          <div v-else>
            End of navigation or an issue. Current Node: {{ !!currentComponentItem }}
          </div>
        </transition>
      </v-col>
    </v-row>
  </v-container>
</template>
<style></style>