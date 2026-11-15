import { avaraLabels, avaraNames } from './avara-catalog'
import { componentLabels, componentNames } from './component-labels'
export const allComponentLabels = { ...componentLabels, ...avaraLabels }
export const allComponentNames = [...componentNames, ...avaraNames]
export function matchesComponent(name: string, query: string) {
  return `${allComponentLabels[name]} ${name} ${componentLibrary(name)}`
    .toLowerCase()
    .includes(query.toLowerCase())
}
export function componentLibrary(name: string) {
  return name.startsWith('avara/') ? 'AvaraUI' : 'TuffUI'
}
