import { componentLabels } from './component-labels'
import { avaraLabels, avaraNames } from './avara-catalog'
export const allComponentLabels = { ...componentLabels, ...avaraLabels }
export const allComponentNames = [
  ...Object.keys(componentLabels),
  ...avaraNames,
]
export function matchesComponent(name: string, query: string) {
  return `${allComponentLabels[name]} ${name} ${componentLibrary(name)}`
    .toLowerCase()
    .includes(query.toLowerCase())
}
export function componentLibrary(name: string) {
  return name.startsWith('avara/') ? 'AvaraUI' : 'TuffUI'
}
