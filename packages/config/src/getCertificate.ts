import mkcert from 'mkcert'
import fs from 'fs'
import path from 'path'
import logger from '@ols-scripts/util/logger'

function generateCA(CADir) {
  return new Promise((resolve, reject) => {
    mkcert
      .createCA({
        organization: 'Ols Team',
        countryCode: 'CN',
        state: 'ZJ',
        locality: 'HZ',
        validityDays: 3650,
      })
      .then((ca) => {
        if (!fs.existsSync(CADir)) {
          // create OLS_CA folder if not exists
          fs.mkdirSync(CADir)
        }
        const keyPath = path.join(CADir, 'rootCa.key')
        const certPath = path.join(CADir, 'rootCa.crt')
        fs.writeFileSync(keyPath, ca.key)
        fs.writeFileSync(certPath, ca.cert)
        resolve({
          key: keyPath,
          cert: certPath,
        })
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export default async function getCertificate(homeDir) {
  const CADir = path.join(homeDir, 'OLS_CA')
  const certPath = path.join(CADir, 'rootCa.crt')
  const keyPath = path.join(CADir, 'rootCa.key')

  if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
    await generateCA(CADir)
  }

  logger.info('当前使用的 HTTPS 证书为手动创建(如有需要请手动信任此文件)')

  return new Promise((resolve, reject) => {
    mkcert
      .createCert({
        domains: ['127.0.0.1', 'localhost'],
        validityDays: 365,
        caKey: fs.readFileSync(keyPath),
        caCert: fs.readFileSync(certPath),
      })
      .then(resolve)
      .catch(reject)
  })
}
