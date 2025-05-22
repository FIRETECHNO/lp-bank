import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import colors from 'vuetify/util/colors'


export default defineNuxtPlugin((nuxtApp) => {
	const vuetify = createVuetify({
		theme: {
			themes: {
				light: {
					dark: false,
					colors: {
						primary: "#057D9F", // #057D9F
						secondary: "#1435AD", // #1435AD,
						secondary2: "#00BB3F"
					}
				},
			},
		},
		defaults: {
			// VBtn: {
			// 	style: 'text-transform: none; letter-spacing: normal',
			// },
			global: {
				ripple: false,
			},
		},
		ssr: true,
	})

	nuxtApp.vueApp.use(vuetify)
})
