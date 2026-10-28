// Reference programs shown in the Code tab. Each one hard-codes the simulator's default sample input
// and prints the same results the simulator shows for it.
export const CODE = {
  fcfs: {
    c: String.raw`#include <stdio.h>

#define N 4  /* number of processes */

int main(void)
{
    /* Sample input (the simulator's default). Change these values to try your own input. */
    const char *name[N] = {"P1", "P2", "P3", "P4"};
    int arrival[N] = {0, 1, 2, 3};
    int burst[N] = {5, 3, 8, 6};

    int order[N];                 /* process numbers, sorted by arrival time */
    int start[N], completion[N];  /* when each process started and finished */

    /* Step 1: sort the processes by arrival time.
       Insertion sort keeps processes that arrive together in their input order. */
    for (int i = 0; i < N; i++) {
        int j = i;
        while (j > 0 && arrival[order[j - 1]] > arrival[i]) {
            order[j] = order[j - 1];
            j--;
        }
        order[j] = i;
    }

    /* Step 2: run every process to the end, one after another, in that order. */
    int t = 0;  /* the current time on the clock */
    printf("First Come, First Served (FCFS)\n\n");
    printf("Gantt chart: ");
    for (int k = 0; k < N; k++) {
        int p = order[k];
        /* If the next process has not arrived yet, the CPU sits idle until it does. */
        if (t < arrival[p]) {
            printf("| idle %d-%d ", t, arrival[p]);
            t = arrival[p];
        }
        start[p] = t;
        t += burst[p];  /* FCFS never interrupts a running process */
        completion[p] = t;
        printf("| %s %d-%d ", name[p], start[p], completion[p]);
    }
    printf("|\n\n");

    /* Step 3: work out the times for every process and print the table. */
    double totalWaiting = 0, totalTurnaround = 0, totalResponse = 0;
    printf("%-8s%8s%7s%12s%12s%9s%10s\n", "Process", "Arrival", "Burst",
           "Completion", "Turnaround", "Waiting", "Response");
    for (int i = 0; i < N; i++) {
        int turnaround = completion[i] - arrival[i];  /* arrival until finish */
        int waiting = turnaround - burst[i];          /* time spent waiting in the queue */
        int response = start[i] - arrival[i];         /* arrival until it first got the CPU */
        totalWaiting += waiting;
        totalTurnaround += turnaround;
        totalResponse += response;
        printf("%-8s%8d%7d%12d%12d%9d%10d\n", name[i], arrival[i], burst[i],
               completion[i], turnaround, waiting, response);
    }

    /* Step 4: averages over all processes. */
    printf("\nAverage waiting time    : %.2f\n", totalWaiting / N);
    printf("Average turnaround time : %.2f\n", totalTurnaround / N);
    printf("Average response time   : %.2f\n", totalResponse / N);
    return 0;
}
`,
    cpp: String.raw`#include <iostream>
#include <iomanip>
#include <string>
#include <vector>
using namespace std;

int main()
{
    // Sample input (the simulator's default). Change these values to try your own input.
    vector<string> name = {"P1", "P2", "P3", "P4"};
    vector<int> arrival = {0, 1, 2, 3};
    vector<int> burst = {5, 3, 8, 6};
    int n = (int)name.size();

    vector<int> order(n);                    // process numbers, sorted by arrival time
    vector<int> start(n), completion(n);     // when each process started and finished

    // Step 1: sort the processes by arrival time.
    // Insertion sort keeps processes that arrive together in their input order.
    for (int i = 0; i < n; i++) {
        int j = i;
        while (j > 0 && arrival[order[j - 1]] > arrival[i]) {
            order[j] = order[j - 1];
            j--;
        }
        order[j] = i;
    }

    // Step 2: run every process to the end, one after another, in that order.
    int t = 0;  // the current time on the clock
    cout << "First Come, First Served (FCFS)\n\n";
    cout << "Gantt chart: ";
    for (int k = 0; k < n; k++) {
        int p = order[k];
        // If the next process has not arrived yet, the CPU sits idle until it does.
        if (t < arrival[p]) {
            cout << "| idle " << t << "-" << arrival[p] << " ";
            t = arrival[p];
        }
        start[p] = t;
        t += burst[p];  // FCFS never interrupts a running process
        completion[p] = t;
        cout << "| " << name[p] << " " << start[p] << "-" << completion[p] << " ";
    }
    cout << "|\n\n";

    // Step 3: work out the times for every process and print the table.
    double totalWaiting = 0, totalTurnaround = 0, totalResponse = 0;
    cout << left << setw(8) << "Process" << right << setw(8) << "Arrival" << setw(7) << "Burst"
         << setw(12) << "Completion" << setw(12) << "Turnaround" << setw(9) << "Waiting"
         << setw(10) << "Response" << "\n";
    for (int i = 0; i < n; i++) {
        int turnaround = completion[i] - arrival[i];  // arrival until finish
        int waiting = turnaround - burst[i];          // time spent waiting in the queue
        int response = start[i] - arrival[i];         // arrival until it first got the CPU
        totalWaiting += waiting;
        totalTurnaround += turnaround;
        totalResponse += response;
        cout << left << setw(8) << name[i] << right << setw(8) << arrival[i] << setw(7) << burst[i]
             << setw(12) << completion[i] << setw(12) << turnaround << setw(9) << waiting
             << setw(10) << response << "\n";
    }

    // Step 4: averages over all processes.
    cout << fixed << setprecision(2);
    cout << "\nAverage waiting time    : " << totalWaiting / n << "\n";
    cout << "Average turnaround time : " << totalTurnaround / n << "\n";
    cout << "Average response time   : " << totalResponse / n << "\n";
    return 0;
}
`,
    java: String.raw`import java.util.Locale;

public class Main {
    public static void main(String[] args) {
        // Sample input (the simulator's default). Change these values to try your own input.
        String[] name = {"P1", "P2", "P3", "P4"};
        int[] arrival = {0, 1, 2, 3};
        int[] burst = {5, 3, 8, 6};
        int n = name.length;

        int[] order = new int[n];                              // process numbers, sorted by arrival time
        int[] start = new int[n], completion = new int[n];     // when each process started and finished

        // Step 1: sort the processes by arrival time.
        // Insertion sort keeps processes that arrive together in their input order.
        for (int i = 0; i < n; i++) {
            int j = i;
            while (j > 0 && arrival[order[j - 1]] > arrival[i]) {
                order[j] = order[j - 1];
                j--;
            }
            order[j] = i;
        }

        // Step 2: run every process to the end, one after another, in that order.
        int t = 0;  // the current time on the clock
        System.out.print("First Come, First Served (FCFS)\n\n");
        System.out.print("Gantt chart: ");
        for (int k = 0; k < n; k++) {
            int p = order[k];
            // If the next process has not arrived yet, the CPU sits idle until it does.
            if (t < arrival[p]) {
                System.out.print("| idle " + t + "-" + arrival[p] + " ");
                t = arrival[p];
            }
            start[p] = t;
            t += burst[p];  // FCFS never interrupts a running process
            completion[p] = t;
            System.out.print("| " + name[p] + " " + start[p] + "-" + completion[p] + " ");
        }
        System.out.print("|\n\n");

        // Step 3: work out the times for every process and print the table.
        double totalWaiting = 0, totalTurnaround = 0, totalResponse = 0;
        System.out.print(String.format("%-8s%8s%7s%12s%12s%9s%10s\n", "Process", "Arrival", "Burst",
                "Completion", "Turnaround", "Waiting", "Response"));
        for (int i = 0; i < n; i++) {
            int turnaround = completion[i] - arrival[i];  // arrival until finish
            int waiting = turnaround - burst[i];          // time spent waiting in the queue
            int response = start[i] - arrival[i];         // arrival until it first got the CPU
            totalWaiting += waiting;
            totalTurnaround += turnaround;
            totalResponse += response;
            System.out.print(String.format("%-8s%8d%7d%12d%12d%9d%10d\n", name[i], arrival[i], burst[i],
                    completion[i], turnaround, waiting, response));
        }

        // Step 4: averages over all processes (Locale.US so the decimal point is always a dot).
        System.out.print(String.format(Locale.US, "\nAverage waiting time    : %.2f\n", totalWaiting / n));
        System.out.print(String.format(Locale.US, "Average turnaround time : %.2f\n", totalTurnaround / n));
        System.out.print(String.format(Locale.US, "Average response time   : %.2f\n", totalResponse / n));
    }
}
`,
  },

  sjf: {
    c: String.raw`#include <stdio.h>

#define N 4  /* number of processes */

int main(void)
{
    /* Sample input (the simulator's default). Change these values to try your own input. */
    const char *name[N] = {"P1", "P2", "P3", "P4"};
    int arrival[N] = {0, 1, 2, 3};
    int burst[N] = {5, 3, 8, 6};

    int start[N], completion[N];  /* when each process started and finished */
    int done[N] = {0};            /* 1 once a process has finished */
    int finished = 0, t = 0;      /* t is the current time on the clock */

    printf("Shortest Job First (SJF, non-preemptive)\n\n");
    printf("Gantt chart: ");
    while (finished < N) {
        /* Step 1: among processes that have arrived and are not done, pick the shortest. */
        int best = -1;
        for (int i = 0; i < N; i++) {
            if (done[i] || arrival[i] > t)
                continue;
            /* Smaller burst wins. On a tie the earlier arrival wins, and if that ties too
               the process listed first (P1 before P2) wins, because we only switch on "better". */
            if (best == -1 || burst[i] < burst[best] ||
                (burst[i] == burst[best] && arrival[i] < arrival[best]))
                best = i;
        }

        /* Step 2: if nobody has arrived yet, the CPU is idle until the next arrival. */
        if (best == -1) {
            int next = -1;
            for (int i = 0; i < N; i++)
                if (!done[i] && (next == -1 || arrival[i] < next))
                    next = arrival[i];
            printf("| idle %d-%d ", t, next);
            t = next;
            continue;
        }

        /* Step 3: run the chosen process to the end (non-preemptive = no interruptions). */
        start[best] = t;
        t += burst[best];
        completion[best] = t;
        done[best] = 1;
        finished++;
        printf("| %s %d-%d ", name[best], start[best], completion[best]);
    }
    printf("|\n\n");

    /* Step 4: work out the times for every process and print the table. */
    double totalWaiting = 0, totalTurnaround = 0, totalResponse = 0;
    printf("%-8s%8s%7s%12s%12s%9s%10s\n", "Process", "Arrival", "Burst",
           "Completion", "Turnaround", "Waiting", "Response");
    for (int i = 0; i < N; i++) {
        int turnaround = completion[i] - arrival[i];  /* arrival until finish */
        int waiting = turnaround - burst[i];          /* time spent waiting in the queue */
        int response = start[i] - arrival[i];         /* arrival until it first got the CPU */
        totalWaiting += waiting;
        totalTurnaround += turnaround;
        totalResponse += response;
        printf("%-8s%8d%7d%12d%12d%9d%10d\n", name[i], arrival[i], burst[i],
               completion[i], turnaround, waiting, response);
    }

    printf("\nAverage waiting time    : %.2f\n", totalWaiting / N);
    printf("Average turnaround time : %.2f\n", totalTurnaround / N);
    printf("Average response time   : %.2f\n", totalResponse / N);
    return 0;
}
`,
    cpp: String.raw`#include <iostream>
#include <iomanip>
#include <string>
#include <vector>
using namespace std;

int main()
{
    // Sample input (the simulator's default). Change these values to try your own input.
    vector<string> name = {"P1", "P2", "P3", "P4"};
    vector<int> arrival = {0, 1, 2, 3};
    vector<int> burst = {5, 3, 8, 6};
    int n = (int)name.size();

    vector<int> start(n), completion(n);  // when each process started and finished
    vector<bool> done(n, false);          // true once a process has finished
    int finished = 0, t = 0;              // t is the current time on the clock

    cout << "Shortest Job First (SJF, non-preemptive)\n\n";
    cout << "Gantt chart: ";
    while (finished < n) {
        // Step 1: among processes that have arrived and are not done, pick the shortest.
        int best = -1;
        for (int i = 0; i < n; i++) {
            if (done[i] || arrival[i] > t)
                continue;
            // Smaller burst wins. On a tie the earlier arrival wins, and if that ties too
            // the process listed first (P1 before P2) wins, because we only switch on "better".
            if (best == -1 || burst[i] < burst[best] ||
                (burst[i] == burst[best] && arrival[i] < arrival[best]))
                best = i;
        }

        // Step 2: if nobody has arrived yet, the CPU is idle until the next arrival.
        if (best == -1) {
            int next = -1;
            for (int i = 0; i < n; i++)
                if (!done[i] && (next == -1 || arrival[i] < next))
                    next = arrival[i];
            cout << "| idle " << t << "-" << next << " ";
            t = next;
            continue;
        }

        // Step 3: run the chosen process to the end (non-preemptive = no interruptions).
        start[best] = t;
        t += burst[best];
        completion[best] = t;
        done[best] = true;
        finished++;
        cout << "| " << name[best] << " " << start[best] << "-" << completion[best] << " ";
    }
    cout << "|\n\n";

    // Step 4: work out the times for every process and print the table.
    double totalWaiting = 0, totalTurnaround = 0, totalResponse = 0;
    cout << left << setw(8) << "Process" << right << setw(8) << "Arrival" << setw(7) << "Burst"
         << setw(12) << "Completion" << setw(12) << "Turnaround" << setw(9) << "Waiting"
         << setw(10) << "Response" << "\n";
    for (int i = 0; i < n; i++) {
        int turnaround = completion[i] - arrival[i];  // arrival until finish
        int waiting = turnaround - burst[i];          // time spent waiting in the queue
        int response = start[i] - arrival[i];         // arrival until it first got the CPU
        totalWaiting += waiting;
        totalTurnaround += turnaround;
        totalResponse += response;
        cout << left << setw(8) << name[i] << right << setw(8) << arrival[i] << setw(7) << burst[i]
             << setw(12) << completion[i] << setw(12) << turnaround << setw(9) << waiting
             << setw(10) << response << "\n";
    }

    cout << fixed << setprecision(2);
    cout << "\nAverage waiting time    : " << totalWaiting / n << "\n";
    cout << "Average turnaround time : " << totalTurnaround / n << "\n";
    cout << "Average response time   : " << totalResponse / n << "\n";
    return 0;
}
`,
    java: String.raw`import java.util.Locale;

public class Main {
    public static void main(String[] args) {
        // Sample input (the simulator's default). Change these values to try your own input.
        String[] name = {"P1", "P2", "P3", "P4"};
        int[] arrival = {0, 1, 2, 3};
        int[] burst = {5, 3, 8, 6};
        int n = name.length;

        int[] start = new int[n], completion = new int[n];  // when each process started and finished
        boolean[] done = new boolean[n];                    // true once a process has finished
        int finished = 0, t = 0;                            // t is the current time on the clock

        System.out.print("Shortest Job First (SJF, non-preemptive)\n\n");
        System.out.print("Gantt chart: ");
        while (finished < n) {
            // Step 1: among processes that have arrived and are not done, pick the shortest.
            int best = -1;
            for (int i = 0; i < n; i++) {
                if (done[i] || arrival[i] > t)
                    continue;
                // Smaller burst wins. On a tie the earlier arrival wins, and if that ties too
                // the process listed first (P1 before P2) wins, because we only switch on "better".
                if (best == -1 || burst[i] < burst[best]
                        || (burst[i] == burst[best] && arrival[i] < arrival[best]))
                    best = i;
            }

            // Step 2: if nobody has arrived yet, the CPU is idle until the next arrival.
            if (best == -1) {
                int next = -1;
                for (int i = 0; i < n; i++)
                    if (!done[i] && (next == -1 || arrival[i] < next))
                        next = arrival[i];
                System.out.print("| idle " + t + "-" + next + " ");
                t = next;
                continue;
            }

            // Step 3: run the chosen process to the end (non-preemptive = no interruptions).
            start[best] = t;
            t += burst[best];
            completion[best] = t;
            done[best] = true;
            finished++;
            System.out.print("| " + name[best] + " " + start[best] + "-" + completion[best] + " ");
        }
        System.out.print("|\n\n");

        // Step 4: work out the times for every process and print the table.
        double totalWaiting = 0, totalTurnaround = 0, totalResponse = 0;
        System.out.print(String.format("%-8s%8s%7s%12s%12s%9s%10s\n", "Process", "Arrival", "Burst",
                "Completion", "Turnaround", "Waiting", "Response"));
        for (int i = 0; i < n; i++) {
            int turnaround = completion[i] - arrival[i];  // arrival until finish
            int waiting = turnaround - burst[i];          // time spent waiting in the queue
            int response = start[i] - arrival[i];         // arrival until it first got the CPU
            totalWaiting += waiting;
            totalTurnaround += turnaround;
            totalResponse += response;
            System.out.print(String.format("%-8s%8d%7d%12d%12d%9d%10d\n", name[i], arrival[i], burst[i],
                    completion[i], turnaround, waiting, response));
        }

        // Locale.US so the decimal point is always a dot.
        System.out.print(String.format(Locale.US, "\nAverage waiting time    : %.2f\n", totalWaiting / n));
        System.out.print(String.format(Locale.US, "Average turnaround time : %.2f\n", totalTurnaround / n));
        System.out.print(String.format(Locale.US, "Average response time   : %.2f\n", totalResponse / n));
    }
}
`,
  },

  priority: {
    c: String.raw`#include <stdio.h>

#define N 4  /* number of processes */

int main(void)
{
    /* Sample input (the simulator's default). Change these values to try your own input.
       Lower priority number = more important (priority 1 beats priority 2). */
    const char *name[N] = {"P1", "P2", "P3", "P4"};
    int arrival[N] = {0, 1, 2, 3};
    int burst[N] = {5, 3, 8, 6};
    int priority[N] = {2, 1, 4, 3};

    int start[N], completion[N];  /* when each process started and finished */
    int done[N] = {0};            /* 1 once a process has finished */
    int finished = 0, t = 0;      /* t is the current time on the clock */

    printf("Priority Scheduling (non-preemptive, lower number = higher priority)\n\n");
    printf("Gantt chart: ");
    while (finished < N) {
        /* Step 1: among processes that have arrived and are not done, pick the most important. */
        int best = -1;
        for (int i = 0; i < N; i++) {
            if (done[i] || arrival[i] > t)
                continue;
            /* Smaller priority number wins. On a tie the earlier arrival wins, and if that ties
               too the process listed first (P1 before P2) wins, because we only switch on "better". */
            if (best == -1 || priority[i] < priority[best] ||
                (priority[i] == priority[best] && arrival[i] < arrival[best]))
                best = i;
        }

        /* Step 2: if nobody has arrived yet, the CPU is idle until the next arrival. */
        if (best == -1) {
            int next = -1;
            for (int i = 0; i < N; i++)
                if (!done[i] && (next == -1 || arrival[i] < next))
                    next = arrival[i];
            printf("| idle %d-%d ", t, next);
            t = next;
            continue;
        }

        /* Step 3: run the chosen process to the end (non-preemptive = no interruptions). */
        start[best] = t;
        t += burst[best];
        completion[best] = t;
        done[best] = 1;
        finished++;
        printf("| %s %d-%d ", name[best], start[best], completion[best]);
    }
    printf("|\n\n");

    /* Step 4: work out the times for every process and print the table. */
    double totalWaiting = 0, totalTurnaround = 0, totalResponse = 0;
    printf("%-8s%8s%7s%10s%12s%12s%9s%10s\n", "Process", "Arrival", "Burst", "Priority",
           "Completion", "Turnaround", "Waiting", "Response");
    for (int i = 0; i < N; i++) {
        int turnaround = completion[i] - arrival[i];  /* arrival until finish */
        int waiting = turnaround - burst[i];          /* time spent waiting in the queue */
        int response = start[i] - arrival[i];         /* arrival until it first got the CPU */
        totalWaiting += waiting;
        totalTurnaround += turnaround;
        totalResponse += response;
        printf("%-8s%8d%7d%10d%12d%12d%9d%10d\n", name[i], arrival[i], burst[i], priority[i],
               completion[i], turnaround, waiting, response);
    }

    printf("\nAverage waiting time    : %.2f\n", totalWaiting / N);
    printf("Average turnaround time : %.2f\n", totalTurnaround / N);
    printf("Average response time   : %.2f\n", totalResponse / N);
    return 0;
}
`,
    cpp: String.raw`#include <iostream>
#include <iomanip>
#include <string>
#include <vector>
using namespace std;

int main()
{
    // Sample input (the simulator's default). Change these values to try your own input.
    // Lower priority number = more important (priority 1 beats priority 2).
    vector<string> name = {"P1", "P2", "P3", "P4"};
    vector<int> arrival = {0, 1, 2, 3};
    vector<int> burst = {5, 3, 8, 6};
    vector<int> priority = {2, 1, 4, 3};
    int n = (int)name.size();

    vector<int> start(n), completion(n);  // when each process started and finished
    vector<bool> done(n, false);          // true once a process has finished
    int finished = 0, t = 0;              // t is the current time on the clock

    cout << "Priority Scheduling (non-preemptive, lower number = higher priority)\n\n";
    cout << "Gantt chart: ";
    while (finished < n) {
        // Step 1: among processes that have arrived and are not done, pick the most important.
        int best = -1;
        for (int i = 0; i < n; i++) {
            if (done[i] || arrival[i] > t)
                continue;
            // Smaller priority number wins. On a tie the earlier arrival wins, and if that ties
            // too the process listed first (P1 before P2) wins, because we only switch on "better".
            if (best == -1 || priority[i] < priority[best] ||
                (priority[i] == priority[best] && arrival[i] < arrival[best]))
                best = i;
        }

        // Step 2: if nobody has arrived yet, the CPU is idle until the next arrival.
        if (best == -1) {
            int next = -1;
            for (int i = 0; i < n; i++)
                if (!done[i] && (next == -1 || arrival[i] < next))
                    next = arrival[i];
            cout << "| idle " << t << "-" << next << " ";
            t = next;
            continue;
        }

        // Step 3: run the chosen process to the end (non-preemptive = no interruptions).
        start[best] = t;
        t += burst[best];
        completion[best] = t;
        done[best] = true;
        finished++;
        cout << "| " << name[best] << " " << start[best] << "-" << completion[best] << " ";
    }
    cout << "|\n\n";

    // Step 4: work out the times for every process and print the table.
    double totalWaiting = 0, totalTurnaround = 0, totalResponse = 0;
    cout << left << setw(8) << "Process" << right << setw(8) << "Arrival" << setw(7) << "Burst"
         << setw(10) << "Priority" << setw(12) << "Completion" << setw(12) << "Turnaround"
         << setw(9) << "Waiting" << setw(10) << "Response" << "\n";
    for (int i = 0; i < n; i++) {
        int turnaround = completion[i] - arrival[i];  // arrival until finish
        int waiting = turnaround - burst[i];          // time spent waiting in the queue
        int response = start[i] - arrival[i];         // arrival until it first got the CPU
        totalWaiting += waiting;
        totalTurnaround += turnaround;
        totalResponse += response;
        cout << left << setw(8) << name[i] << right << setw(8) << arrival[i] << setw(7) << burst[i]
             << setw(10) << priority[i] << setw(12) << completion[i] << setw(12) << turnaround
             << setw(9) << waiting << setw(10) << response << "\n";
    }

    cout << fixed << setprecision(2);
    cout << "\nAverage waiting time    : " << totalWaiting / n << "\n";
    cout << "Average turnaround time : " << totalTurnaround / n << "\n";
    cout << "Average response time   : " << totalResponse / n << "\n";
    return 0;
}
`,
    java: String.raw`import java.util.Locale;

public class Main {
    public static void main(String[] args) {
        // Sample input (the simulator's default). Change these values to try your own input.
        // Lower priority number = more important (priority 1 beats priority 2).
        String[] name = {"P1", "P2", "P3", "P4"};
        int[] arrival = {0, 1, 2, 3};
        int[] burst = {5, 3, 8, 6};
        int[] priority = {2, 1, 4, 3};
        int n = name.length;

        int[] start = new int[n], completion = new int[n];  // when each process started and finished
        boolean[] done = new boolean[n];                    // true once a process has finished
        int finished = 0, t = 0;                            // t is the current time on the clock

        System.out.print("Priority Scheduling (non-preemptive, lower number = higher priority)\n\n");
        System.out.print("Gantt chart: ");
        while (finished < n) {
            // Step 1: among processes that have arrived and are not done, pick the most important.
            int best = -1;
            for (int i = 0; i < n; i++) {
                if (done[i] || arrival[i] > t)
                    continue;
                // Smaller priority number wins. On a tie the earlier arrival wins, and if that ties
                // too the process listed first (P1 before P2) wins, because we only switch on "better".
                if (best == -1 || priority[i] < priority[best]
                        || (priority[i] == priority[best] && arrival[i] < arrival[best]))
                    best = i;
            }

            // Step 2: if nobody has arrived yet, the CPU is idle until the next arrival.
            if (best == -1) {
                int next = -1;
                for (int i = 0; i < n; i++)
                    if (!done[i] && (next == -1 || arrival[i] < next))
                        next = arrival[i];
                System.out.print("| idle " + t + "-" + next + " ");
                t = next;
                continue;
            }

            // Step 3: run the chosen process to the end (non-preemptive = no interruptions).
            start[best] = t;
            t += burst[best];
            completion[best] = t;
            done[best] = true;
            finished++;
            System.out.print("| " + name[best] + " " + start[best] + "-" + completion[best] + " ");
        }
        System.out.print("|\n\n");

        // Step 4: work out the times for every process and print the table.
        double totalWaiting = 0, totalTurnaround = 0, totalResponse = 0;
        System.out.print(String.format("%-8s%8s%7s%10s%12s%12s%9s%10s\n", "Process", "Arrival", "Burst",
                "Priority", "Completion", "Turnaround", "Waiting", "Response"));
        for (int i = 0; i < n; i++) {
            int turnaround = completion[i] - arrival[i];  // arrival until finish
            int waiting = turnaround - burst[i];          // time spent waiting in the queue
            int response = start[i] - arrival[i];         // arrival until it first got the CPU
            totalWaiting += waiting;
            totalTurnaround += turnaround;
            totalResponse += response;
            System.out.print(String.format("%-8s%8d%7d%10d%12d%12d%9d%10d\n", name[i], arrival[i], burst[i],
                    priority[i], completion[i], turnaround, waiting, response));
        }

        // Locale.US so the decimal point is always a dot.
        System.out.print(String.format(Locale.US, "\nAverage waiting time    : %.2f\n", totalWaiting / n));
        System.out.print(String.format(Locale.US, "Average turnaround time : %.2f\n", totalTurnaround / n));
        System.out.print(String.format(Locale.US, "Average response time   : %.2f\n", totalResponse / n));
    }
}
`,
  },

  rr: {
    c: String.raw`#include <stdio.h>

#define N 4  /* number of processes */

int main(void)
{
    /* Sample input (the simulator's default). Change these values to try your own input. */
    const char *name[N] = {"P1", "P2", "P3", "P4"};
    int arrival[N] = {0, 1, 2, 3};
    int burst[N] = {5, 3, 8, 6};
    int quantum = 2;  /* the longest a process may run before giving up the CPU */

    int remaining[N], firstStart[N], completion[N], order[N];
    for (int i = 0; i < N; i++) {
        remaining[i] = burst[i];
        firstStart[i] = -1;  /* -1 means "has not run yet" */
    }

    /* Sort by arrival time (ties keep input order) so arrivals can join the queue in order. */
    for (int i = 0; i < N; i++) {
        int j = i;
        while (j > 0 && arrival[order[j - 1]] > arrival[i]) {
            order[j] = order[j - 1];
            j--;
        }
        order[j] = i;
    }

    /* The ready queue. Each process is in it at most once, so N slots are enough;
       the indexes wrap around to the start (a "circular" queue). */
    int queue[N], head = 0, count = 0;
    int next = 0;               /* next process (in arrival order) that has not arrived yet */
    int finished = 0, t = 0;    /* t is the current time on the clock */

    printf("Round Robin (time quantum = %d)\n\n", quantum);
    printf("Gantt chart: ");
    while (finished < N) {
        /* Step 1: every process that has arrived by now joins the back of the queue. */
        while (next < N && arrival[order[next]] <= t)
            queue[(head + count++) % N] = order[next++];

        /* Step 2: empty queue means nobody is ready, so the CPU idles until the next arrival. */
        if (count == 0) {
            printf("| idle %d-%d ", t, arrival[order[next]]);
            t = arrival[order[next]];
            continue;
        }

        /* Step 3: take the process at the front and run it for at most one quantum. */
        int p = queue[head];
        head = (head + 1) % N;
        count--;
        int run = remaining[p] < quantum ? remaining[p] : quantum;
        if (firstStart[p] == -1)
            firstStart[p] = t;
        printf("| %s %d-%d ", name[p], t, t + run);
        t += run;
        remaining[p] -= run;

        /* Step 4: processes that arrived while it ran join the queue FIRST... */
        while (next < N && arrival[order[next]] <= t)
            queue[(head + count++) % N] = order[next++];

        /* ...then the interrupted process goes to the back, or is finished. */
        if (remaining[p] > 0) {
            queue[(head + count++) % N] = p;
        } else {
            completion[p] = t;
            finished++;
        }
    }
    printf("|\n\n");

    /* Step 5: work out the times for every process and print the table. */
    double totalWaiting = 0, totalTurnaround = 0, totalResponse = 0;
    printf("%-8s%8s%7s%12s%12s%9s%10s\n", "Process", "Arrival", "Burst",
           "Completion", "Turnaround", "Waiting", "Response");
    for (int i = 0; i < N; i++) {
        int turnaround = completion[i] - arrival[i];  /* arrival until finish */
        int waiting = turnaround - burst[i];          /* time spent waiting in the queue */
        int response = firstStart[i] - arrival[i];    /* arrival until it first got the CPU */
        totalWaiting += waiting;
        totalTurnaround += turnaround;
        totalResponse += response;
        printf("%-8s%8d%7d%12d%12d%9d%10d\n", name[i], arrival[i], burst[i],
               completion[i], turnaround, waiting, response);
    }

    printf("\nAverage waiting time    : %.2f\n", totalWaiting / N);
    printf("Average turnaround time : %.2f\n", totalTurnaround / N);
    printf("Average response time   : %.2f\n", totalResponse / N);
    return 0;
}
`,
    cpp: String.raw`#include <iostream>
#include <iomanip>
#include <queue>
#include <string>
#include <vector>
using namespace std;

int main()
{
    // Sample input (the simulator's default). Change these values to try your own input.
    vector<string> name = {"P1", "P2", "P3", "P4"};
    vector<int> arrival = {0, 1, 2, 3};
    vector<int> burst = {5, 3, 8, 6};
    int quantum = 2;  // the longest a process may run before giving up the CPU
    int n = (int)name.size();

    vector<int> remaining = burst;          // work still left for each process
    vector<int> firstStart(n, -1);          // -1 means "has not run yet"
    vector<int> completion(n), order(n);

    // Sort by arrival time (ties keep input order) so arrivals can join the queue in order.
    for (int i = 0; i < n; i++) {
        int j = i;
        while (j > 0 && arrival[order[j - 1]] > arrival[i]) {
            order[j] = order[j - 1];
            j--;
        }
        order[j] = i;
    }

    queue<int> ready;           // the ready queue (first in, first out)
    int next = 0;               // next process (in arrival order) that has not arrived yet
    int finished = 0, t = 0;    // t is the current time on the clock

    cout << "Round Robin (time quantum = " << quantum << ")\n\n";
    cout << "Gantt chart: ";
    while (finished < n) {
        // Step 1: every process that has arrived by now joins the back of the queue.
        while (next < n && arrival[order[next]] <= t)
            ready.push(order[next++]);

        // Step 2: empty queue means nobody is ready, so the CPU idles until the next arrival.
        if (ready.empty()) {
            cout << "| idle " << t << "-" << arrival[order[next]] << " ";
            t = arrival[order[next]];
            continue;
        }

        // Step 3: take the process at the front and run it for at most one quantum.
        int p = ready.front();
        ready.pop();
        int run = remaining[p] < quantum ? remaining[p] : quantum;
        if (firstStart[p] == -1)
            firstStart[p] = t;
        cout << "| " << name[p] << " " << t << "-" << t + run << " ";
        t += run;
        remaining[p] -= run;

        // Step 4: processes that arrived while it ran join the queue FIRST...
        while (next < n && arrival[order[next]] <= t)
            ready.push(order[next++]);

        // ...then the interrupted process goes to the back, or is finished.
        if (remaining[p] > 0) {
            ready.push(p);
        } else {
            completion[p] = t;
            finished++;
        }
    }
    cout << "|\n\n";

    // Step 5: work out the times for every process and print the table.
    double totalWaiting = 0, totalTurnaround = 0, totalResponse = 0;
    cout << left << setw(8) << "Process" << right << setw(8) << "Arrival" << setw(7) << "Burst"
         << setw(12) << "Completion" << setw(12) << "Turnaround" << setw(9) << "Waiting"
         << setw(10) << "Response" << "\n";
    for (int i = 0; i < n; i++) {
        int turnaround = completion[i] - arrival[i];  // arrival until finish
        int waiting = turnaround - burst[i];          // time spent waiting in the queue
        int response = firstStart[i] - arrival[i];    // arrival until it first got the CPU
        totalWaiting += waiting;
        totalTurnaround += turnaround;
        totalResponse += response;
        cout << left << setw(8) << name[i] << right << setw(8) << arrival[i] << setw(7) << burst[i]
             << setw(12) << completion[i] << setw(12) << turnaround << setw(9) << waiting
             << setw(10) << response << "\n";
    }

    cout << fixed << setprecision(2);
    cout << "\nAverage waiting time    : " << totalWaiting / n << "\n";
    cout << "Average turnaround time : " << totalTurnaround / n << "\n";
    cout << "Average response time   : " << totalResponse / n << "\n";
    return 0;
}
`,
    java: String.raw`import java.util.ArrayDeque;
import java.util.Locale;

public class Main {
    public static void main(String[] args) {
        // Sample input (the simulator's default). Change these values to try your own input.
        String[] name = {"P1", "P2", "P3", "P4"};
        int[] arrival = {0, 1, 2, 3};
        int[] burst = {5, 3, 8, 6};
        int quantum = 2;  // the longest a process may run before giving up the CPU
        int n = name.length;

        int[] remaining = burst.clone();  // work still left for each process
        int[] firstStart = new int[n];
        int[] completion = new int[n], order = new int[n];
        for (int i = 0; i < n; i++)
            firstStart[i] = -1;  // -1 means "has not run yet"

        // Sort by arrival time (ties keep input order) so arrivals can join the queue in order.
        for (int i = 0; i < n; i++) {
            int j = i;
            while (j > 0 && arrival[order[j - 1]] > arrival[i]) {
                order[j] = order[j - 1];
                j--;
            }
            order[j] = i;
        }

        ArrayDeque<Integer> ready = new ArrayDeque<>();  // the ready queue (first in, first out)
        int next = 0;               // next process (in arrival order) that has not arrived yet
        int finished = 0, t = 0;    // t is the current time on the clock

        System.out.print("Round Robin (time quantum = " + quantum + ")\n\n");
        System.out.print("Gantt chart: ");
        while (finished < n) {
            // Step 1: every process that has arrived by now joins the back of the queue.
            while (next < n && arrival[order[next]] <= t)
                ready.addLast(order[next++]);

            // Step 2: empty queue means nobody is ready, so the CPU idles until the next arrival.
            if (ready.isEmpty()) {
                System.out.print("| idle " + t + "-" + arrival[order[next]] + " ");
                t = arrival[order[next]];
                continue;
            }

            // Step 3: take the process at the front and run it for at most one quantum.
            int p = ready.pollFirst();
            int run = remaining[p] < quantum ? remaining[p] : quantum;
            if (firstStart[p] == -1)
                firstStart[p] = t;
            System.out.print("| " + name[p] + " " + t + "-" + (t + run) + " ");
            t += run;
            remaining[p] -= run;

            // Step 4: processes that arrived while it ran join the queue FIRST...
            while (next < n && arrival[order[next]] <= t)
                ready.addLast(order[next++]);

            // ...then the interrupted process goes to the back, or is finished.
            if (remaining[p] > 0) {
                ready.addLast(p);
            } else {
                completion[p] = t;
                finished++;
            }
        }
        System.out.print("|\n\n");

        // Step 5: work out the times for every process and print the table.
        double totalWaiting = 0, totalTurnaround = 0, totalResponse = 0;
        System.out.print(String.format("%-8s%8s%7s%12s%12s%9s%10s\n", "Process", "Arrival", "Burst",
                "Completion", "Turnaround", "Waiting", "Response"));
        for (int i = 0; i < n; i++) {
            int turnaround = completion[i] - arrival[i];  // arrival until finish
            int waiting = turnaround - burst[i];          // time spent waiting in the queue
            int response = firstStart[i] - arrival[i];    // arrival until it first got the CPU
            totalWaiting += waiting;
            totalTurnaround += turnaround;
            totalResponse += response;
            System.out.print(String.format("%-8s%8d%7d%12d%12d%9d%10d\n", name[i], arrival[i], burst[i],
                    completion[i], turnaround, waiting, response));
        }

        // Locale.US so the decimal point is always a dot.
        System.out.print(String.format(Locale.US, "\nAverage waiting time    : %.2f\n", totalWaiting / n));
        System.out.print(String.format(Locale.US, "Average turnaround time : %.2f\n", totalTurnaround / n));
        System.out.print(String.format(Locale.US, "Average response time   : %.2f\n", totalResponse / n));
    }
}
`,
  },
};
