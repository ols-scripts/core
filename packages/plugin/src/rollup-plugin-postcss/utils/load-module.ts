import importCwd from 'import-cwd'

export function loadModule(moduleId) {
  // Trying to load module normally (relative to plugin directory)
  try {
    return require(moduleId)
  } catch (err) {
    console.log(err)
  }

  // Then, trying to load it relative to CWD
  return importCwd.silent(moduleId)
}
