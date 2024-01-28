// use this to test - https://onlinegdb.com/5ye6SuwSO

#include "say.h"

Say::Say() : result("") {}

Say::Say(string word) : result(word) {}

Say Say::operator()(string word) {
    return result.append(" " + word);
}

string Say::operator()() {
    return result;
}
