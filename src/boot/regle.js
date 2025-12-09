import { defineBoot } from '#q-app/wrappers'
import { RegleVuePlugin } from '@regle/core'

export default defineBoot (({ app }) => {
  app.use(RegleVuePlugin)
})

