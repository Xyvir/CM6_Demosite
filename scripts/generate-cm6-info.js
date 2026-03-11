const fs = require('fs');
const path = require('path');

const PLUGINS_DIR = path.resolve(__dirname, '../plugins/tiddlywiki');
const OUTPUT_FILE = path.resolve(__dirname, '../cm6-wiki/tiddlywiki.info');

function main() {
    console.log('Dynamically generating cm6-wiki/tiddlywiki.info...');

    if (!fs.existsSync(path.dirname(OUTPUT_FILE))) {
        fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    }

    // Always include plugin-combiner
    const plugins = ['tiddlywiki/plugin-combiner'];

    if (fs.existsSync(PLUGINS_DIR)) {
        const files = fs.readdirSync(PLUGINS_DIR);
        files.forEach(file => {
            if (file.startsWith('codemirror-6')) {
                const stat = fs.statSync(path.join(PLUGINS_DIR, file));
                if (stat.isDirectory()) {
                    plugins.push(`tiddlywiki/${file}`);
                }
            }
        });
    }

    const config = {
        description: "CM6 Demo Wiki (Dynamically Generated)",
        plugins: plugins.sort(),
        themes: [
            "tiddlywiki/vanilla",
            "tiddlywiki/snowwhite"
        ],
        build: {
            index: [
                "--render",
                "$:/core/save/all",
                "index.html",
                "text/plain"
            ]
        }
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(config, null, 4));
    console.log(`Generated ${OUTPUT_FILE} with ${plugins.length} plugins.`);
}

main();
