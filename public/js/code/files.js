// Reference programs shown in the Code tab. Each one hard-codes the simulator's default sample input
// and prints the same results the simulator shows for it.
export const CODE = {
  sequential: {
    c: String.raw`#include <stdio.h>

#define MAX_BLOCKS 128

int main(void)
{
    /* Change these values to try your own input. */
    int diskSize = 20;                     /* number of blocks on the disk */
    int blockSize = 512;                   /* bytes per block */
    int reserved[] = {-1};                 /* unusable blocks, e.g. {2, 5, 8, 11}; -1 means none */
    const char *names[] = {"A", "B", "C", "D"};
    int sizes[] = {1500, 700, 2600, 300};  /* file sizes in bytes */
    int fileCount = 4;

    /* The disk is an array: -1 means the block is free, -2 means reserved,
       any other number is the position of the owning file in names[]. */
    int disk[MAX_BLOCKS];
    for (int b = 0; b < diskSize; b++)
        disk[b] = -1;
    for (int r = 0; r < (int)(sizeof(reserved) / sizeof(reserved[0])); r++)
        if (reserved[r] >= 0)
            disk[reserved[r]] = -2;

    printf("Sequential (contiguous) allocation\n");
    for (int f = 0; f < fileCount; f++) {
        /* Blocks needed = size / blockSize, rounded up. */
        int need = (sizes[f] + blockSize - 1) / blockSize;

        /* First fit: scan the disk for the first run of 'need' free blocks in a row. */
        int start = -1, run = 0, largest = 0, freeTotal = 0;
        for (int b = 0; b < diskSize; b++) {
            if (disk[b] == -1) {
                run++;
                freeTotal++;
                if (run > largest)
                    largest = run;
                if (run == need && start == -1)
                    start = b - need + 1;
            } else {
                run = 0;
            }
        }

        if (start == -1) {
            printf("File %s (%d bytes, %d blocks): FAILED - needs %d contiguous free blocks, "
                   "largest free run is %d\n", names[f], sizes[f], need, need, largest);
            if (freeTotal >= need)
                printf("    %d blocks are free in total: external fragmentation\n", freeTotal);
            continue;
        }

        /* Give the whole run of blocks to this file. */
        printf("File %s (%d bytes, %d blocks): start %d, length %d, blocks",
               names[f], sizes[f], need, start, need);
        for (int b = start; b < start + need; b++) {
            disk[b] = f;
            printf(" %d", b);
        }
        printf("\n");
    }

    /* Disk map: who owns each block (- = free, # = reserved). */
    printf("Disk map:");
    for (int b = 0; b < diskSize; b++) {
        if (disk[b] == -1)
            printf(" %d:-", b);
        else if (disk[b] == -2)
            printf(" %d:#", b);
        else
            printf(" %d:%s", b, names[disk[b]]);
    }
    printf("\n");
    return 0;
}
`,
    cpp: String.raw`#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main()
{
    // Change these values to try your own input.
    int diskSize = 20;                          // number of blocks on the disk
    int blockSize = 512;                        // bytes per block
    vector<int> reserved = {};                  // unusable blocks, e.g. {2, 5, 8, 11}
    vector<string> names = {"A", "B", "C", "D"};
    vector<int> sizes = {1500, 700, 2600, 300}; // file sizes in bytes

    // The disk is an array: -1 means the block is free, -2 means reserved,
    // any other number is the position of the owning file in names.
    vector<int> disk(diskSize, -1);
    for (int r : reserved)
        disk[r] = -2;

    cout << "Sequential (contiguous) allocation\n";
    for (int f = 0; f < (int)names.size(); f++) {
        // Blocks needed = size / blockSize, rounded up.
        int need = (sizes[f] + blockSize - 1) / blockSize;

        // First fit: scan the disk for the first run of 'need' free blocks in a row.
        int start = -1, run = 0, largest = 0, freeTotal = 0;
        for (int b = 0; b < diskSize; b++) {
            if (disk[b] == -1) {
                run++;
                freeTotal++;
                if (run > largest)
                    largest = run;
                if (run == need && start == -1)
                    start = b - need + 1;
            } else {
                run = 0;
            }
        }

        if (start == -1) {
            cout << "File " << names[f] << " (" << sizes[f] << " bytes, " << need << " blocks): FAILED - needs "
                 << need << " contiguous free blocks, largest free run is " << largest << "\n";
            if (freeTotal >= need)
                cout << "    " << freeTotal << " blocks are free in total: external fragmentation\n";
            continue;
        }

        // Give the whole run of blocks to this file.
        cout << "File " << names[f] << " (" << sizes[f] << " bytes, " << need << " blocks): start " << start
             << ", length " << need << ", blocks";
        for (int b = start; b < start + need; b++) {
            disk[b] = f;
            cout << " " << b;
        }
        cout << "\n";
    }

    // Disk map: who owns each block (- = free, # = reserved).
    cout << "Disk map:";
    for (int b = 0; b < diskSize; b++) {
        if (disk[b] == -1)
            cout << " " << b << ":-";
        else if (disk[b] == -2)
            cout << " " << b << ":#";
        else
            cout << " " << b << ":" << names[disk[b]];
    }
    cout << "\n";
    return 0;
}
`,
    java: String.raw`public class Main {
    public static void main(String[] args) {
        // Change these values to try your own input.
        int diskSize = 20;                        // number of blocks on the disk
        int blockSize = 512;                      // bytes per block
        int[] reserved = {};                      // unusable blocks, e.g. {2, 5, 8, 11}
        String[] names = {"A", "B", "C", "D"};
        int[] sizes = {1500, 700, 2600, 300};     // file sizes in bytes

        // The disk is an array: -1 means the block is free, -2 means reserved,
        // any other number is the position of the owning file in names.
        int[] disk = new int[diskSize];
        for (int b = 0; b < diskSize; b++)
            disk[b] = -1;
        for (int r : reserved)
            disk[r] = -2;

        System.out.println("Sequential (contiguous) allocation");
        for (int f = 0; f < names.length; f++) {
            // Blocks needed = size / blockSize, rounded up.
            int need = (sizes[f] + blockSize - 1) / blockSize;

            // First fit: scan the disk for the first run of 'need' free blocks in a row.
            int start = -1, run = 0, largest = 0, freeTotal = 0;
            for (int b = 0; b < diskSize; b++) {
                if (disk[b] == -1) {
                    run++;
                    freeTotal++;
                    if (run > largest)
                        largest = run;
                    if (run == need && start == -1)
                        start = b - need + 1;
                } else {
                    run = 0;
                }
            }

            if (start == -1) {
                System.out.println("File " + names[f] + " (" + sizes[f] + " bytes, " + need + " blocks): FAILED - needs "
                        + need + " contiguous free blocks, largest free run is " + largest);
                if (freeTotal >= need)
                    System.out.println("    " + freeTotal + " blocks are free in total: external fragmentation");
                continue;
            }

            // Give the whole run of blocks to this file.
            StringBuilder line = new StringBuilder("File " + names[f] + " (" + sizes[f] + " bytes, " + need
                    + " blocks): start " + start + ", length " + need + ", blocks");
            for (int b = start; b < start + need; b++) {
                disk[b] = f;
                line.append(" ").append(b);
            }
            System.out.println(line);
        }

        // Disk map: who owns each block (- = free, # = reserved).
        StringBuilder map = new StringBuilder("Disk map:");
        for (int b = 0; b < diskSize; b++) {
            if (disk[b] == -1)
                map.append(" ").append(b).append(":-");
            else if (disk[b] == -2)
                map.append(" ").append(b).append(":#");
            else
                map.append(" ").append(b).append(":").append(names[disk[b]]);
        }
        System.out.println(map);
    }
}
`,
  },
  indexed: {
    c: String.raw`#include <stdio.h>

#define MAX_BLOCKS 128

int main(void)
{
    /* Change these values to try your own input. */
    int diskSize = 20;                     /* number of blocks on the disk */
    int blockSize = 512;                   /* bytes per block */
    int reserved[] = {-1};                 /* unusable blocks, e.g. {2, 5, 8, 11}; -1 means none */
    const char *names[] = {"A", "B", "C", "D"};
    int sizes[] = {1500, 700, 2600, 300};  /* file sizes in bytes */
    int fileCount = 4;

    /* The disk is an array: -1 means the block is free, -2 means reserved,
       any other number is the position of the owning file in names[]. */
    int disk[MAX_BLOCKS];
    for (int b = 0; b < diskSize; b++)
        disk[b] = -1;
    for (int r = 0; r < (int)(sizeof(reserved) / sizeof(reserved[0])); r++)
        if (reserved[r] >= 0)
            disk[reserved[r]] = -2;

    /* One index block holds blockSize / 4 pointers (each pointer is 4 bytes). */
    int pointersPerIndex = blockSize / 4;

    printf("Indexed allocation\n");
    for (int f = 0; f < fileCount; f++) {
        /* Data blocks needed = size / blockSize, rounded up. The file also needs 1 index block. */
        int need = (sizes[f] + blockSize - 1) / blockSize;

        /* Make a list of the free blocks, lowest number first. */
        int freeList[MAX_BLOCKS];
        int freeCount = 0;
        for (int b = 0; b < diskSize; b++)
            if (disk[b] == -1)
                freeList[freeCount++] = b;

        if (need > pointersPerIndex) {
            printf("File %s (%d bytes): FAILED - needs %d pointers but one index block holds only %d\n",
                   names[f], sizes[f], need, pointersPerIndex);
            continue;
        }
        if (freeCount < need + 1) {
            printf("File %s (%d bytes): FAILED - disk full, needs %d blocks (%d data + 1 index) "
                   "but only %d are free\n", names[f], sizes[f], need + 1, need, freeCount);
            continue;
        }

        /* The lowest free block becomes the index block; the next free blocks hold the data. */
        int indexBlock = freeList[0];
        disk[indexBlock] = f;
        printf("File %s (%d bytes): index block %d, data blocks", names[f], sizes[f], indexBlock);
        for (int k = 1; k <= need; k++) {
            disk[freeList[k]] = f;  /* the index block stores this block number */
            printf(" %d", freeList[k]);
        }
        printf("\n");
    }

    /* Disk map: who owns each block (- = free, # = reserved). */
    printf("Disk map:");
    for (int b = 0; b < diskSize; b++) {
        if (disk[b] == -1)
            printf(" %d:-", b);
        else if (disk[b] == -2)
            printf(" %d:#", b);
        else
            printf(" %d:%s", b, names[disk[b]]);
    }
    printf("\n");
    return 0;
}
`,
    cpp: String.raw`#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main()
{
    // Change these values to try your own input.
    int diskSize = 20;                          // number of blocks on the disk
    int blockSize = 512;                        // bytes per block
    vector<int> reserved = {};                  // unusable blocks, e.g. {2, 5, 8, 11}
    vector<string> names = {"A", "B", "C", "D"};
    vector<int> sizes = {1500, 700, 2600, 300}; // file sizes in bytes

    // The disk is an array: -1 means the block is free, -2 means reserved,
    // any other number is the position of the owning file in names.
    vector<int> disk(diskSize, -1);
    for (int r : reserved)
        disk[r] = -2;

    // One index block holds blockSize / 4 pointers (each pointer is 4 bytes).
    int pointersPerIndex = blockSize / 4;

    cout << "Indexed allocation\n";
    for (int f = 0; f < (int)names.size(); f++) {
        // Data blocks needed = size / blockSize, rounded up. The file also needs 1 index block.
        int need = (sizes[f] + blockSize - 1) / blockSize;

        // Make a list of the free blocks, lowest number first.
        vector<int> freeList;
        for (int b = 0; b < diskSize; b++)
            if (disk[b] == -1)
                freeList.push_back(b);

        if (need > pointersPerIndex) {
            cout << "File " << names[f] << " (" << sizes[f] << " bytes): FAILED - needs " << need
                 << " pointers but one index block holds only " << pointersPerIndex << "\n";
            continue;
        }
        if ((int)freeList.size() < need + 1) {
            cout << "File " << names[f] << " (" << sizes[f] << " bytes): FAILED - disk full, needs " << need + 1
                 << " blocks (" << need << " data + 1 index) but only " << freeList.size() << " are free\n";
            continue;
        }

        // The lowest free block becomes the index block; the next free blocks hold the data.
        int indexBlock = freeList[0];
        disk[indexBlock] = f;
        cout << "File " << names[f] << " (" << sizes[f] << " bytes): index block " << indexBlock << ", data blocks";
        for (int k = 1; k <= need; k++) {
            disk[freeList[k]] = f;  // the index block stores this block number
            cout << " " << freeList[k];
        }
        cout << "\n";
    }

    // Disk map: who owns each block (- = free, # = reserved).
    cout << "Disk map:";
    for (int b = 0; b < diskSize; b++) {
        if (disk[b] == -1)
            cout << " " << b << ":-";
        else if (disk[b] == -2)
            cout << " " << b << ":#";
        else
            cout << " " << b << ":" << names[disk[b]];
    }
    cout << "\n";
    return 0;
}
`,
    java: String.raw`import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        // Change these values to try your own input.
        int diskSize = 20;                        // number of blocks on the disk
        int blockSize = 512;                      // bytes per block
        int[] reserved = {};                      // unusable blocks, e.g. {2, 5, 8, 11}
        String[] names = {"A", "B", "C", "D"};
        int[] sizes = {1500, 700, 2600, 300};     // file sizes in bytes

        // The disk is an array: -1 means the block is free, -2 means reserved,
        // any other number is the position of the owning file in names.
        int[] disk = new int[diskSize];
        for (int b = 0; b < diskSize; b++)
            disk[b] = -1;
        for (int r : reserved)
            disk[r] = -2;

        // One index block holds blockSize / 4 pointers (each pointer is 4 bytes).
        int pointersPerIndex = blockSize / 4;

        System.out.println("Indexed allocation");
        for (int f = 0; f < names.length; f++) {
            // Data blocks needed = size / blockSize, rounded up. The file also needs 1 index block.
            int need = (sizes[f] + blockSize - 1) / blockSize;

            // Make a list of the free blocks, lowest number first.
            List<Integer> freeList = new ArrayList<>();
            for (int b = 0; b < diskSize; b++)
                if (disk[b] == -1)
                    freeList.add(b);

            if (need > pointersPerIndex) {
                System.out.println("File " + names[f] + " (" + sizes[f] + " bytes): FAILED - needs " + need
                        + " pointers but one index block holds only " + pointersPerIndex);
                continue;
            }
            if (freeList.size() < need + 1) {
                System.out.println("File " + names[f] + " (" + sizes[f] + " bytes): FAILED - disk full, needs " + (need + 1)
                        + " blocks (" + need + " data + 1 index) but only " + freeList.size() + " are free");
                continue;
            }

            // The lowest free block becomes the index block; the next free blocks hold the data.
            int indexBlock = freeList.get(0);
            disk[indexBlock] = f;
            StringBuilder line = new StringBuilder("File " + names[f] + " (" + sizes[f] + " bytes): index block "
                    + indexBlock + ", data blocks");
            for (int k = 1; k <= need; k++) {
                disk[freeList.get(k)] = f;  // the index block stores this block number
                line.append(" ").append(freeList.get(k));
            }
            System.out.println(line);
        }

        // Disk map: who owns each block (- = free, # = reserved).
        StringBuilder map = new StringBuilder("Disk map:");
        for (int b = 0; b < diskSize; b++) {
            if (disk[b] == -1)
                map.append(" ").append(b).append(":-");
            else if (disk[b] == -2)
                map.append(" ").append(b).append(":#");
            else
                map.append(" ").append(b).append(":").append(names[disk[b]]);
        }
        System.out.println(map);
    }
}
`,
  },
  linked: {
    c: String.raw`#include <stdio.h>

#define MAX_BLOCKS 128

int main(void)
{
    /* Change these values to try your own input. */
    int diskSize = 20;                     /* number of blocks on the disk */
    int blockSize = 512;                   /* bytes per block */
    int reserved[] = {-1};                 /* unusable blocks, e.g. {2, 5, 8, 11}; -1 means none */
    const char *names[] = {"A", "B", "C", "D"};
    int sizes[] = {1500, 700, 2600, 300};  /* file sizes in bytes */
    int fileCount = 4;

    /* The disk is an array: -1 means the block is free, -2 means reserved,
       any other number is the position of the owning file in names[]. */
    int disk[MAX_BLOCKS];
    int nextBlock[MAX_BLOCKS];  /* nextBlock[b] = the block that follows b in its file (-1 = end) */
    for (int b = 0; b < diskSize; b++) {
        disk[b] = -1;
        nextBlock[b] = -1;
    }
    for (int r = 0; r < (int)(sizeof(reserved) / sizeof(reserved[0])); r++)
        if (reserved[r] >= 0)
            disk[reserved[r]] = -2;

    /* Each block keeps 4 bytes for the next pointer, so it holds blockSize - 4 data bytes. */
    int usable = blockSize - 4;

    printf("Linked allocation\n");
    for (int f = 0; f < fileCount; f++) {
        /* Blocks needed = size / usable, rounded up. */
        int need = (sizes[f] + usable - 1) / usable;

        /* Make a list of the free blocks, lowest number first. */
        int freeList[MAX_BLOCKS];
        int freeCount = 0;
        for (int b = 0; b < diskSize; b++)
            if (disk[b] == -1)
                freeList[freeCount++] = b;

        if (freeCount < need) {
            printf("File %s (%d bytes): FAILED - disk full, needs %d blocks but only %d are free\n",
                   names[f], sizes[f], need, freeCount);
            continue;
        }

        /* Take the first 'need' free blocks and point each one at the next. */
        for (int k = 0; k < need; k++) {
            disk[freeList[k]] = f;
            nextBlock[freeList[k]] = (k + 1 < need) ? freeList[k + 1] : -1;
        }

        /* Follow the chain from the first block, like reading the file. */
        printf("File %s (%d bytes): ", names[f], sizes[f]);
        for (int b = freeList[0]; b != -1; b = nextBlock[b])
            printf("%d -> ", b);
        printf("end\n");
    }

    /* Disk map: who owns each block (- = free, # = reserved). */
    printf("Disk map:");
    for (int b = 0; b < diskSize; b++) {
        if (disk[b] == -1)
            printf(" %d:-", b);
        else if (disk[b] == -2)
            printf(" %d:#", b);
        else
            printf(" %d:%s", b, names[disk[b]]);
    }
    printf("\n");
    return 0;
}
`,
    cpp: String.raw`#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main()
{
    // Change these values to try your own input.
    int diskSize = 20;                          // number of blocks on the disk
    int blockSize = 512;                        // bytes per block
    vector<int> reserved = {};                  // unusable blocks, e.g. {2, 5, 8, 11}
    vector<string> names = {"A", "B", "C", "D"};
    vector<int> sizes = {1500, 700, 2600, 300}; // file sizes in bytes

    // The disk is an array: -1 means the block is free, -2 means reserved,
    // any other number is the position of the owning file in names.
    vector<int> disk(diskSize, -1);
    vector<int> nextBlock(diskSize, -1);  // nextBlock[b] = the block that follows b in its file (-1 = end)
    for (int r : reserved)
        disk[r] = -2;

    // Each block keeps 4 bytes for the next pointer, so it holds blockSize - 4 data bytes.
    int usable = blockSize - 4;

    cout << "Linked allocation\n";
    for (int f = 0; f < (int)names.size(); f++) {
        // Blocks needed = size / usable, rounded up.
        int need = (sizes[f] + usable - 1) / usable;

        // Make a list of the free blocks, lowest number first.
        vector<int> freeList;
        for (int b = 0; b < diskSize; b++)
            if (disk[b] == -1)
                freeList.push_back(b);

        if ((int)freeList.size() < need) {
            cout << "File " << names[f] << " (" << sizes[f] << " bytes): FAILED - disk full, needs " << need
                 << " blocks but only " << freeList.size() << " are free\n";
            continue;
        }

        // Take the first 'need' free blocks and point each one at the next.
        for (int k = 0; k < need; k++) {
            disk[freeList[k]] = f;
            nextBlock[freeList[k]] = (k + 1 < need) ? freeList[k + 1] : -1;
        }

        // Follow the chain from the first block, like reading the file.
        cout << "File " << names[f] << " (" << sizes[f] << " bytes): ";
        for (int b = freeList[0]; b != -1; b = nextBlock[b])
            cout << b << " -> ";
        cout << "end\n";
    }

    // Disk map: who owns each block (- = free, # = reserved).
    cout << "Disk map:";
    for (int b = 0; b < diskSize; b++) {
        if (disk[b] == -1)
            cout << " " << b << ":-";
        else if (disk[b] == -2)
            cout << " " << b << ":#";
        else
            cout << " " << b << ":" << names[disk[b]];
    }
    cout << "\n";
    return 0;
}
`,
    java: String.raw`import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        // Change these values to try your own input.
        int diskSize = 20;                        // number of blocks on the disk
        int blockSize = 512;                      // bytes per block
        int[] reserved = {};                      // unusable blocks, e.g. {2, 5, 8, 11}
        String[] names = {"A", "B", "C", "D"};
        int[] sizes = {1500, 700, 2600, 300};     // file sizes in bytes

        // The disk is an array: -1 means the block is free, -2 means reserved,
        // any other number is the position of the owning file in names.
        int[] disk = new int[diskSize];
        int[] nextBlock = new int[diskSize];      // nextBlock[b] = the block that follows b in its file (-1 = end)
        for (int b = 0; b < diskSize; b++) {
            disk[b] = -1;
            nextBlock[b] = -1;
        }
        for (int r : reserved)
            disk[r] = -2;

        // Each block keeps 4 bytes for the next pointer, so it holds blockSize - 4 data bytes.
        int usable = blockSize - 4;

        System.out.println("Linked allocation");
        for (int f = 0; f < names.length; f++) {
            // Blocks needed = size / usable, rounded up.
            int need = (sizes[f] + usable - 1) / usable;

            // Make a list of the free blocks, lowest number first.
            List<Integer> freeList = new ArrayList<>();
            for (int b = 0; b < diskSize; b++)
                if (disk[b] == -1)
                    freeList.add(b);

            if (freeList.size() < need) {
                System.out.println("File " + names[f] + " (" + sizes[f] + " bytes): FAILED - disk full, needs " + need
                        + " blocks but only " + freeList.size() + " are free");
                continue;
            }

            // Take the first 'need' free blocks and point each one at the next.
            for (int k = 0; k < need; k++) {
                disk[freeList.get(k)] = f;
                nextBlock[freeList.get(k)] = (k + 1 < need) ? freeList.get(k + 1) : -1;
            }

            // Follow the chain from the first block, like reading the file.
            StringBuilder line = new StringBuilder("File " + names[f] + " (" + sizes[f] + " bytes): ");
            for (int b = freeList.get(0); b != -1; b = nextBlock[b])
                line.append(b).append(" -> ");
            line.append("end");
            System.out.println(line);
        }

        // Disk map: who owns each block (- = free, # = reserved).
        StringBuilder map = new StringBuilder("Disk map:");
        for (int b = 0; b < diskSize; b++) {
            if (disk[b] == -1)
                map.append(" ").append(b).append(":-");
            else if (disk[b] == -2)
                map.append(" ").append(b).append(":#");
            else
                map.append(" ").append(b).append(":").append(names[disk[b]]);
        }
        System.out.println(map);
    }
}
`,
  },
};
