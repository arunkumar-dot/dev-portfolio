'use client';

interface DiffLineProps {
  line: string;
}

function DiffLine({ line }: DiffLineProps) {
  const isAdd    = line.startsWith('+') || line.startsWith('//  ✅') || line.startsWith('// ✅');
  const isRemove = line.startsWith('-') || line.startsWith('//  ❌') || line.startsWith('// ❌');

  let cls = 'diff-line';
  if (isAdd)    cls += ' diff-line--add';
  if (isRemove) cls += ' diff-line--remove';

  return <div className={cls}>{line}</div>;
}

interface DiffViewerProps {
  before: string[];
  after:  string[];
}

export default function DiffViewer({ before, after }: DiffViewerProps) {
  return (
    <div className="diff-viewer">
      <div className="diff-panel">
        <div className="diff-panel-header diff-panel-header--before">BEFORE</div>
        <div className="diff-code">
          {before.map((line, i) => (
            <DiffLine key={i} line={line} />
          ))}
        </div>
      </div>
      <div className="diff-panel">
        <div className="diff-panel-header diff-panel-header--after">AFTER</div>
        <div className="diff-code">
          {after.map((line, i) => (
            <DiffLine key={i} line={line} />
          ))}
        </div>
      </div>
    </div>
  );
}
