declare const MARKDOWNFUNCTIONLOCATION: any;

const markdownProcessor = (
    doc: string
): { metadata: any; body: string; error: boolean; errorText: string } => {
    /* stolen with modification from https://github.com/caolan/wmd/blob/master/lib/preprocessors.js */
    let key;
    const lines = doc.split("\n");
    let metadata: any = {};
    let emptyLine = false;

    while (lines.length) {
        var match = /^(\S+):\s*(.*)$/.exec(lines[0]);
        if (match) {
            if (emptyLine) {
                return {
                    metadata,
                    body: lines.join("\n"),
                    error: true,
                    errorText: "Empty line in metadata above; " + lines[0]
                };
            }
            key = match[1];
            metadata[key] = match[2];
            lines.shift();
        } else {
            var continued_value = /^\s+(.+)$/.exec(lines[0]);
            if (/^\s*$/.exec(lines[0])) {
                emptyLine = true;
                lines.shift();
            } else if (continued_value && key) {
                if (emptyLine) {
                    console.log("Empty line in metadata above; " + lines[0]);
                    return {
                        metadata,
                        body: lines.join("\n"),
                        error: true,
                        errorText: "Empty line in metadata above; " + lines[0]
                    };
                }
                metadata[key] += "\n" + continued_value[1];
                lines.shift();
            } else break;
        }
    }

    let content = lines.join("\n");

    if (MARKDOWNFUNCTIONLOCATION) {
        const markdownFunctions = require(MARKDOWNFUNCTIONLOCATION);
        for (let fun of markdownFunctions) {
            content = fun(metadata, content);
        }
    }

    return { metadata, body: content, error: false, errorText: "" };
};

export default markdownProcessor;