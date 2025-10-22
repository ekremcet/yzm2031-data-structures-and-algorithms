#include <iostream>
#include <string>

using namespace std;

string compressString(const string& str) {
    // TODO: Implement string compression
    // Algorithm:
    // 1. Track current character and its count
    // 2. When character changes, append "char + count" to result
    // 3. Don't forget the last character group!
    // 4. Compare lengths and return the shorter string
    
    return str;  // Placeholder
}

int main() {
    cout << "=== Problem 4: String Compression ===" << endl;
    
    // Test 1: String that compresses well
    cout << "\nTest 1 - Good compression:" << endl;
    cout << "Input:  'aabcccccaaa'" << endl;
    cout << "Output: '" << compressString("aabcccccaaa") << "'" << endl;
    // Expected: "a2b1c5a3"
    
    // Test 2: String that doesn't compress
    cout << "\nTest 2 - No compression benefit:" << endl;
    cout << "Input:  'abc'" << endl;
    cout << "Output: '" << compressString("abc") << "'" << endl;
    // Expected: "abc"
    
    // Test 3: String with same compressed length
    cout << "\nTest 3 - Same length:" << endl;
    cout << "Input:  'aabbcc'" << endl;
    cout << "Output: '" << compressString("aabbcc") << "'" << endl;
    // Expected: "aabbcc"
    
    // Test 4: Long run of same character
    cout << "\nTest 4 - Long run:" << endl;
    cout << "Input:  'aaaaaaaaaa' (10 a's)" << endl;
    cout << "Output: '" << compressString("aaaaaaaaaa") << "'" << endl;
    // Expected: "a10"
    
    // Test 5: All different characters
    cout << "\nTest 5 - All different:" << endl;
    cout << "Input:  'abcdefg'" << endl;
    cout << "Output: '" << compressString("abcdefg") << "'" << endl;
    // Expected: "abcdefg"
    
    // Test 6: Empty string
    cout << "\nTest 6 - Empty string:" << endl;
    cout << "Input:  ''" << endl;
    cout << "Output: '" << compressString("") << "'" << endl;
    // Expected: ""
    
    // Test 7: Single character
    cout << "\nTest 7 - Single character:" << endl;
    cout << "Input:  'a'" << endl;
    cout << "Output: '" << compressString("a") << "'" << endl;
    // Expected: "a"
    
    // Test 8: Multiple groups
    cout << "\nTest 8 - Multiple groups:" << endl;
    cout << "Input:  'aaabbbccc'" << endl;
    cout << "Output: '" << compressString("aaabbbccc") << "'" << endl;
    // Expected: "a3b3c3"
    
    return 0;
}
