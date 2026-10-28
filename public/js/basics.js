// Beginner layer: the "Start here" box on each week and the plain-language line on each dashboard card.
// Written for someone who has never studied operating systems: no jargon without an everyday comparison.

export const BASICS = {
  cpu: {
    plain: 'Many programs want the processor at the same time. Who gets to go first?',
    steps: [
      ['A process is a running program. ', 'Your computer has many programs open, but one processor can only work on one of them at a time, so they take turns.'],
      ['Each process has an arrival time and a burst time. ', 'Arrival is when it joins the line. Burst is how long it needs the processor to finish its work.'],
      ['A scheduling algorithm decides who goes next. ', 'Like the line at a shop counter: different rules for who is served next give very different waiting times.'],
    ],
    read: [['P1 0–5', 'the coloured bar: P1 used the processor from time 0 to 5'], ['idle', 'nobody was waiting, so the processor did nothing'], ['Waiting time', 'how long a process stood in line'], ['Turnaround', 'time from arriving to finishing']],
    try: 'press Play under the chart to watch the processor pick processes one at a time (or Next step to go slowly). Then change the numbers in the table and run it again.',
  },
  memory: {
    plain: 'Programs need a piece of memory to run in. Which free piece should each one get?',
    steps: [
      ['Memory is split into blocks of different sizes. ', 'Think of them as parking spots of different lengths. Here each block can hold one process.'],
      ['Processes come one by one, each asking for some memory. ', 'A process only fits in a block that is at least as big as what it asks for.'],
      ['Leftover space in a block is wasted. ', 'If a process asking for 212 gets a block of 500, the other 288 cannot be used by anyone. This waste is called internal fragmentation.'],
    ],
    read: [['coloured part', 'memory used by a process'], ['empty part', 'leftover space that is wasted'], ['Selected', 'the block chosen for the current process'], ['Too small', 'this block cannot fit the process']],
    try: 'press Play under the blocks to watch each process look for a block (or Next step to go slowly). Then change the sizes and run it again.',
  },
  files: {
    plain: 'A file is too big for one spot on the disk. Where do its pieces go, and how are they found again?',
    steps: [
      ['The disk is a row of numbered boxes, called blocks. ', 'That is the grid on this page. Each box holds a fixed amount of data (512 bytes here).'],
      ['A file bigger than one box is cut into pieces. ', 'Each piece goes into its own box. The question is: which boxes, and how do we find the pieces again later?'],
    ],
    read: {
      sequential: [['A part 1', 'piece 1 of file A']],
      indexed: [['A part 1', 'piece 1 of file A'], ['A index', "the box that lists where file A's pieces are"]],
      linked: [['A part 1', 'piece 1 of file A'], ['→ 4', 'the next piece is in box 4'], ['→ end', 'this is the last piece']],
    },
    try: 'press Play under the disk to watch the files being stored one at a time (or Next step to go slowly). Click a file name to highlight its boxes. Change the files on the left and run it again.',
  },
  deadlock: {
    plain: 'Programs can end up waiting for each other forever. How do we avoid or spot that?',
    steps: [
      ['Processes need resources to finish. ', 'Resources are things like printers or memory. There are only a few copies of each type (types A, B and C here).'],
      ['A deadlock is when processes wait for each other forever. ', 'P1 holds the printer and waits for the scanner, while P2 holds the scanner and waits for the printer. Neither can ever continue.'],
      ['The trick is to find an order in which everyone can finish. ', 'If the free resources are enough for one process to finish, it finishes and gives back everything it held. Repeat. If everyone finishes, the system is safe.'],
    ],
    read: [['solid arrow', 'resource → process: the process holds it now'], ['dashed arrow', 'process → resource: the process still wants it'], ['Need / Request', 'what each process still wants'],
      ['Work', 'free copies at this moment of the check'], ['Safe sequence', 'an order in which every process can finish']],
    try: 'press Play under the picture to watch the algorithm look for a process that can finish (or Next step to go slowly). Then change the numbers and run it again.',
  },
  paging: {
    plain: 'Memory is full and the program needs a new page. Which old page should be thrown out?',
    steps: [
      ['A program is cut into pages. ', 'Only a few pages fit in memory at once. Each slot for a page is called a frame (3 frames here).'],
      ['The reference string is the order the program uses its pages. ', 'For example 7, 0, 1, 2 means: use page 7, then page 0, then 1, then 2.'],
      ['Every use is a hit or a fault. ', 'Hit: the page is already in a frame (fast). Fault: it must be loaded, and if every frame is full, one page has to be thrown out. The algorithm picks which one.'],
    ],
    read: [['Hit (green)', 'the page was already in memory'], ['Fault (red)', 'the page had to be loaded'], ['Frames', 'the slots holding pages right now']],
    try: 'press Play to watch the pages being used one at a time (or Next step to go slowly). Then type your own reference string and run it again.',
  },
};

// One everyday explanation per algorithm, completing "<Name> answers it like this: ...".
export const SIMPLE = {
  fcfs: 'serve processes in the order they arrive, like a queue at a ticket counter. Whoever comes first runs until it is done. Simple, but one long job makes everyone behind it wait.',
  sjf: 'when the processor is free, pick the waiting process that needs the least time, like letting the shopper with one item go first. This gives the lowest average wait, but long jobs can be pushed back again and again.',
  priority: 'every process has a priority number, and the most important waiting process goes next (here a lower number means more important), like an emergency room. Unimportant jobs may wait a very long time.',
  rr: 'everyone gets a short turn (the time quantum, 2 units here) and then goes to the back of the line if not finished, like passing a microphone around a circle. Fair and responsive, but with more switching.',
  first: 'look through the blocks from the top and take the first one that is big enough. Quick, because it stops searching early.',
  best: 'look at every block that is big enough and take the smallest, so the least space is wasted, like choosing the smallest box your item fits in.',
  worst: 'look at every block that is big enough and take the biggest, hoping the large leftover is still useful later. It often uses up the big blocks too early.',
  sequential: 'all pieces of a file go into boxes that sit side by side, like booking cinema seats next to each other. Reading is fast, but a file only fits if there is one gap big enough for all of it.',
  indexed: 'pieces can go into any free boxes. One extra box, the index, keeps the list of where every piece is, like a table of contents.',
  linked: 'pieces can go into any free boxes. Each piece ends with a small note saying which box holds the next piece, like a treasure hunt. The last piece says "end".',
  banker: 'like a careful bank manager. Before handing out resources, check that there is still an order in which every process can finish, even if each asks for its maximum. If not, the request has to wait.',
  detection: 'let processes ask freely, then check now and then: try to find an order in which everyone can finish. Any process left over is deadlocked.',
  fifo: 'throw out the page that has been in memory the longest, like the oldest item in a queue. Simple, but it may throw out a page that is still used a lot.',
  optimal: 'throw out the page that will not be needed for the longest time. This gives the fewest faults possible, but it needs to know the future, so it is used as a yardstick.',
  lru: 'throw out the page that has not been used for the longest time, guessing that the recent past predicts the near future.',
};

// Shared "Start here" box for a week's workspace.
export function introBox(h, moduleId, alg, algName) {
  const b = BASICS[moduleId];
  if (!b) return null;
  const read = Array.isArray(b.read) ? b.read : b.read[alg] || [];
  return h('details', { class: 'intro', open: true }, h('summary', { text: 'New to this topic? Start here' }),
    h('ol', { class: 'intro-steps' },
      b.steps.map(([bold, rest]) => h('li', {}, h('strong', { text: bold }), rest)),
      SIMPLE[alg] ? h('li', {}, h('strong', { text: `${algName} answers it like this: ` }), SIMPLE[alg]) : null),
    read.length ? h('div', { class: 'intro-read' }, h('span', { class: 'qlabel', text: 'Reading the picture' }), read.map(([k, v]) => h('span', {}, h('code', { text: k }), ` = ${v}`))) : null,
    h('p', { class: 'intro-try' }, h('strong', { text: 'Try it: ' }), b.try));
}
