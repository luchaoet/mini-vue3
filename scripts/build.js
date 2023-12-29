import fs from 'fs'
import { execa } from 'execa'

const dirs = fs.readdirSync('packages')
  .filter(p => fs.statSync(`packages/${p}`).isDirectory());

async function build(target) {
  await execa(
    'rollup',
    ['-c', '--environment', `TARGET:${target}`],
    { stdio: 'inherit' }
  )
}

async function runParallel(dirs, itemFn) {
  const ret = [];
  for (const item of dirs) {
    ret.push(itemFn(item))
  }
  return Promise.all(ret)
}

runParallel(dirs, build).then(() => {
  console.log('success')
})