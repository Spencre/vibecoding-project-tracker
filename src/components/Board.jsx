import Column from './Column.jsx';

/** The four-column Kanban board. Columns come from STAGES, in order. */
export default function Board({ stages, tasks, team, onOpen, onHandOff, onCopy, onMove }) {
  return (
    <main id="board" tabIndex={-1} className="grid grid-cols-1 gap-4 focus:outline-none md:grid-cols-2 xl:grid-cols-4">
      {stages.map((stage) => (
        <Column
          key={stage.id}
          stage={stage}
          tasks={tasks.filter((task) => task.status === stage.id)}
          team={team}
          onOpen={onOpen}
          onHandOff={onHandOff}
          onCopy={onCopy}
          onMove={onMove}
        />
      ))}
    </main>
  );
}
