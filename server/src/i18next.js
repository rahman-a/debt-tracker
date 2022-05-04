import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
import i18next from 'i18next'
import i18nextMiddleware from 'i18next-http-middleware'
import backend from 'i18next-fs-backend'

i18next
  .use(backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: path.join(__dirname, '../locales/{{lng}}/translation.json'),
    },
  })

export default i18next
