/// <reference types="vitest" />
import { defineConfig, mergeConfig } from 'vite'
import viteConfig from './vite.config'

// https://vitest.dev/config/file.html
export default mergeConfig(viteConfig, defineConfig({
  test: {
    environment: 'happy-dom'
  }
}))
