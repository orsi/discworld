import * as fs from 'fs';
import * as path from 'path';

export function load (target: string, scripts: any[] = [], level?: number) {
    // indentation for subdirectories
    let indent = '  ';
    if (!level) level = 0;
    for (let i = 0; i < level; i++) {
        indent += indent;
    }
    const base = path.basename(target);
    const stat = fs.lstatSync(target);
    if (stat.isDirectory()) {
        // increase indent and read new sub dir
        console.log(`${indent}${base}/`);
        ++level;
        const files = fs.readdirSync(target);
        for (let i = 0; i < files.length; i++) {
            load(path.join(target, files[i]), scripts, level);
        }
    } else {
        // file found, check if javascript file
        if (path.extname(target) === '.js') {
            console.log(`${indent}─ ${base}`);
            scripts.push(require(target));
        }
    }
    return scripts;
}