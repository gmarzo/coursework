#include <cassert>
#include <iostream>
#include <sstream>
#include <string>
#include "./say.h"
#include "./queue.h"

using namespace std;

void test_say() {
  assert(say() == "");
  assert(say("")() == "");
  assert(say("hello")() == "hello");
  assert(say("hello")("my")("name")("is")() == "hello my name is");
  // Test partial application
  auto s = say("One")("two");
  assert(s("three")() == "One two three");
  assert(s("four")() == "One two four");
}

void test_empty_queue_has_zero_size() {
  Queue<string> q;
  assert(q.get_size() == 0);
}

void test_some_insertions_and_deletions() {
  Queue<string> q;
  q.enqueue("one");
  assert(q.get_size() == 1);
  q.enqueue("two");
  q.enqueue("three");
  assert(q.get_size() == 3);
  assert(q.dequeue() == "one");
  assert(q.get_size() == 2);
  assert(q.dequeue() == "two");
  assert(q.dequeue() == "three");
  q.enqueue("four");
  assert(q.get_size() == 1);
}

void test_copy_constructor() {
  Queue<int> p;
  p.enqueue(5);
  Queue<int> q(p);
  assert(q.get_size() == 1);
  q.enqueue(10);
  q.enqueue(15);
  q.enqueue(12);
  q.dequeue();
  assert(p.get_size() == 1);
  assert(q.get_size() == 3);
}

void test_copy_assignment() {
  Queue<int> p;
  p.enqueue(5);
  p.enqueue(8);
  Queue<int> q;
  q = p;
  assert(q.get_size() == 2);
  q.enqueue(10);
  assert(p.get_size() == 2);
}

Queue<int> one_two_three() {
  Queue<int> q;
  for (int i = 1; i <= 3; i++) {
    q.enqueue(i);
  }
  return q;
}

void test_moves() {
  // Assignment of a temporary is a move
  Queue<int> p = Queue<int>();

  // Construction via a function return call is a move
  Queue<int> q = one_two_three();
  assert(q.get_size() == 3);
  assert(q.dequeue() == 1);

  // Test move assignment
  q = one_two_three();
  assert(q.get_size() == 3);
  assert(q.dequeue() == 1);
}

void test_dequeue_from_empty_queue_throws_underflow_error() {
  Queue<bool> q;
  try {
    q.dequeue();
    assert(false);
  } catch (const underflow_error &ue) {
    assert(true);
  } catch (...) {
    // Caught the wrong exception
    assert(false);
  }
}

void test_print_empty_queue() {
  Queue<int> q;
  stringstream s;
  s << q;
  assert(s.str() == "[]");
}

void test_print_one_element_queue() {
  Queue<int> q;
  q.enqueue(5);
  stringstream s;
  s << q;
  assert(s.str() == "[5]");
}

void test_many_element_queue() {
  Queue<int> q;
  q.enqueue(5);
  q.enqueue(2);
  q.enqueue(8);
  q.enqueue(13);
  stringstream s;
  s << q;
  assert(s.str() == "[5,2,8,13]");
}

int main() {
  test_say();
  test_empty_queue_has_zero_size();
  test_some_insertions_and_deletions();
  test_dequeue_from_empty_queue_throws_underflow_error();
  test_copy_constructor();
  test_copy_assignment();
  test_moves();
  test_print_empty_queue();
  test_print_one_element_queue();
  test_many_element_queue();
  cout << "All tests passed\n";
}