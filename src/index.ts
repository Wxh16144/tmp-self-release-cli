import fs from "fs";
import { fileURLToPath } from 'url';
import path from "path";
import c from "kleur";
import mri from "mri";
import terminalLink from 'terminal-link';
import { Argv } from "./type";
import { run } from './main'
import prompts from 'prompts'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolvePath = (...arg: any[]) => path.resolve(__dirname, '..', ...arg);
const readFileSync = (path: string) => fs.readFileSync(resolvePath(path), 'utf8');
const pkg = JSON.parse(readFileSync('./package.json'));
const command = Object.keys(pkg.bin ?? {})[0] ?? pkg.name;
// const moduleName = pkg.name.replace(/^@.*\//, '')

const argv = mri<Argv>(process.argv.slice(2), {
  alias: { h: 'help', v: 'version' },
  boolean: [
    'major',
    'minor',
    'patch',
  ]
});

async function main(args: Argv = argv) {
  if (args.version) {
    console.log(`${c.bold(pkg.name)}: ${c.green('v' + pkg.version)}`);
    return;
  }

  if (args.help) {
    console.log(`
    npx ${c.bold(command)} [options]
    ----------------------------------------
    -${c.bold('h')}, --help: show help.
    -${c.bold('v')}, --version: show version. ${c.green('v' + pkg.version)}
    see more: ${c.gray(terminalLink(pkg.homepage, pkg.homepage))}
    ----------------------------------------
    ${c.bold('e.g.')} ${c.green(`${command} -h`)} 
  `)
    return;
  }

 run(args)
}

async function main2(){
  // input preid
  // select major, minor, patch

  const response = await prompts([
    {
      type: 'text',
      name: 'preid',
      message: '选择一个预发布标识符:',
      initial: 'mac'
    },
    {
      type: 'select',
      name: 'value',
      message: '选择一个版本类型:',
      choices: [
        { title: 'Major', value: 0 },
        { title: 'Minor', value: 1 },
        { title: 'Patch', value: 2 }
      ],
      initial: 1
    }
  ]);

  // 如果是 ctrl + c 退出
  if(Object.keys(response).length !== 2) process.exit(0);

  const config = {
    preid: response.preid,
    major: response.value === 0,
    minor: response.value === 1,
    patch: response.value === 2,
  }
  
  run(config as any)

}
export default main2
// export default main;
