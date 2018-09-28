import * as sourcegraph from "sourcegraph";
import { Observable, from, EMPTY } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map, concatMap, toArray } from "rxjs/operators";

const fetchDownloads = (pkg: string): Observable<number> => {
  return ajax({
    url: `https://api.npmjs.org/downloads/point/last-week/${pkg}`
  }).pipe(
    map(v => {
      return v && v.response && v.response.downloads ? v.response.downloads : 0;
    })
  );
};

export function activate(): void {
  sourcegraph.workspace.onDidOpenTextDocument.subscribe(doc => {
    from(doc.text.split("\n"))
      .pipe(
        concatMap((line, lineNumber) => {
          const match = /^import.*from .(\w+)/.exec(line);
          if (match && match.length > 1) {
            const pkg = match[1];
            return fetchDownloads(pkg).pipe(
              map(downloads => ({ downloads, lineNumber, pkg }))
            );
          } else {
            return EMPTY;
          }
        }),
        toArray()
      )
      .subscribe(annotations => {
        if (
          sourcegraph.app.activeWindow &&
          sourcegraph.app.activeWindow.visibleViewComponents.length > 0
        ) {
          sourcegraph.app.activeWindow.visibleViewComponents[0].setDecorations(
            null,
            annotations.map(({ downloads, lineNumber, pkg }) => ({
              range: new sourcegraph.Range(
                new sourcegraph.Position(lineNumber, 0),
                new sourcegraph.Position(lineNumber, 0)
              ),
              after: {
                contentText: " View on npm (" + downloads + " DLs last week)",
                linkURL: `https://www.npmjs.com/package/${pkg}`,
                backgroundColor: "pink",
                color: "black"
              }
            }))
          );
        }
      });
  });
}
