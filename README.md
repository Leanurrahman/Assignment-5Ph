 1.What is the difference between var, let, and const?

 Ans: The difference between var,let,const are given below
 
 var: Old way. It is function-scoped (leaks out of blocks like if or for). We can change its value. Avoid using this.

let: Modern way. It is block-scoped (stays inside { }). We can change its value later. Use this for counters or changing data.

const: Modern way. It is block-scoped. We cannot change its value once assigned. Use this by default for everything.

2.What is the spread operator (...)?

And: It "unpacks" elements from an array or object so you can use them individually. It's great for copying or merging lists without changing the original.

3.What is the difference between map(), filter(), and forEach()?

Ans: The difference between map(), filter(), and forEach() are given below

map(): Transforms every item in a list and returns a new list. (e.g., turning names into uppercase).

filter(): Checks items and keeps only the ones that pass a test. Returns a new, shorter list. (e.g., getting only active users).

forEach(): Just loops through the list to do something (like printing). It returns nothing.

4.What is an arrow function?

Ans: It is a shorter, cleaner way to write functions using =>.
The biggest benefit is that it automatically uses the this from the surrounding code, which prevents bugs in callbacks.


5.What are template literals?

Ans: These are strings written with backticks (`) instead of quotes. They allow you to put variables directly inside the string using ${} and make multi-line text easy.

