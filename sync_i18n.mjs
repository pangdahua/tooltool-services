import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const localesDir = path.join(__dirname, 'i18n', 'locales')

async function loadJSON(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (err) {
    console.error(`Error loading ${filePath}:`, err.message)
    return null
  }
}

function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) {
        target[key] = {}
      }
      deepMerge(target[key], source[key])
    } else if (!(key in target)) {
      target[key] = source[key]
    }
  }
  return target
}

async function syncLocales() {
  console.log('=== 同步语言包 ===\n')
  
  const referencePath = path.join(localesDir, 'zh-CN.json')
  const referenceData = await loadJSON(referencePath)
  
  if (!referenceData) {
    console.error('无法加载参考语言包')
    return
  }
  
  const localeFiles = ['en.json', 'ja.json', 'ko.json', 'zh-TW.json']
  
  for (const file of localeFiles) {
    const filePath = path.join(localesDir, file)
    const targetData = await loadJSON(filePath)
    
    if (!targetData) {
      console.error(`跳过 ${file} (加载失败)\n`)
      continue
    }
    
    const mergedData = deepMerge(targetData, referenceData)
    
    await fs.writeFile(filePath, JSON.stringify(mergedData, null, 2))
    console.log(`✓ ${file} 同步完成`)
  }
  
  console.log('\n=== 所有语言包同步完成 ===')
}

syncLocales()
