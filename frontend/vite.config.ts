import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        {
            name: 'remove-console-debugger',
            apply: 'build',
            transform(code) {
                return {
                    code: code
                        .replace(/console\.log\([^)]*\);?/g, '')
                        .replace(/debugger;?/g, ''),
                    map: null
                }
            }
        }
    ]
})