import * as sourcegraph from "sourcegraph";

const tokenAt = (text: string, pos: sourcegraph.Position): string => {
  var line = text.split("\n")[pos.line];

  const leftMatches = /\w+$/.exec(line.slice(0, pos.character));
  const rightMatches = /^\w+/.exec(line.slice(pos.character));

  if (!leftMatches && !rightMatches) {
    return null;
  } else if (!leftMatches) {
    return rightMatches && rightMatches[0];
  } else if (!rightMatches) {
    return leftMatches && leftMatches[0];
  } else {
    return leftMatches[0] + rightMatches[0];
  }
};

const highlightMatchingLines = (text, token) => {
  sourcegraph.app.activeWindow.visibleViewComponents[0].setDecorations(
    null,
    text
      .split("\n")
      .map((line, i) => [i, line] as [number, string])
      .filter(([_, line]) => new RegExp("\\b" + token + "\\b").test(line))
      .map(([i, _]) => ({
        range: new sourcegraph.Range(
          new sourcegraph.Position(i, 0),
          new sourcegraph.Position(i, 0)
        ),
        backgroundColor: "khaki"
      }))
  );
};

export function activate(): void {
  sourcegraph.languages.registerHoverProvider(["*"], {
    provideHover: (doc, pos) => {
      const token = tokenAt(doc.text, pos);

      if (token) {
        highlightMatchingLines(doc.text, token);
      }

      return null;
    }
  });
}
