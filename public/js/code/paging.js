// Reference programs shown in the Code tab. Each one hard-codes the simulator's default sample input
// and prints the same results the simulator shows for it.
export const CODE = {
  fifo: {
    c: String.raw`#include <stdio.h>

#define MAX_FRAMES 16
#define EMPTY -1   /* marks a frame that does not hold a page yet */

int main(void)
{
    /* Change these values to try your own input. */
    int refs[] = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1};
    int frameCount = 3;   /* number of frames in memory (1 to 16) */

    int n = sizeof(refs) / sizeof(refs[0]);
    int frames[MAX_FRAMES];    /* the page held in each frame */
    int loadedAt[MAX_FRAMES];  /* when (which reference) each frame's page was loaded */
    int faults = 0, hits = 0;
    int i, j;

    for (j = 0; j < frameCount; j++) {
        frames[j] = EMPTY;
        loadedAt[j] = 0;
    }

    printf("FIFO page replacement with %d frames\n\n", frameCount);

    for (i = 0; i < n; i++) {
        int page = refs[i];
        int found = 0;

        /* Is the page already in one of the frames? */
        for (j = 0; j < frameCount; j++) {
            if (frames[j] == page) {
                found = 1;
            }
        }

        if (found) {
            /* A hit: the page is already in memory. FIFO order does not change. */
            hits++;
        } else {
            /* A page fault: the page was not in memory and had to be loaded. */
            int slot = -1;
            faults++;

            /* Use the first empty frame, if there is one. */
            for (j = 0; j < frameCount && slot == -1; j++) {
                if (frames[j] == EMPTY) {
                    slot = j;
                }
            }

            /* Memory is full: evict the page that was loaded earliest (first in, first out). */
            if (slot == -1) {
                slot = 0;
                for (j = 1; j < frameCount; j++) {
                    if (loadedAt[j] < loadedAt[slot]) {
                        slot = j;
                    }
                }
            }

            /* The new page takes the chosen frame. */
            frames[slot] = page;
            loadedAt[slot] = i;
        }

        /* Show the frame contents after this reference. */
        printf("Page %3d:", page);
        for (j = 0; j < frameCount; j++) {
            if (frames[j] == EMPTY) {
                printf("   -");
            } else {
                printf(" %3d", frames[j]);
            }
        }
        printf("   %s\n", found ? "HIT" : "FAULT");
    }

    printf("\nTotal page faults: %d\n", faults);
    printf("Total page hits:   %d\n", hits);
    printf("Fault rate: %.2f%%\n", faults * 100.0 / n);
    printf("Hit rate:   %.2f%%\n", hits * 100.0 / n);
    return 0;
}
`,
    cpp: String.raw`#include <iostream>
#include <iomanip>
#include <vector>

const int EMPTY = -1;   // marks a frame that does not hold a page yet

int main()
{
    // Change these values to try your own input.
    std::vector<int> refs = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1};
    int frameCount = 3;   // number of frames in memory

    int n = refs.size();
    std::vector<int> frames(frameCount, EMPTY);   // the page held in each frame
    std::vector<int> loadedAt(frameCount, 0);     // when (which reference) each frame's page was loaded
    int faults = 0, hits = 0;

    std::cout << "FIFO page replacement with " << frameCount << " frames\n\n";

    for (int i = 0; i < n; i++) {
        int page = refs[i];
        bool found = false;

        // Is the page already in one of the frames?
        for (int j = 0; j < frameCount; j++) {
            if (frames[j] == page) {
                found = true;
            }
        }

        if (found) {
            // A hit: the page is already in memory. FIFO order does not change.
            hits++;
        } else {
            // A page fault: the page was not in memory and had to be loaded.
            faults++;
            int slot = -1;

            // Use the first empty frame, if there is one.
            for (int j = 0; j < frameCount && slot == -1; j++) {
                if (frames[j] == EMPTY) {
                    slot = j;
                }
            }

            // Memory is full: evict the page that was loaded earliest (first in, first out).
            if (slot == -1) {
                slot = 0;
                for (int j = 1; j < frameCount; j++) {
                    if (loadedAt[j] < loadedAt[slot]) {
                        slot = j;
                    }
                }
            }

            // The new page takes the chosen frame.
            frames[slot] = page;
            loadedAt[slot] = i;
        }

        // Show the frame contents after this reference.
        std::cout << "Page " << std::setw(3) << page << ":";
        for (int j = 0; j < frameCount; j++) {
            if (frames[j] == EMPTY) {
                std::cout << "   -";
            } else {
                std::cout << " " << std::setw(3) << frames[j];
            }
        }
        std::cout << "   " << (found ? "HIT" : "FAULT") << "\n";
    }

    std::cout << std::fixed << std::setprecision(2);
    std::cout << "\nTotal page faults: " << faults << "\n";
    std::cout << "Total page hits:   " << hits << "\n";
    std::cout << "Fault rate: " << faults * 100.0 / n << "%\n";
    std::cout << "Hit rate:   " << hits * 100.0 / n << "%\n";
    return 0;
}
`,
    java: String.raw`import java.util.Locale;

public class Main {
    static final int EMPTY = -1;   // marks a frame that does not hold a page yet

    public static void main(String[] args) {
        // Change these values to try your own input.
        int[] refs = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1};
        int frameCount = 3;   // number of frames in memory

        int n = refs.length;
        int[] frames = new int[frameCount];     // the page held in each frame
        int[] loadedAt = new int[frameCount];   // when (which reference) each frame's page was loaded
        int faults = 0, hits = 0;

        for (int j = 0; j < frameCount; j++) {
            frames[j] = EMPTY;
        }

        System.out.print("FIFO page replacement with " + frameCount + " frames\n\n");

        for (int i = 0; i < n; i++) {
            int page = refs[i];
            boolean found = false;

            // Is the page already in one of the frames?
            for (int j = 0; j < frameCount; j++) {
                if (frames[j] == page) {
                    found = true;
                }
            }

            if (found) {
                // A hit: the page is already in memory. FIFO order does not change.
                hits++;
            } else {
                // A page fault: the page was not in memory and had to be loaded.
                faults++;
                int slot = -1;

                // Use the first empty frame, if there is one.
                for (int j = 0; j < frameCount && slot == -1; j++) {
                    if (frames[j] == EMPTY) {
                        slot = j;
                    }
                }

                // Memory is full: evict the page that was loaded earliest (first in, first out).
                if (slot == -1) {
                    slot = 0;
                    for (int j = 1; j < frameCount; j++) {
                        if (loadedAt[j] < loadedAt[slot]) {
                            slot = j;
                        }
                    }
                }

                // The new page takes the chosen frame.
                frames[slot] = page;
                loadedAt[slot] = i;
            }

            // Show the frame contents after this reference.
            System.out.printf("Page %3d:", page);
            for (int j = 0; j < frameCount; j++) {
                if (frames[j] == EMPTY) {
                    System.out.print("   -");
                } else {
                    System.out.printf(" %3d", frames[j]);
                }
            }
            System.out.print("   " + (found ? "HIT" : "FAULT") + "\n");
        }

        System.out.print("\nTotal page faults: " + faults + "\n");
        System.out.print("Total page hits:   " + hits + "\n");
        // Locale.US makes sure the decimal point is printed as a dot.
        System.out.printf(Locale.US, "Fault rate: %.2f%%\n", faults * 100.0 / n);
        System.out.printf(Locale.US, "Hit rate:   %.2f%%\n", hits * 100.0 / n);
    }
}
`,
  },
  optimal: {
    c: String.raw`#include <stdio.h>

#define MAX_FRAMES 16
#define EMPTY -1   /* marks a frame that does not hold a page yet */

int main(void)
{
    /* Change these values to try your own input. */
    int refs[] = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1};
    int frameCount = 3;   /* number of frames in memory (1 to 16) */

    int n = sizeof(refs) / sizeof(refs[0]);
    int frames[MAX_FRAMES];    /* the page held in each frame */
    int loadedAt[MAX_FRAMES];  /* when (which reference) each frame's page was loaded */
    int faults = 0, hits = 0;
    int i, j, k;

    for (j = 0; j < frameCount; j++) {
        frames[j] = EMPTY;
        loadedAt[j] = 0;
    }

    printf("Optimal page replacement with %d frames\n\n", frameCount);

    for (i = 0; i < n; i++) {
        int page = refs[i];
        int found = 0;

        /* Is the page already in one of the frames? */
        for (j = 0; j < frameCount; j++) {
            if (frames[j] == page) {
                found = 1;
            }
        }

        if (found) {
            /* A hit: the page is already in memory. Nothing to replace. */
            hits++;
        } else {
            /* A page fault: the page was not in memory and had to be loaded. */
            int slot = -1;
            faults++;

            /* Use the first empty frame, if there is one. */
            for (j = 0; j < frameCount && slot == -1; j++) {
                if (frames[j] == EMPTY) {
                    slot = j;
                }
            }

            /* Memory is full: look into the future and evict the page
               whose next use is farthest away (or that is never used again). */
            if (slot == -1) {
                int bestNext = -1;
                for (j = 0; j < frameCount; j++) {
                    int next = n;   /* n means "never used again" */
                    for (k = i + 1; k < n; k++) {
                        if (refs[k] == frames[j]) {
                            next = k;
                            break;
                        }
                    }
                    /* Tie (several never used again): evict the one loaded earliest. */
                    if (next > bestNext || (next == bestNext && loadedAt[j] < loadedAt[slot])) {
                        bestNext = next;
                        slot = j;
                    }
                }
            }

            /* The new page takes the chosen frame. */
            frames[slot] = page;
            loadedAt[slot] = i;
        }

        /* Show the frame contents after this reference. */
        printf("Page %3d:", page);
        for (j = 0; j < frameCount; j++) {
            if (frames[j] == EMPTY) {
                printf("   -");
            } else {
                printf(" %3d", frames[j]);
            }
        }
        printf("   %s\n", found ? "HIT" : "FAULT");
    }

    printf("\nTotal page faults: %d\n", faults);
    printf("Total page hits:   %d\n", hits);
    printf("Fault rate: %.2f%%\n", faults * 100.0 / n);
    printf("Hit rate:   %.2f%%\n", hits * 100.0 / n);
    return 0;
}
`,
    cpp: String.raw`#include <iostream>
#include <iomanip>
#include <vector>

const int EMPTY = -1;   // marks a frame that does not hold a page yet

int main()
{
    // Change these values to try your own input.
    std::vector<int> refs = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1};
    int frameCount = 3;   // number of frames in memory

    int n = refs.size();
    std::vector<int> frames(frameCount, EMPTY);   // the page held in each frame
    std::vector<int> loadedAt(frameCount, 0);     // when (which reference) each frame's page was loaded
    int faults = 0, hits = 0;

    std::cout << "Optimal page replacement with " << frameCount << " frames\n\n";

    for (int i = 0; i < n; i++) {
        int page = refs[i];
        bool found = false;

        // Is the page already in one of the frames?
        for (int j = 0; j < frameCount; j++) {
            if (frames[j] == page) {
                found = true;
            }
        }

        if (found) {
            // A hit: the page is already in memory. Nothing to replace.
            hits++;
        } else {
            // A page fault: the page was not in memory and had to be loaded.
            faults++;
            int slot = -1;

            // Use the first empty frame, if there is one.
            for (int j = 0; j < frameCount && slot == -1; j++) {
                if (frames[j] == EMPTY) {
                    slot = j;
                }
            }

            // Memory is full: look into the future and evict the page
            // whose next use is farthest away (or that is never used again).
            if (slot == -1) {
                int bestNext = -1;
                for (int j = 0; j < frameCount; j++) {
                    int next = n;   // n means "never used again"
                    for (int k = i + 1; k < n; k++) {
                        if (refs[k] == frames[j]) {
                            next = k;
                            break;
                        }
                    }
                    // Tie (several never used again): evict the one loaded earliest.
                    if (next > bestNext || (next == bestNext && loadedAt[j] < loadedAt[slot])) {
                        bestNext = next;
                        slot = j;
                    }
                }
            }

            // The new page takes the chosen frame.
            frames[slot] = page;
            loadedAt[slot] = i;
        }

        // Show the frame contents after this reference.
        std::cout << "Page " << std::setw(3) << page << ":";
        for (int j = 0; j < frameCount; j++) {
            if (frames[j] == EMPTY) {
                std::cout << "   -";
            } else {
                std::cout << " " << std::setw(3) << frames[j];
            }
        }
        std::cout << "   " << (found ? "HIT" : "FAULT") << "\n";
    }

    std::cout << std::fixed << std::setprecision(2);
    std::cout << "\nTotal page faults: " << faults << "\n";
    std::cout << "Total page hits:   " << hits << "\n";
    std::cout << "Fault rate: " << faults * 100.0 / n << "%\n";
    std::cout << "Hit rate:   " << hits * 100.0 / n << "%\n";
    return 0;
}
`,
    java: String.raw`import java.util.Locale;

public class Main {
    static final int EMPTY = -1;   // marks a frame that does not hold a page yet

    public static void main(String[] args) {
        // Change these values to try your own input.
        int[] refs = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1};
        int frameCount = 3;   // number of frames in memory

        int n = refs.length;
        int[] frames = new int[frameCount];     // the page held in each frame
        int[] loadedAt = new int[frameCount];   // when (which reference) each frame's page was loaded
        int faults = 0, hits = 0;

        for (int j = 0; j < frameCount; j++) {
            frames[j] = EMPTY;
        }

        System.out.print("Optimal page replacement with " + frameCount + " frames\n\n");

        for (int i = 0; i < n; i++) {
            int page = refs[i];
            boolean found = false;

            // Is the page already in one of the frames?
            for (int j = 0; j < frameCount; j++) {
                if (frames[j] == page) {
                    found = true;
                }
            }

            if (found) {
                // A hit: the page is already in memory. Nothing to replace.
                hits++;
            } else {
                // A page fault: the page was not in memory and had to be loaded.
                faults++;
                int slot = -1;

                // Use the first empty frame, if there is one.
                for (int j = 0; j < frameCount && slot == -1; j++) {
                    if (frames[j] == EMPTY) {
                        slot = j;
                    }
                }

                // Memory is full: look into the future and evict the page
                // whose next use is farthest away (or that is never used again).
                if (slot == -1) {
                    int bestNext = -1;
                    for (int j = 0; j < frameCount; j++) {
                        int next = n;   // n means "never used again"
                        for (int k = i + 1; k < n; k++) {
                            if (refs[k] == frames[j]) {
                                next = k;
                                break;
                            }
                        }
                        // Tie (several never used again): evict the one loaded earliest.
                        if (next > bestNext || (next == bestNext && loadedAt[j] < loadedAt[slot])) {
                            bestNext = next;
                            slot = j;
                        }
                    }
                }

                // The new page takes the chosen frame.
                frames[slot] = page;
                loadedAt[slot] = i;
            }

            // Show the frame contents after this reference.
            System.out.printf("Page %3d:", page);
            for (int j = 0; j < frameCount; j++) {
                if (frames[j] == EMPTY) {
                    System.out.print("   -");
                } else {
                    System.out.printf(" %3d", frames[j]);
                }
            }
            System.out.print("   " + (found ? "HIT" : "FAULT") + "\n");
        }

        System.out.print("\nTotal page faults: " + faults + "\n");
        System.out.print("Total page hits:   " + hits + "\n");
        // Locale.US makes sure the decimal point is printed as a dot.
        System.out.printf(Locale.US, "Fault rate: %.2f%%\n", faults * 100.0 / n);
        System.out.printf(Locale.US, "Hit rate:   %.2f%%\n", hits * 100.0 / n);
    }
}
`,
  },
  lru: {
    c: String.raw`#include <stdio.h>

#define MAX_FRAMES 16
#define EMPTY -1   /* marks a frame that does not hold a page yet */

int main(void)
{
    /* Change these values to try your own input. */
    int refs[] = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1};
    int frameCount = 3;   /* number of frames in memory (1 to 16) */

    int n = sizeof(refs) / sizeof(refs[0]);
    int frames[MAX_FRAMES];    /* the page held in each frame */
    int lastUsed[MAX_FRAMES];  /* when (which reference) each frame's page was last used */
    int faults = 0, hits = 0;
    int i, j;

    for (j = 0; j < frameCount; j++) {
        frames[j] = EMPTY;
        lastUsed[j] = 0;
    }

    printf("LRU page replacement with %d frames\n\n", frameCount);

    for (i = 0; i < n; i++) {
        int page = refs[i];
        int found = -1;   /* frame holding the page, or -1 if it is not in memory */

        /* Is the page already in one of the frames? */
        for (j = 0; j < frameCount; j++) {
            if (frames[j] == page) {
                found = j;
            }
        }

        if (found != -1) {
            /* A hit: the page is already in memory. Remember that it was just used. */
            hits++;
            lastUsed[found] = i;
        } else {
            /* A page fault: the page was not in memory and had to be loaded. */
            int slot = -1;
            faults++;

            /* Use the first empty frame, if there is one. */
            for (j = 0; j < frameCount && slot == -1; j++) {
                if (frames[j] == EMPTY) {
                    slot = j;
                }
            }

            /* Memory is full: evict the least recently used page. */
            if (slot == -1) {
                slot = 0;
                for (j = 1; j < frameCount; j++) {
                    if (lastUsed[j] < lastUsed[slot]) {
                        slot = j;
                    }
                }
            }

            /* The new page takes the chosen frame. */
            frames[slot] = page;
            lastUsed[slot] = i;
        }

        /* Show the frame contents after this reference. */
        printf("Page %3d:", page);
        for (j = 0; j < frameCount; j++) {
            if (frames[j] == EMPTY) {
                printf("   -");
            } else {
                printf(" %3d", frames[j]);
            }
        }
        printf("   %s\n", found != -1 ? "HIT" : "FAULT");
    }

    printf("\nTotal page faults: %d\n", faults);
    printf("Total page hits:   %d\n", hits);
    printf("Fault rate: %.2f%%\n", faults * 100.0 / n);
    printf("Hit rate:   %.2f%%\n", hits * 100.0 / n);
    return 0;
}
`,
    cpp: String.raw`#include <iostream>
#include <iomanip>
#include <vector>

const int EMPTY = -1;   // marks a frame that does not hold a page yet

int main()
{
    // Change these values to try your own input.
    std::vector<int> refs = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1};
    int frameCount = 3;   // number of frames in memory

    int n = refs.size();
    std::vector<int> frames(frameCount, EMPTY);   // the page held in each frame
    std::vector<int> lastUsed(frameCount, 0);     // when (which reference) each frame's page was last used
    int faults = 0, hits = 0;

    std::cout << "LRU page replacement with " << frameCount << " frames\n\n";

    for (int i = 0; i < n; i++) {
        int page = refs[i];
        int found = -1;   // frame holding the page, or -1 if it is not in memory

        // Is the page already in one of the frames?
        for (int j = 0; j < frameCount; j++) {
            if (frames[j] == page) {
                found = j;
            }
        }

        if (found != -1) {
            // A hit: the page is already in memory. Remember that it was just used.
            hits++;
            lastUsed[found] = i;
        } else {
            // A page fault: the page was not in memory and had to be loaded.
            faults++;
            int slot = -1;

            // Use the first empty frame, if there is one.
            for (int j = 0; j < frameCount && slot == -1; j++) {
                if (frames[j] == EMPTY) {
                    slot = j;
                }
            }

            // Memory is full: evict the least recently used page.
            if (slot == -1) {
                slot = 0;
                for (int j = 1; j < frameCount; j++) {
                    if (lastUsed[j] < lastUsed[slot]) {
                        slot = j;
                    }
                }
            }

            // The new page takes the chosen frame.
            frames[slot] = page;
            lastUsed[slot] = i;
        }

        // Show the frame contents after this reference.
        std::cout << "Page " << std::setw(3) << page << ":";
        for (int j = 0; j < frameCount; j++) {
            if (frames[j] == EMPTY) {
                std::cout << "   -";
            } else {
                std::cout << " " << std::setw(3) << frames[j];
            }
        }
        std::cout << "   " << (found != -1 ? "HIT" : "FAULT") << "\n";
    }

    std::cout << std::fixed << std::setprecision(2);
    std::cout << "\nTotal page faults: " << faults << "\n";
    std::cout << "Total page hits:   " << hits << "\n";
    std::cout << "Fault rate: " << faults * 100.0 / n << "%\n";
    std::cout << "Hit rate:   " << hits * 100.0 / n << "%\n";
    return 0;
}
`,
    java: String.raw`import java.util.Locale;

public class Main {
    static final int EMPTY = -1;   // marks a frame that does not hold a page yet

    public static void main(String[] args) {
        // Change these values to try your own input.
        int[] refs = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1};
        int frameCount = 3;   // number of frames in memory

        int n = refs.length;
        int[] frames = new int[frameCount];     // the page held in each frame
        int[] lastUsed = new int[frameCount];   // when (which reference) each frame's page was last used
        int faults = 0, hits = 0;

        for (int j = 0; j < frameCount; j++) {
            frames[j] = EMPTY;
        }

        System.out.print("LRU page replacement with " + frameCount + " frames\n\n");

        for (int i = 0; i < n; i++) {
            int page = refs[i];
            int found = -1;   // frame holding the page, or -1 if it is not in memory

            // Is the page already in one of the frames?
            for (int j = 0; j < frameCount; j++) {
                if (frames[j] == page) {
                    found = j;
                }
            }

            if (found != -1) {
                // A hit: the page is already in memory. Remember that it was just used.
                hits++;
                lastUsed[found] = i;
            } else {
                // A page fault: the page was not in memory and had to be loaded.
                faults++;
                int slot = -1;

                // Use the first empty frame, if there is one.
                for (int j = 0; j < frameCount && slot == -1; j++) {
                    if (frames[j] == EMPTY) {
                        slot = j;
                    }
                }

                // Memory is full: evict the least recently used page.
                if (slot == -1) {
                    slot = 0;
                    for (int j = 1; j < frameCount; j++) {
                        if (lastUsed[j] < lastUsed[slot]) {
                            slot = j;
                        }
                    }
                }

                // The new page takes the chosen frame.
                frames[slot] = page;
                lastUsed[slot] = i;
            }

            // Show the frame contents after this reference.
            System.out.printf("Page %3d:", page);
            for (int j = 0; j < frameCount; j++) {
                if (frames[j] == EMPTY) {
                    System.out.print("   -");
                } else {
                    System.out.printf(" %3d", frames[j]);
                }
            }
            System.out.print("   " + (found != -1 ? "HIT" : "FAULT") + "\n");
        }

        System.out.print("\nTotal page faults: " + faults + "\n");
        System.out.print("Total page hits:   " + hits + "\n");
        // Locale.US makes sure the decimal point is printed as a dot.
        System.out.printf(Locale.US, "Fault rate: %.2f%%\n", faults * 100.0 / n);
        System.out.printf(Locale.US, "Hit rate:   %.2f%%\n", hits * 100.0 / n);
    }
}
`,
  },
};
