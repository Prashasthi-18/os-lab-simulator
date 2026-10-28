// Reference programs shown in the Code tab. Each one hard-codes the simulator's default sample input
// and prints the same results the simulator shows for it.
export const CODE = {
  first: {
    c: String.raw`/* First Fit: give each process the FIRST free block that is big enough.
   Each block can hold at most one process. Unused space inside a block is
   called internal fragmentation (block size - request). */
#include <stdio.h>

#define MAX 30   /* room for up to 30 blocks and 30 processes */

int main(void)
{
    /* Change these values to try your own input. */
    int blockSize[] = {100, 500, 200, 300, 600};   /* sizes of blocks B1, B2, ... */
    int processSize[] = {212, 417, 112, 426};       /* memory requested by P1, P2, ... */
    int nBlocks = sizeof(blockSize) / sizeof(blockSize[0]);
    int nProcesses = sizeof(processSize) / sizeof(processSize[0]);

    int blockUsed[MAX] = {0};   /* blockUsed[j] = 1 once block j holds a process */
    int allocation[MAX];        /* allocation[i] = block given to process i, or -1 */
    int totalFragmentation = 0;
    int allocatedCount = 0;
    int i, j;

    /* Handle the processes one at a time, in the order they are listed. */
    for (i = 0; i < nProcesses; i++) {
        allocation[i] = -1;   /* -1 means "no block yet" */

        /* Look at every block in order. */
        for (j = 0; j < nBlocks; j++) {
            /* A block can be used only if it is free and big enough. */
            if (!blockUsed[j] && blockSize[j] >= processSize[i]) {
                allocation[i] = j;   /* take the first one we find */
                break;               /* and stop scanning */
            }
        }

        /* Mark the chosen block as taken so no other process can use it. */
        if (allocation[i] != -1) {
            blockUsed[allocation[i]] = 1;
        }
    }

    /* Print one row per process. */
    printf("First Fit memory allocation\n\n");
    printf("%-9s%-9s%-15s%-12s%s\n", "Process", "Request", "Block", "Block size", "Internal fragmentation");
    for (i = 0; i < nProcesses; i++) {
        if (allocation[i] != -1) {
            j = allocation[i];
            int waste = blockSize[j] - processSize[i];   /* internal fragmentation */
            totalFragmentation += waste;
            allocatedCount++;
            printf("P%-8d%-9dB%-14d%-12d%d\n", i + 1, processSize[i], j + 1, blockSize[j], waste);
        } else {
            printf("P%-8d%-9d%-15s%-12s%s\n", i + 1, processSize[i], "Not allocated", "-", "-");
        }
    }

    /* Print the summary. */
    printf("\nTotal internal fragmentation: %d\n", totalFragmentation);
    printf("Processes allocated: %d\n", allocatedCount);
    printf("Processes not allocated: %d\n", nProcesses - allocatedCount);
    return 0;
}
`,
    cpp: String.raw`// First Fit: give each process the FIRST free block that is big enough.
// Each block can hold at most one process. Unused space inside a block is
// called internal fragmentation (block size - request).
#include <iostream>
#include <iomanip>
#include <vector>
using namespace std;

int main()
{
    // Change these values to try your own input.
    vector<int> blockSize = {100, 500, 200, 300, 600};   // sizes of blocks B1, B2, ...
    vector<int> processSize = {212, 417, 112, 426};       // memory requested by P1, P2, ...
    int nBlocks = blockSize.size();
    int nProcesses = processSize.size();

    vector<bool> blockUsed(nBlocks, false);   // true once a block holds a process
    vector<int> allocation(nProcesses, -1);   // block given to each process, or -1
    int totalFragmentation = 0;
    int allocatedCount = 0;

    // Handle the processes one at a time, in the order they are listed.
    for (int i = 0; i < nProcesses; i++) {
        // Look at every block in order.
        for (int j = 0; j < nBlocks; j++) {
            // A block can be used only if it is free and big enough.
            if (!blockUsed[j] && blockSize[j] >= processSize[i]) {
                allocation[i] = j;   // take the first one we find
                break;               // and stop scanning
            }
        }

        // Mark the chosen block as taken so no other process can use it.
        if (allocation[i] != -1) {
            blockUsed[allocation[i]] = true;
        }
    }

    // Print one row per process.
    cout << "First Fit memory allocation\n\n";
    cout << left << setw(9) << "Process" << setw(9) << "Request" << setw(15) << "Block"
         << setw(12) << "Block size" << "Internal fragmentation\n";
    for (int i = 0; i < nProcesses; i++) {
        cout << "P" << setw(8) << i + 1 << setw(9) << processSize[i];
        if (allocation[i] != -1) {
            int j = allocation[i];
            int waste = blockSize[j] - processSize[i];   // internal fragmentation
            totalFragmentation += waste;
            allocatedCount++;
            cout << "B" << setw(14) << j + 1 << setw(12) << blockSize[j] << waste << "\n";
        } else {
            cout << setw(15) << "Not allocated" << setw(12) << "-" << "-\n";
        }
    }

    // Print the summary.
    cout << "\nTotal internal fragmentation: " << totalFragmentation << "\n";
    cout << "Processes allocated: " << allocatedCount << "\n";
    cout << "Processes not allocated: " << nProcesses - allocatedCount << "\n";
    return 0;
}
`,
    java: String.raw`// First Fit: give each process the FIRST free block that is big enough.
// Each block can hold at most one process. Unused space inside a block is
// called internal fragmentation (block size - request).
public class Main {
    public static void main(String[] args) {
        // Change these values to try your own input.
        int[] blockSize = {100, 500, 200, 300, 600};   // sizes of blocks B1, B2, ...
        int[] processSize = {212, 417, 112, 426};       // memory requested by P1, P2, ...
        int nBlocks = blockSize.length;
        int nProcesses = processSize.length;

        boolean[] blockUsed = new boolean[nBlocks];   // true once a block holds a process
        int[] allocation = new int[nProcesses];       // block given to each process, or -1
        int totalFragmentation = 0;
        int allocatedCount = 0;

        // Handle the processes one at a time, in the order they are listed.
        for (int i = 0; i < nProcesses; i++) {
            allocation[i] = -1;   // -1 means "no block yet"

            // Look at every block in order.
            for (int j = 0; j < nBlocks; j++) {
                // A block can be used only if it is free and big enough.
                if (!blockUsed[j] && blockSize[j] >= processSize[i]) {
                    allocation[i] = j;   // take the first one we find
                    break;               // and stop scanning
                }
            }

            // Mark the chosen block as taken so no other process can use it.
            if (allocation[i] != -1) {
                blockUsed[allocation[i]] = true;
            }
        }

        // Print one row per process.
        System.out.print("First Fit memory allocation\n\n");
        System.out.printf("%-9s%-9s%-15s%-12s%s\n", "Process", "Request", "Block", "Block size", "Internal fragmentation");
        for (int i = 0; i < nProcesses; i++) {
            if (allocation[i] != -1) {
                int j = allocation[i];
                int waste = blockSize[j] - processSize[i];   // internal fragmentation
                totalFragmentation += waste;
                allocatedCount++;
                System.out.printf("P%-8d%-9dB%-14d%-12d%d\n", i + 1, processSize[i], j + 1, blockSize[j], waste);
            } else {
                System.out.printf("P%-8d%-9d%-15s%-12s%s\n", i + 1, processSize[i], "Not allocated", "-", "-");
            }
        }

        // Print the summary.
        System.out.print("\nTotal internal fragmentation: " + totalFragmentation + "\n");
        System.out.print("Processes allocated: " + allocatedCount + "\n");
        System.out.print("Processes not allocated: " + (nProcesses - allocatedCount) + "\n");
    }
}
`,
  },
  best: {
    c: String.raw`/* Best Fit: give each process the SMALLEST free block that is big enough.
   Each block can hold at most one process. Unused space inside a block is
   called internal fragmentation (block size - request). */
#include <stdio.h>

#define MAX 30   /* room for up to 30 blocks and 30 processes */

int main(void)
{
    /* Change these values to try your own input. */
    int blockSize[] = {100, 500, 200, 300, 600};   /* sizes of blocks B1, B2, ... */
    int processSize[] = {212, 417, 112, 426};       /* memory requested by P1, P2, ... */
    int nBlocks = sizeof(blockSize) / sizeof(blockSize[0]);
    int nProcesses = sizeof(processSize) / sizeof(processSize[0]);

    int blockUsed[MAX] = {0};   /* blockUsed[j] = 1 once block j holds a process */
    int allocation[MAX];        /* allocation[i] = block given to process i, or -1 */
    int totalFragmentation = 0;
    int allocatedCount = 0;
    int i, j;

    /* Handle the processes one at a time, in the order they are listed. */
    for (i = 0; i < nProcesses; i++) {
        allocation[i] = -1;   /* -1 means "no block yet" */

        /* Look at every block in order. */
        for (j = 0; j < nBlocks; j++) {
            /* A block can be used only if it is free and big enough. */
            if (!blockUsed[j] && blockSize[j] >= processSize[i]) {
                /* Keep it if it is smaller than the best block found so far.
                   Using < (not <=) means a tie goes to the block listed first. */
                if (allocation[i] == -1 || blockSize[j] < blockSize[allocation[i]]) {
                    allocation[i] = j;
                }
            }
        }

        /* Mark the chosen block as taken so no other process can use it. */
        if (allocation[i] != -1) {
            blockUsed[allocation[i]] = 1;
        }
    }

    /* Print one row per process. */
    printf("Best Fit memory allocation\n\n");
    printf("%-9s%-9s%-15s%-12s%s\n", "Process", "Request", "Block", "Block size", "Internal fragmentation");
    for (i = 0; i < nProcesses; i++) {
        if (allocation[i] != -1) {
            j = allocation[i];
            int waste = blockSize[j] - processSize[i];   /* internal fragmentation */
            totalFragmentation += waste;
            allocatedCount++;
            printf("P%-8d%-9dB%-14d%-12d%d\n", i + 1, processSize[i], j + 1, blockSize[j], waste);
        } else {
            printf("P%-8d%-9d%-15s%-12s%s\n", i + 1, processSize[i], "Not allocated", "-", "-");
        }
    }

    /* Print the summary. */
    printf("\nTotal internal fragmentation: %d\n", totalFragmentation);
    printf("Processes allocated: %d\n", allocatedCount);
    printf("Processes not allocated: %d\n", nProcesses - allocatedCount);
    return 0;
}
`,
    cpp: String.raw`// Best Fit: give each process the SMALLEST free block that is big enough.
// Each block can hold at most one process. Unused space inside a block is
// called internal fragmentation (block size - request).
#include <iostream>
#include <iomanip>
#include <vector>
using namespace std;

int main()
{
    // Change these values to try your own input.
    vector<int> blockSize = {100, 500, 200, 300, 600};   // sizes of blocks B1, B2, ...
    vector<int> processSize = {212, 417, 112, 426};       // memory requested by P1, P2, ...
    int nBlocks = blockSize.size();
    int nProcesses = processSize.size();

    vector<bool> blockUsed(nBlocks, false);   // true once a block holds a process
    vector<int> allocation(nProcesses, -1);   // block given to each process, or -1
    int totalFragmentation = 0;
    int allocatedCount = 0;

    // Handle the processes one at a time, in the order they are listed.
    for (int i = 0; i < nProcesses; i++) {
        // Look at every block in order.
        for (int j = 0; j < nBlocks; j++) {
            // A block can be used only if it is free and big enough.
            if (!blockUsed[j] && blockSize[j] >= processSize[i]) {
                // Keep it if it is smaller than the best block found so far.
                // Using < (not <=) means a tie goes to the block listed first.
                if (allocation[i] == -1 || blockSize[j] < blockSize[allocation[i]]) {
                    allocation[i] = j;
                }
            }
        }

        // Mark the chosen block as taken so no other process can use it.
        if (allocation[i] != -1) {
            blockUsed[allocation[i]] = true;
        }
    }

    // Print one row per process.
    cout << "Best Fit memory allocation\n\n";
    cout << left << setw(9) << "Process" << setw(9) << "Request" << setw(15) << "Block"
         << setw(12) << "Block size" << "Internal fragmentation\n";
    for (int i = 0; i < nProcesses; i++) {
        cout << "P" << setw(8) << i + 1 << setw(9) << processSize[i];
        if (allocation[i] != -1) {
            int j = allocation[i];
            int waste = blockSize[j] - processSize[i];   // internal fragmentation
            totalFragmentation += waste;
            allocatedCount++;
            cout << "B" << setw(14) << j + 1 << setw(12) << blockSize[j] << waste << "\n";
        } else {
            cout << setw(15) << "Not allocated" << setw(12) << "-" << "-\n";
        }
    }

    // Print the summary.
    cout << "\nTotal internal fragmentation: " << totalFragmentation << "\n";
    cout << "Processes allocated: " << allocatedCount << "\n";
    cout << "Processes not allocated: " << nProcesses - allocatedCount << "\n";
    return 0;
}
`,
    java: String.raw`// Best Fit: give each process the SMALLEST free block that is big enough.
// Each block can hold at most one process. Unused space inside a block is
// called internal fragmentation (block size - request).
public class Main {
    public static void main(String[] args) {
        // Change these values to try your own input.
        int[] blockSize = {100, 500, 200, 300, 600};   // sizes of blocks B1, B2, ...
        int[] processSize = {212, 417, 112, 426};       // memory requested by P1, P2, ...
        int nBlocks = blockSize.length;
        int nProcesses = processSize.length;

        boolean[] blockUsed = new boolean[nBlocks];   // true once a block holds a process
        int[] allocation = new int[nProcesses];       // block given to each process, or -1
        int totalFragmentation = 0;
        int allocatedCount = 0;

        // Handle the processes one at a time, in the order they are listed.
        for (int i = 0; i < nProcesses; i++) {
            allocation[i] = -1;   // -1 means "no block yet"

            // Look at every block in order.
            for (int j = 0; j < nBlocks; j++) {
                // A block can be used only if it is free and big enough.
                if (!blockUsed[j] && blockSize[j] >= processSize[i]) {
                    // Keep it if it is smaller than the best block found so far.
                    // Using < (not <=) means a tie goes to the block listed first.
                    if (allocation[i] == -1 || blockSize[j] < blockSize[allocation[i]]) {
                        allocation[i] = j;
                    }
                }
            }

            // Mark the chosen block as taken so no other process can use it.
            if (allocation[i] != -1) {
                blockUsed[allocation[i]] = true;
            }
        }

        // Print one row per process.
        System.out.print("Best Fit memory allocation\n\n");
        System.out.printf("%-9s%-9s%-15s%-12s%s\n", "Process", "Request", "Block", "Block size", "Internal fragmentation");
        for (int i = 0; i < nProcesses; i++) {
            if (allocation[i] != -1) {
                int j = allocation[i];
                int waste = blockSize[j] - processSize[i];   // internal fragmentation
                totalFragmentation += waste;
                allocatedCount++;
                System.out.printf("P%-8d%-9dB%-14d%-12d%d\n", i + 1, processSize[i], j + 1, blockSize[j], waste);
            } else {
                System.out.printf("P%-8d%-9d%-15s%-12s%s\n", i + 1, processSize[i], "Not allocated", "-", "-");
            }
        }

        // Print the summary.
        System.out.print("\nTotal internal fragmentation: " + totalFragmentation + "\n");
        System.out.print("Processes allocated: " + allocatedCount + "\n");
        System.out.print("Processes not allocated: " + (nProcesses - allocatedCount) + "\n");
    }
}
`,
  },
  worst: {
    c: String.raw`/* Worst Fit: give each process the LARGEST free block that is big enough.
   Each block can hold at most one process. Unused space inside a block is
   called internal fragmentation (block size - request). */
#include <stdio.h>

#define MAX 30   /* room for up to 30 blocks and 30 processes */

int main(void)
{
    /* Change these values to try your own input. */
    int blockSize[] = {100, 500, 200, 300, 600};   /* sizes of blocks B1, B2, ... */
    int processSize[] = {212, 417, 112, 426};       /* memory requested by P1, P2, ... */
    int nBlocks = sizeof(blockSize) / sizeof(blockSize[0]);
    int nProcesses = sizeof(processSize) / sizeof(processSize[0]);

    int blockUsed[MAX] = {0};   /* blockUsed[j] = 1 once block j holds a process */
    int allocation[MAX];        /* allocation[i] = block given to process i, or -1 */
    int totalFragmentation = 0;
    int allocatedCount = 0;
    int i, j;

    /* Handle the processes one at a time, in the order they are listed. */
    for (i = 0; i < nProcesses; i++) {
        allocation[i] = -1;   /* -1 means "no block yet" */

        /* Look at every block in order. */
        for (j = 0; j < nBlocks; j++) {
            /* A block can be used only if it is free and big enough. */
            if (!blockUsed[j] && blockSize[j] >= processSize[i]) {
                /* Keep it if it is larger than the best block found so far.
                   Using > (not >=) means a tie goes to the block listed first. */
                if (allocation[i] == -1 || blockSize[j] > blockSize[allocation[i]]) {
                    allocation[i] = j;
                }
            }
        }

        /* Mark the chosen block as taken so no other process can use it. */
        if (allocation[i] != -1) {
            blockUsed[allocation[i]] = 1;
        }
    }

    /* Print one row per process. */
    printf("Worst Fit memory allocation\n\n");
    printf("%-9s%-9s%-15s%-12s%s\n", "Process", "Request", "Block", "Block size", "Internal fragmentation");
    for (i = 0; i < nProcesses; i++) {
        if (allocation[i] != -1) {
            j = allocation[i];
            int waste = blockSize[j] - processSize[i];   /* internal fragmentation */
            totalFragmentation += waste;
            allocatedCount++;
            printf("P%-8d%-9dB%-14d%-12d%d\n", i + 1, processSize[i], j + 1, blockSize[j], waste);
        } else {
            printf("P%-8d%-9d%-15s%-12s%s\n", i + 1, processSize[i], "Not allocated", "-", "-");
        }
    }

    /* Print the summary. */
    printf("\nTotal internal fragmentation: %d\n", totalFragmentation);
    printf("Processes allocated: %d\n", allocatedCount);
    printf("Processes not allocated: %d\n", nProcesses - allocatedCount);
    return 0;
}
`,
    cpp: String.raw`// Worst Fit: give each process the LARGEST free block that is big enough.
// Each block can hold at most one process. Unused space inside a block is
// called internal fragmentation (block size - request).
#include <iostream>
#include <iomanip>
#include <vector>
using namespace std;

int main()
{
    // Change these values to try your own input.
    vector<int> blockSize = {100, 500, 200, 300, 600};   // sizes of blocks B1, B2, ...
    vector<int> processSize = {212, 417, 112, 426};       // memory requested by P1, P2, ...
    int nBlocks = blockSize.size();
    int nProcesses = processSize.size();

    vector<bool> blockUsed(nBlocks, false);   // true once a block holds a process
    vector<int> allocation(nProcesses, -1);   // block given to each process, or -1
    int totalFragmentation = 0;
    int allocatedCount = 0;

    // Handle the processes one at a time, in the order they are listed.
    for (int i = 0; i < nProcesses; i++) {
        // Look at every block in order.
        for (int j = 0; j < nBlocks; j++) {
            // A block can be used only if it is free and big enough.
            if (!blockUsed[j] && blockSize[j] >= processSize[i]) {
                // Keep it if it is larger than the best block found so far.
                // Using > (not >=) means a tie goes to the block listed first.
                if (allocation[i] == -1 || blockSize[j] > blockSize[allocation[i]]) {
                    allocation[i] = j;
                }
            }
        }

        // Mark the chosen block as taken so no other process can use it.
        if (allocation[i] != -1) {
            blockUsed[allocation[i]] = true;
        }
    }

    // Print one row per process.
    cout << "Worst Fit memory allocation\n\n";
    cout << left << setw(9) << "Process" << setw(9) << "Request" << setw(15) << "Block"
         << setw(12) << "Block size" << "Internal fragmentation\n";
    for (int i = 0; i < nProcesses; i++) {
        cout << "P" << setw(8) << i + 1 << setw(9) << processSize[i];
        if (allocation[i] != -1) {
            int j = allocation[i];
            int waste = blockSize[j] - processSize[i];   // internal fragmentation
            totalFragmentation += waste;
            allocatedCount++;
            cout << "B" << setw(14) << j + 1 << setw(12) << blockSize[j] << waste << "\n";
        } else {
            cout << setw(15) << "Not allocated" << setw(12) << "-" << "-\n";
        }
    }

    // Print the summary.
    cout << "\nTotal internal fragmentation: " << totalFragmentation << "\n";
    cout << "Processes allocated: " << allocatedCount << "\n";
    cout << "Processes not allocated: " << nProcesses - allocatedCount << "\n";
    return 0;
}
`,
    java: String.raw`// Worst Fit: give each process the LARGEST free block that is big enough.
// Each block can hold at most one process. Unused space inside a block is
// called internal fragmentation (block size - request).
public class Main {
    public static void main(String[] args) {
        // Change these values to try your own input.
        int[] blockSize = {100, 500, 200, 300, 600};   // sizes of blocks B1, B2, ...
        int[] processSize = {212, 417, 112, 426};       // memory requested by P1, P2, ...
        int nBlocks = blockSize.length;
        int nProcesses = processSize.length;

        boolean[] blockUsed = new boolean[nBlocks];   // true once a block holds a process
        int[] allocation = new int[nProcesses];       // block given to each process, or -1
        int totalFragmentation = 0;
        int allocatedCount = 0;

        // Handle the processes one at a time, in the order they are listed.
        for (int i = 0; i < nProcesses; i++) {
            allocation[i] = -1;   // -1 means "no block yet"

            // Look at every block in order.
            for (int j = 0; j < nBlocks; j++) {
                // A block can be used only if it is free and big enough.
                if (!blockUsed[j] && blockSize[j] >= processSize[i]) {
                    // Keep it if it is larger than the best block found so far.
                    // Using > (not >=) means a tie goes to the block listed first.
                    if (allocation[i] == -1 || blockSize[j] > blockSize[allocation[i]]) {
                        allocation[i] = j;
                    }
                }
            }

            // Mark the chosen block as taken so no other process can use it.
            if (allocation[i] != -1) {
                blockUsed[allocation[i]] = true;
            }
        }

        // Print one row per process.
        System.out.print("Worst Fit memory allocation\n\n");
        System.out.printf("%-9s%-9s%-15s%-12s%s\n", "Process", "Request", "Block", "Block size", "Internal fragmentation");
        for (int i = 0; i < nProcesses; i++) {
            if (allocation[i] != -1) {
                int j = allocation[i];
                int waste = blockSize[j] - processSize[i];   // internal fragmentation
                totalFragmentation += waste;
                allocatedCount++;
                System.out.printf("P%-8d%-9dB%-14d%-12d%d\n", i + 1, processSize[i], j + 1, blockSize[j], waste);
            } else {
                System.out.printf("P%-8d%-9d%-15s%-12s%s\n", i + 1, processSize[i], "Not allocated", "-", "-");
            }
        }

        // Print the summary.
        System.out.print("\nTotal internal fragmentation: " + totalFragmentation + "\n");
        System.out.print("Processes allocated: " + allocatedCount + "\n");
        System.out.print("Processes not allocated: " + (nProcesses - allocatedCount) + "\n");
    }
}
`,
  },
};
