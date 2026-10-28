// Reference programs shown in the Code tab. Each one hard-codes the simulator's default sample input
// and prints the same results the simulator shows for it.
export const CODE = {
  banker: {
    c: String.raw`#include <stdio.h>
#include <stdbool.h>

#define N 5   /* number of processes */
#define M 3   /* number of resource types (A, B, C, ...) */

/* Print a list of numbers like (1, 0, 2). */
void print_vector(const int v[M]) {
    printf("(");
    for (int j = 0; j < M; j++) printf(j ? ", %d" : "%d", v[j]);
    printf(")");
}

/* Safety algorithm: can every process finish in some order?
   Fills seq[] with that order and returns true if the state is safe. */
bool is_safe(int alloc[N][M], int need[N][M], const int avail[M], int seq[N]) {
    int work[M];               /* Work = resources free right now */
    bool finish[N] = {false};  /* Finish[i] = has Pi been able to finish? */
    for (int j = 0; j < M; j++) work[j] = avail[j];

    for (int count = 0; count < N; count++) {
        int pick = -1;
        /* Pick the first unfinished process whose Need fits in Work. */
        for (int i = 0; i < N && pick == -1; i++) {
            if (finish[i]) continue;
            bool fits = true;
            for (int j = 0; j < M; j++)
                if (need[i][j] > work[j]) fits = false;
            if (fits) pick = i;
        }
        if (pick == -1) return false;   /* nobody can run: UNSAFE */
        /* It runs to completion and gives back everything it holds. */
        for (int j = 0; j < M; j++) work[j] += alloc[pick][j];
        finish[pick] = true;
        seq[count] = pick;
    }
    return true;
}

void print_sequence(const int seq[N]) {
    for (int k = 0; k < N; k++) printf(k ? " -> P%d" : "P%d", seq[k]);
    printf("\n");
}

/* Resource-request algorithm: should process p get req[]? */
void request_resources(int p, const int req[M], int alloc[N][M], int need[N][M], int avail[M]) {
    printf("\nRequest: P%d asks ", p);
    print_vector(req);
    printf("\n");
    for (int j = 0; j < M; j++) {
        if (req[j] > need[p][j]) {
            printf("Rejected: P%d asks for more than its remaining Need.\n", p);
            return;
        }
    }
    for (int j = 0; j < M; j++) {
        if (req[j] > avail[j]) {
            printf("P%d must wait: not enough resources are available right now.\n", p);
            return;
        }
    }
    /* Pretend to grant the request. */
    for (int j = 0; j < M; j++) {
        avail[j] -= req[j];
        alloc[p][j] += req[j];
        need[p][j] -= req[j];
    }
    int seq[N];
    if (is_safe(alloc, need, avail, seq)) {
        printf("Granted: the state stays safe. Safe sequence: ");
        print_sequence(seq);
    } else {
        /* Unsafe: roll everything back, P must wait. */
        for (int j = 0; j < M; j++) {
            avail[j] += req[j];
            alloc[p][j] -= req[j];
            need[p][j] += req[j];
        }
        printf("Rejected: granting it would make the state UNSAFE, so P%d must wait.\n", p);
    }
}

int main(void) {
    /* Change these values to try your own input. */
    int total[M] = {10, 5, 7};          /* total instances of each resource */
    int alloc[N][M] = {{0, 1, 0}, {2, 0, 0}, {3, 0, 2}, {2, 1, 1}, {0, 0, 2}};
    int max[N][M]   = {{7, 5, 3}, {3, 2, 2}, {9, 0, 2}, {2, 2, 2}, {4, 3, 3}};
    int req_process = 1;                /* the extra request to test */
    int req[M] = {1, 0, 2};

    /* Need = what each process may still ask for. */
    int need[N][M];
    for (int i = 0; i < N; i++)
        for (int j = 0; j < M; j++)
            need[i][j] = max[i][j] - alloc[i][j];

    /* Available = Total - everything already allocated. */
    int avail[M];
    for (int j = 0; j < M; j++) {
        avail[j] = total[j];
        for (int i = 0; i < N; i++) avail[j] -= alloc[i][j];
    }

    printf("Need matrix (Max - Allocation):\n    ");
    for (int j = 0; j < M; j++) printf("%3c", 'A' + j);
    printf("\n");
    for (int i = 0; i < N; i++) {
        printf("P%-3d", i);
        for (int j = 0; j < M; j++) printf("%3d", need[i][j]);
        printf("\n");
    }
    printf("Available: ");
    print_vector(avail);
    printf("\n");

    int seq[N];
    if (is_safe(alloc, need, avail, seq)) {
        printf("SAFE. Safe sequence: ");
        print_sequence(seq);
    } else {
        printf("UNSAFE: no order lets every process finish.\n");
    }

    request_resources(req_process, req, alloc, need, avail);
    return 0;
}
`,
    cpp: String.raw`#include <iostream>
#include <iomanip>
#include <vector>
using namespace std;

typedef vector<int> Row;
typedef vector<Row> Matrix;

// Print a list of numbers like (1, 0, 2).
void printVector(const Row& v) {
    cout << "(";
    for (size_t j = 0; j < v.size(); j++) cout << (j ? ", " : "") << v[j];
    cout << ")";
}

// Safety algorithm: can every process finish in some order?
// Fills seq with that order and returns true if the state is safe.
bool isSafe(const Matrix& alloc, const Matrix& need, const Row& avail, vector<int>& seq) {
    int n = alloc.size(), m = avail.size();
    Row work = avail;               // Work = resources free right now
    vector<bool> finish(n, false);  // finish[i] = has Pi been able to finish?
    seq.clear();

    for (int count = 0; count < n; count++) {
        int pick = -1;
        // Pick the first unfinished process whose Need fits in Work.
        for (int i = 0; i < n && pick == -1; i++) {
            if (finish[i]) continue;
            bool fits = true;
            for (int j = 0; j < m; j++)
                if (need[i][j] > work[j]) fits = false;
            if (fits) pick = i;
        }
        if (pick == -1) return false;   // nobody can run: UNSAFE
        // It runs to completion and gives back everything it holds.
        for (int j = 0; j < m; j++) work[j] += alloc[pick][j];
        finish[pick] = true;
        seq.push_back(pick);
    }
    return true;
}

void printSequence(const vector<int>& seq) {
    for (size_t k = 0; k < seq.size(); k++) cout << (k ? " -> P" : "P") << seq[k];
    cout << "\n";
}

// Resource-request algorithm: should process p get req?
void requestResources(int p, const Row& req, Matrix& alloc, Matrix& need, Row& avail) {
    int m = avail.size();
    cout << "\nRequest: P" << p << " asks ";
    printVector(req);
    cout << "\n";
    for (int j = 0; j < m; j++) {
        if (req[j] > need[p][j]) {
            cout << "Rejected: P" << p << " asks for more than its remaining Need.\n";
            return;
        }
    }
    for (int j = 0; j < m; j++) {
        if (req[j] > avail[j]) {
            cout << "P" << p << " must wait: not enough resources are available right now.\n";
            return;
        }
    }
    // Pretend to grant the request.
    for (int j = 0; j < m; j++) {
        avail[j] -= req[j];
        alloc[p][j] += req[j];
        need[p][j] -= req[j];
    }
    vector<int> seq;
    if (isSafe(alloc, need, avail, seq)) {
        cout << "Granted: the state stays safe. Safe sequence: ";
        printSequence(seq);
    } else {
        // Unsafe: roll everything back, P must wait.
        for (int j = 0; j < m; j++) {
            avail[j] += req[j];
            alloc[p][j] -= req[j];
            need[p][j] += req[j];
        }
        cout << "Rejected: granting it would make the state UNSAFE, so P" << p << " must wait.\n";
    }
}

int main() {
    // Change these values to try your own input.
    Row total = {10, 5, 7};             // total instances of each resource
    Matrix alloc = {{0, 1, 0}, {2, 0, 0}, {3, 0, 2}, {2, 1, 1}, {0, 0, 2}};
    Matrix max   = {{7, 5, 3}, {3, 2, 2}, {9, 0, 2}, {2, 2, 2}, {4, 3, 3}};
    int reqProcess = 1;                 // the extra request to test
    Row req = {1, 0, 2};

    int n = alloc.size(), m = total.size();

    // Need = what each process may still ask for.
    Matrix need(n, Row(m));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            need[i][j] = max[i][j] - alloc[i][j];

    // Available = Total - everything already allocated.
    Row avail = total;
    for (int j = 0; j < m; j++)
        for (int i = 0; i < n; i++) avail[j] -= alloc[i][j];

    cout << "Need matrix (Max - Allocation):\n    ";
    for (int j = 0; j < m; j++) cout << setw(3) << char('A' + j);
    cout << "\n";
    for (int i = 0; i < n; i++) {
        cout << "P" << left << setw(3) << i << right;
        for (int j = 0; j < m; j++) cout << setw(3) << need[i][j];
        cout << "\n";
    }
    cout << "Available: ";
    printVector(avail);
    cout << "\n";

    vector<int> seq;
    if (isSafe(alloc, need, avail, seq)) {
        cout << "SAFE. Safe sequence: ";
        printSequence(seq);
    } else {
        cout << "UNSAFE: no order lets every process finish.\n";
    }

    requestResources(reqProcess, req, alloc, need, avail);
    return 0;
}
`,
    java: String.raw`import java.util.ArrayList;
import java.util.List;

public class Main {
    // Print a list of numbers like (1, 0, 2).
    static void printVector(int[] v) {
        System.out.print("(");
        for (int j = 0; j < v.length; j++) System.out.print((j > 0 ? ", " : "") + v[j]);
        System.out.print(")");
    }

    // Safety algorithm: can every process finish in some order?
    // Fills seq with that order and returns true if the state is safe.
    static boolean isSafe(int[][] alloc, int[][] need, int[] avail, List<Integer> seq) {
        int n = alloc.length, m = avail.length;
        int[] work = avail.clone();            // Work = resources free right now
        boolean[] finish = new boolean[n];     // finish[i] = has Pi been able to finish?
        seq.clear();

        for (int count = 0; count < n; count++) {
            int pick = -1;
            // Pick the first unfinished process whose Need fits in Work.
            for (int i = 0; i < n && pick == -1; i++) {
                if (finish[i]) continue;
                boolean fits = true;
                for (int j = 0; j < m; j++)
                    if (need[i][j] > work[j]) fits = false;
                if (fits) pick = i;
            }
            if (pick == -1) return false;   // nobody can run: UNSAFE
            // It runs to completion and gives back everything it holds.
            for (int j = 0; j < m; j++) work[j] += alloc[pick][j];
            finish[pick] = true;
            seq.add(pick);
        }
        return true;
    }

    static void printSequence(List<Integer> seq) {
        for (int k = 0; k < seq.size(); k++) System.out.print((k > 0 ? " -> P" : "P") + seq.get(k));
        System.out.print("\n");
    }

    // Resource-request algorithm: should process p get req?
    static void requestResources(int p, int[] req, int[][] alloc, int[][] need, int[] avail) {
        int m = avail.length;
        System.out.print("\nRequest: P" + p + " asks ");
        printVector(req);
        System.out.print("\n");
        for (int j = 0; j < m; j++) {
            if (req[j] > need[p][j]) {
                System.out.print("Rejected: P" + p + " asks for more than its remaining Need.\n");
                return;
            }
        }
        for (int j = 0; j < m; j++) {
            if (req[j] > avail[j]) {
                System.out.print("P" + p + " must wait: not enough resources are available right now.\n");
                return;
            }
        }
        // Pretend to grant the request.
        for (int j = 0; j < m; j++) {
            avail[j] -= req[j];
            alloc[p][j] += req[j];
            need[p][j] -= req[j];
        }
        List<Integer> seq = new ArrayList<>();
        if (isSafe(alloc, need, avail, seq)) {
            System.out.print("Granted: the state stays safe. Safe sequence: ");
            printSequence(seq);
        } else {
            // Unsafe: roll everything back, P must wait.
            for (int j = 0; j < m; j++) {
                avail[j] += req[j];
                alloc[p][j] -= req[j];
                need[p][j] += req[j];
            }
            System.out.print("Rejected: granting it would make the state UNSAFE, so P" + p + " must wait.\n");
        }
    }

    public static void main(String[] args) {
        // Change these values to try your own input.
        int[] total = {10, 5, 7};           // total instances of each resource
        int[][] alloc = {{0, 1, 0}, {2, 0, 0}, {3, 0, 2}, {2, 1, 1}, {0, 0, 2}};
        int[][] max   = {{7, 5, 3}, {3, 2, 2}, {9, 0, 2}, {2, 2, 2}, {4, 3, 3}};
        int reqProcess = 1;                 // the extra request to test
        int[] req = {1, 0, 2};

        int n = alloc.length, m = total.length;

        // Need = what each process may still ask for.
        int[][] need = new int[n][m];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++)
                need[i][j] = max[i][j] - alloc[i][j];

        // Available = Total - everything already allocated.
        int[] avail = total.clone();
        for (int j = 0; j < m; j++)
            for (int i = 0; i < n; i++) avail[j] -= alloc[i][j];

        System.out.print("Need matrix (Max - Allocation):\n    ");
        for (int j = 0; j < m; j++) System.out.print(String.format("%3c", (char) ('A' + j)));
        System.out.print("\n");
        for (int i = 0; i < n; i++) {
            System.out.print(String.format("P%-3d", i));
            for (int j = 0; j < m; j++) System.out.print(String.format("%3d", need[i][j]));
            System.out.print("\n");
        }
        System.out.print("Available: ");
        printVector(avail);
        System.out.print("\n");

        List<Integer> seq = new ArrayList<>();
        if (isSafe(alloc, need, avail, seq)) {
            System.out.print("SAFE. Safe sequence: ");
            printSequence(seq);
        } else {
            System.out.print("UNSAFE: no order lets every process finish.\n");
        }

        requestResources(reqProcess, req, alloc, need, avail);
    }
}
`,
  },
  detection: {
    c: String.raw`#include <stdio.h>
#include <stdbool.h>

#define N 5   /* number of processes */
#define M 3   /* number of resource types (A, B, C, ...) */

/* Print a list of process names like "P0, P2", or "none" if the list is empty. */
void print_list(const int list[N], int count, const char *sep) {
    if (count == 0) printf("none");
    for (int k = 0; k < count; k++) printf("%sP%d", k ? sep : "", list[k]);
    printf("\n");
}

int main(void) {
    /* Change these values to try your own input. */
    int total[M] = {7, 2, 6};           /* total instances of each resource */
    int alloc[N][M]   = {{0, 1, 0}, {2, 0, 0}, {3, 0, 3}, {2, 1, 1}, {0, 0, 2}};
    int request[N][M] = {{0, 0, 0}, {2, 0, 2}, {0, 0, 0}, {1, 0, 0}, {0, 0, 2}};

    /* Available = Total - everything already allocated. */
    int work[M];
    for (int j = 0; j < M; j++) {
        work[j] = total[j];
        for (int i = 0; i < N; i++) work[j] -= alloc[i][j];
    }
    printf("Available: (");
    for (int j = 0; j < M; j++) printf(j ? ", %d" : "%d", work[j]);
    printf(")\n");

    /* A process holding nothing cannot be part of a deadlock,
       so it counts as finished from the start. */
    bool finish[N];
    int idle[N], idle_count = 0;
    for (int i = 0; i < N; i++) {
        finish[i] = true;
        for (int j = 0; j < M; j++)
            if (alloc[i][j] != 0) finish[i] = false;
        if (finish[i]) idle[idle_count++] = i;
    }
    printf("Holding nothing (finished from the start): ");
    print_list(idle, idle_count, ", ");

    /* Repeatedly pick the first unfinished process whose Request fits in Work. */
    int order[N], done = 0;
    while (true) {
        int pick = -1;
        for (int i = 0; i < N && pick == -1; i++) {
            if (finish[i]) continue;
            bool fits = true;
            for (int j = 0; j < M; j++)
                if (request[i][j] > work[j]) fits = false;
            if (fits) pick = i;
        }
        if (pick == -1) break;          /* nobody else can make progress */
        /* It gets what it asked for, finishes, and releases what it holds. */
        for (int j = 0; j < M; j++) work[j] += alloc[pick][j];
        finish[pick] = true;
        order[done++] = pick;
    }
    printf("Finish order: ");
    print_list(order, done, " -> ");

    /* Anyone still unfinished is waiting forever: deadlocked. */
    int stuck[N], stuck_count = 0;
    for (int i = 0; i < N; i++)
        if (!finish[i]) stuck[stuck_count++] = i;
    if (stuck_count == 0) {
        printf("No deadlock\n");
    } else {
        printf("Deadlock! Deadlocked processes: ");
        print_list(stuck, stuck_count, ", ");
    }
    return 0;
}
`,
    cpp: String.raw`#include <iostream>
#include <vector>
#include <string>
using namespace std;

typedef vector<int> Row;
typedef vector<Row> Matrix;

// Print a list of process names like "P0, P2", or "none" if the list is empty.
void printList(const vector<int>& list, const string& sep) {
    if (list.empty()) cout << "none";
    for (size_t k = 0; k < list.size(); k++) cout << (k ? sep : "") << "P" << list[k];
    cout << "\n";
}

int main() {
    // Change these values to try your own input.
    Row total = {7, 2, 6};              // total instances of each resource
    Matrix alloc   = {{0, 1, 0}, {2, 0, 0}, {3, 0, 3}, {2, 1, 1}, {0, 0, 2}};
    Matrix request = {{0, 0, 0}, {2, 0, 2}, {0, 0, 0}, {1, 0, 0}, {0, 0, 2}};

    int n = alloc.size(), m = total.size();

    // Available = Total - everything already allocated.
    Row work = total;
    for (int j = 0; j < m; j++)
        for (int i = 0; i < n; i++) work[j] -= alloc[i][j];
    cout << "Available: (";
    for (int j = 0; j < m; j++) cout << (j ? ", " : "") << work[j];
    cout << ")\n";

    // A process holding nothing cannot be part of a deadlock,
    // so it counts as finished from the start.
    vector<bool> finish(n);
    vector<int> idle;
    for (int i = 0; i < n; i++) {
        finish[i] = true;
        for (int j = 0; j < m; j++)
            if (alloc[i][j] != 0) finish[i] = false;
        if (finish[i]) idle.push_back(i);
    }
    cout << "Holding nothing (finished from the start): ";
    printList(idle, ", ");

    // Repeatedly pick the first unfinished process whose Request fits in Work.
    vector<int> order;
    while (true) {
        int pick = -1;
        for (int i = 0; i < n && pick == -1; i++) {
            if (finish[i]) continue;
            bool fits = true;
            for (int j = 0; j < m; j++)
                if (request[i][j] > work[j]) fits = false;
            if (fits) pick = i;
        }
        if (pick == -1) break;          // nobody else can make progress
        // It gets what it asked for, finishes, and releases what it holds.
        for (int j = 0; j < m; j++) work[j] += alloc[pick][j];
        finish[pick] = true;
        order.push_back(pick);
    }
    cout << "Finish order: ";
    printList(order, " -> ");

    // Anyone still unfinished is waiting forever: deadlocked.
    vector<int> stuck;
    for (int i = 0; i < n; i++)
        if (!finish[i]) stuck.push_back(i);
    if (stuck.empty()) {
        cout << "No deadlock\n";
    } else {
        cout << "Deadlock! Deadlocked processes: ";
        printList(stuck, ", ");
    }
    return 0;
}
`,
    java: String.raw`import java.util.ArrayList;
import java.util.List;

public class Main {
    // Print a list of process names like "P0, P2", or "none" if the list is empty.
    static void printList(List<Integer> list, String sep) {
        if (list.isEmpty()) System.out.print("none");
        for (int k = 0; k < list.size(); k++) System.out.print((k > 0 ? sep : "") + "P" + list.get(k));
        System.out.print("\n");
    }

    public static void main(String[] args) {
        // Change these values to try your own input.
        int[] total = {7, 2, 6};            // total instances of each resource
        int[][] alloc   = {{0, 1, 0}, {2, 0, 0}, {3, 0, 3}, {2, 1, 1}, {0, 0, 2}};
        int[][] request = {{0, 0, 0}, {2, 0, 2}, {0, 0, 0}, {1, 0, 0}, {0, 0, 2}};

        int n = alloc.length, m = total.length;

        // Available = Total - everything already allocated.
        int[] work = total.clone();
        for (int j = 0; j < m; j++)
            for (int i = 0; i < n; i++) work[j] -= alloc[i][j];
        System.out.print("Available: (");
        for (int j = 0; j < m; j++) System.out.print((j > 0 ? ", " : "") + work[j]);
        System.out.print(")\n");

        // A process holding nothing cannot be part of a deadlock,
        // so it counts as finished from the start.
        boolean[] finish = new boolean[n];
        List<Integer> idle = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            finish[i] = true;
            for (int j = 0; j < m; j++)
                if (alloc[i][j] != 0) finish[i] = false;
            if (finish[i]) idle.add(i);
        }
        System.out.print("Holding nothing (finished from the start): ");
        printList(idle, ", ");

        // Repeatedly pick the first unfinished process whose Request fits in Work.
        List<Integer> order = new ArrayList<>();
        while (true) {
            int pick = -1;
            for (int i = 0; i < n && pick == -1; i++) {
                if (finish[i]) continue;
                boolean fits = true;
                for (int j = 0; j < m; j++)
                    if (request[i][j] > work[j]) fits = false;
                if (fits) pick = i;
            }
            if (pick == -1) break;          // nobody else can make progress
            // It gets what it asked for, finishes, and releases what it holds.
            for (int j = 0; j < m; j++) work[j] += alloc[pick][j];
            finish[pick] = true;
            order.add(pick);
        }
        System.out.print("Finish order: ");
        printList(order, " -> ");

        // Anyone still unfinished is waiting forever: deadlocked.
        List<Integer> stuck = new ArrayList<>();
        for (int i = 0; i < n; i++)
            if (!finish[i]) stuck.add(i);
        if (stuck.isEmpty()) {
            System.out.print("No deadlock\n");
        } else {
            System.out.print("Deadlock! Deadlocked processes: ");
            printList(stuck, ", ");
        }
    }
}
`,
  },
};
