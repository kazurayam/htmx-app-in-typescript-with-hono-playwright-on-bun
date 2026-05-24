// find-native-modules.js
// Scans node_modules to identify packages with native bindings
// quoted from https://oneuptime.com/blog/post/2026-01-31-bun-nodejs-compatibility/view

import fs from 'fs';
import path from 'path';

interface NativeModule {
    name: string;
    indicator: string;
}

function findNativeModules(nodeModulesPath: string) {
    const nativeModules: NativeModule[] = [];

    if (!fs.existsSync(nodeModulesPath)) {
        console.log('node_modules not found');
        return nativeModules;
    }

    const packages = fs.readdirSync(nodeModulesPath);

    packages.forEach(pkg => {
        // Skip hidden folders and scoped packages root
        if (pkg.startsWith('.')) return;

        const pkgPath = path.join(nodeModulesPath, pkg);

        // Handle scoped packages
        if (pkg.startsWith('@')) {
            const scopedPkgs = fs.readdirSync(pkgPath);
            scopedPkgs.forEach(scopedPkg => {
                checkForNativeBindings(
                    path.join(pkgPath, scopedPkg),
                    `${pkg}/${scopedPkg}`,
                    nativeModules
                );
            });
        } else {
            checkForNativeBindings(pkgPath, pkg, nativeModules);
        }
    });

    return nativeModules;
}

function checkForNativeBindings(pkgPath: string, pkgName: string, results: NativeModule[]) {
    // Check for common native module indicators
    const indicators = ['binding.gyp', 'bindings', 'prebuilds'];

    indicators.forEach(indicator => {
        if (fs.existsSync(path.join(pkgPath, indicator))) {
            results.push({ name: pkgName, indicator: indicator });
        }
    });
}

const natives = findNativeModules('./node_modules');
console.log('Native modules found:', natives);
