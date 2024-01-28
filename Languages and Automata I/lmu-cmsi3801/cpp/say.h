// use this to test - https://onlinegdb.com/5ye6SuwSO

#include <string>

using namespace std;

struct Say {
    Say(){};
    string result = "";
    
    string operator()(){
        return result;
    };
    
    Say operator()(string word){
        Say fragment; // foo, tempfoocount, sentence, sent_part, 
        if (result == "") {
            fragment.result += (word);
        } else {
            fragment.result += (this->result + " " + word);
        }
        return fragment;
    };
};

extern Say say;
