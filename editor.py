#!/usr/bin/env python3
import re
import sys
from collections import Counter

def tokenize(text):
    # Split on non-word characters, lowercase everything
    return re.findall(r"\b\w+\b", text.lower())

def count_frequencies(filename):
    with open(filename, "r", encoding="utf-8") as f:
        text = f.read()
    words = tokenize(text)
    return Counter(words)

def main():
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <input_file>")
        sys.exit(1)

    filename = sys.argv[1]
    counter = count_frequencies(filename)

    # Print sorted by frequency, then alphabetically
    for word, freq in counter.most_common():
        #print(f"{word}\t{freq}")
        print(f"{word}")

if __name__ == "__main__":
    main()
