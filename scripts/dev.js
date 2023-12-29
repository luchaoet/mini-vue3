import fs from 'fs'
import { execa } from 'execa'

const dirs = fs.readdirSync('packages')
  .filter(p => fs.statSync(`packages/${p}`).isDirectory());

async function build(target) {
  await execa(
    'rollup',
    ['-cw', '--environment', `TARGET:${target}`],
    { stdio: 'inherit' }
  )
}

build('reactivity')
build('shared')