export default function processNodeEnv(command) {
  switch (command) {
    case 'dev':
      process.env.NODE_ENV = 'development'
      break
    case 'build':
      process.env.NODE_ENV = 'production'
      break
    default:
      process.env.NODE_ENV = 'production'
  }
}
